import { createContext, useState, useContext, useEffect } from "react";
import { registerRequest, loginRequest, verityTokenRequest } from '../api/auth'
import axios from 'axios';
import Cookies from "js-cookie";


export const AuthContext = createContext()

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenicated] = useState(false)
    const [errors, setErrors] = useState([])
    const [loading, setLoading] = useState(true)

    const signup = async (user) => {
        try {
            const res = await registerRequest(user)
            console.log(res.data)
            setUser(res.data)
            setIsAuthenicated(true)
        } catch (error) {
            console.log(error.response)
            setErrors(error.response.data)
        }
    }

    const signin = async (user) => {
        try {
            const res = await loginRequest(user)
            setUser(res.data)
            setIsAuthenicated(true)
        } catch (error) {
            if (Array.isArray(error.response.data)) {
                return setErrors(error.response.data)
            }
            setErrors([error.response.data.message || "Credenciales incorrectas"])
        }
    }

    const logout = () => {
        Cookies.remove('token')
        setIsAuthenicated(false)
        setUser(null)
    }

    const refreshUser = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/profile', {
          withCredentials: true, // <- ¡Añade esto para enviar cookies!
        });
        
        setUser(prev => ({
          ...prev,
          ...res.data // Combina los datos antiguos con los nuevos
        }));
        
      } catch (error) {
        console.error("Error al actualizar usuario:", error);
      }
    };

    useEffect(() => {
        if (errors.length > 0) {
            const timer = setTimeout(() => {
                setErrors([])
            }, 5000)
            return () => clearTimeout(timer)
        }
    }, [errors])

    useEffect(() => {
        async function checkLogin() {
          try {
            const res = await verityTokenRequest(); // Sin parámetros
            if (!res.data) {
              setIsAuthenicated(false);
              setLoading(false);
              return;
            }
            setUser({
              ...res.data,
              id: res.data.id
                
            }); 
            setIsAuthenicated(true);
            setLoading(false);
          } catch (error) {
            setIsAuthenicated(false);
            setUser(null);
            setLoading(false);
          }
        }
        checkLogin();
      }, []);

return (
    <AuthContext.Provider
        value={{
            signup,
            signin,
            logout,
            refreshUser,
            loading, 
            user,
            isAuthenticated,
            errors
        }}>
        {children}
    </AuthContext.Provider>
)
}