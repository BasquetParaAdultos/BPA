import { createContext, useState, useContext, useEffect, useCallback } from "react";
import axios from '../api/axios'; // Importa tu instancia configurada de Axios
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [initialLoading, setInitialLoading] = useState(true);

    // Función para limpiar errores después de 5 segundos
    useEffect(() => {
        if (errors.length > 0) {
            const timer = setTimeout(() => {
                setErrors([]);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [errors]);

    // En tu AuthContext, añade esto al inicializar
    useEffect(() => {
        const checkCookie = async () => {
            const hasToken = document.cookie.includes('token');
            if (hasToken && !isAuthenticated) {
                await checkAuth();
            }
        };

        checkCookie();
    }, []);

    const signup = async (userData) => {
        try {
            const res = await axios.post('/register', userData);
            setUser(res.data);
            setIsAuthenticated(true);
            return res.data;
        } catch (error) {
            // Manejo de errores mejorado
            const errorData = error.response?.data || { message: "Error desconocido" };
            setErrors(Array.isArray(errorData) ? errorData : [errorData.message]);
            throw error;
        }
    };

    const signin = async (credentials) => {
        try {
            const res = await axios.post('/login', credentials);
            setUser(res.data);
            setIsAuthenticated(true);
            return res.data;
        } catch (error) {
            // Manejo de errores mejorado
            const errorData = error.response?.data || { message: "Credenciales incorrectas" };
            setErrors(Array.isArray(errorData) ? errorData : [errorData.message]);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await axios.post('/logout');
        } catch (error) {
            console.error("Error en logout:", error);
        } finally {
            Cookies.remove('token');
            setIsAuthenticated(false);
            setUser(null);
        }
    };

    const refreshUser = useCallback(async () => {
        try {
            const res = await axios.get('/profile', {
                headers: { 'Cache-Control': 'no-store' } // Evitar caché
            });
            setUser(res.data);
            return res.data;
        } catch (error) {
            console.error("Error actualizando usuario:", error.response?.data);
            // Si no podemos refrescar, consideramos que la sesión es inválida
            if (error.response?.status === 401) {
                logout();
            }
            throw error;
        }
    }, []);

    // En checkAuth
    const checkAuth = useCallback(async () => {
        try {
            const res = await axios.get('/verify');

            if (res.data.authenticated) {
                setUser({
                    ...res.data.user,
                    id: res.data.user.id || res.data.user._id
                });
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
                setUser(null);
            }
        } catch (error) {
            setIsAuthenticated(false);
            setUser(null);
            console.error("Error en verificación:", error);
        } finally {
            setLoading(false);
            setInitialLoading(false); // Importante!
        }
    }, []);

    // Verificar autenticación solo una vez al montar
    useEffect(() => {
        if (initialLoading) {
            checkAuth();
        }
    }, [initialLoading]);


    // Manejo centralizado de errores de autenticación
    const handleAuthError = (error) => {
        const response = error.response;

        if (!response) {
            setErrors(["Error de red. Verifica tu conexión"]);
            return;
        }

        if (response.status === 401) {
            setErrors(["Credenciales inválidas"]);
        } else if (response.status === 400) {
            if (Array.isArray(response.data)) {
                setErrors(response.data);
            } else if (response.data.message) {
                setErrors([response.data.message]);
            } else {
                setErrors(["Datos inválidos"]);
            }
        } else if (response.status === 500) {
            setErrors(["Error interno del servidor"]);
        } else {
            setErrors([`Error inesperado: ${response.status}`]);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                signup,
                signin,
                logout,
                refreshUser,
                checkAuth,
                initialLoading,
                loading,
                user,
                isAuthenticated,
                errors
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};