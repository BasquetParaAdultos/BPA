// src/config/axios.js
import axios from "axios";

// Obtiene la URL base desde las variables de entorno
const baseURL = import.meta.env.VITE_API_URL || "https://bpa-ftmu.onrender.com";

const instance = axios.create({
  baseURL: `${baseURL}/api`,
  withCredentials: true,
  timeout: 15000, // 15 segundos de timeout
});

// Interceptor para solicitudes
instance.interceptors.request.use(config => {
  config.withCredentials = true;
  return config;
}, error => {
  return Promise.reject(error);
});

// Interceptor para manejar errores globales (MEJORADO)
instance.interceptors.response.use(
  response => response,
  error => {
    // Solo manejar errores en el lado del cliente
    if (typeof window !== 'undefined') {
      if (error.response) {
        console.error("Error de respuesta:", {
          status: error.response.status,
          data: error.response.data,
          url: error.response.config.url
        });
        
        // Manejar error 401 específicamente
        if (error.response.status === 401) {
          // Evitar bucles: no redirigir si ya estamos en login
          if (window.location.pathname !== '/login') {
            // 1. Limpiar la cookie token en el frontend
            document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.onrender.com;';
            
            // 2. Limpiar localStorage
            localStorage.removeItem('authState');
            
            // 3. Redirigir con retraso para evitar conflictos
            setTimeout(() => {
              window.location.href = '/login';
            }, 100);
          }
        }
      } else if (error.request) {
        console.error("Error de red:", error.request);
      } else {
        console.error("Error de configuración:", error.message);
      }
    }
    
    return Promise.reject(error);
  }
);

export default instance;