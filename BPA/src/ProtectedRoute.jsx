import React, { useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";

function ProtectedRoute() {
    const { loading, isAuthenticated, user, initialLoading } = useAuth();
    const location = useLocation();
    const currentPath = location.pathname;

    // Solo verificar autenticación si aún está en carga inicial
    useEffect(() => {
        if (initialLoading) {
            checkAuth();
        }
    }, [initialLoading, location.pathname]);

    if (initialLoading) return <h1>Cargando...</h1>;
    
    if (!isAuthenticated) {
        return <Navigate to='/login' state={{ from: location }} replace />;
    }
    
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