import React from "react";
import { useAuth } from "./context/AuthContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";

function ProtectedRoute() {
    const { loading, isAuthenticated, user } = useAuth();
    const location = useLocation(); // Obtener la ubicación actual
    const currentPath = location.pathname; // Extraer el path de la URL

    if (loading) return <h1>Cargando...</h1>;
    if (!loading && !isAuthenticated) return <Navigate to='/login' replace />;
    
    // Verificar pago solo para la ruta /classes
    if (currentPath === '/classes' && user?.payment_status !== 'paid') {
        return <Navigate to="/tasks" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;