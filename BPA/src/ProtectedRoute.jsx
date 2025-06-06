import React from "react";
import { useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";

function ProtectedRoute() {
    const { loading, isAuthenticated, user } = useAuth();
    const location = useLocation();
    const currentPath = location.pathname;

    // Verificar autenticación al cambiar de ruta
    useEffect(() => {
        checkAuth();
    }, [location.pathname])

    if (loading) return <h1>Cargando...</h1>;
    if (!loading && !isAuthenticated) return <Navigate to='/login' state={{ from: location }} replace />;
    
    // Nueva verificación de suscripción
    if (currentPath === '/classes') {
        const isSubscriptionValid = user?.subscription?.active && 
                                  new Date(user.subscription.expiresAt) > new Date();
        
        if (!isSubscriptionValid) {
            return <Navigate to="/tasks" replace />;
        }
    }

    return <Outlet />;
}

export default ProtectedRoute;