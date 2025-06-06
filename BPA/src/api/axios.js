// src/config/axios.js
import axios from "axios";

// Obtiene la URL base desde las variables de entorno
const baseURL = import.meta.env.VITE_API_URL || "https://bpa-ftmu.onrender.com";

const instance = axios.create({
  baseURL: `${baseURL}/api`,
  withCredentials: true,
  timeout: 15000, // 15 segundos de timeout
});

// Interceptor para solicitudes: ya está bien
instance.interceptors.request.use(config => {
  config.withCredentials = true; // Forzar en todas las solicitudes
  return config;
});

// Interceptor para manejar errores globalmente (CORREGIDO)
instance.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.error("Error de respuesta:", {
        status: error.response.status,
        data: error.response.data,
        url: error.response.config.url
      });
      
      // Manejar error 401 específicamente
      if (error.response.status === 401) {
        // 1. Limpiar la cookie token en el frontend
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.onrender.com;';
        
        // 2. Redirigir a login
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    } else if (error.request) {
      console.error("Error de red:", error.request);
    } else {
      console.error("Error de configuración:", error.message);
    }
    
    return Promise.reject(error);
  }
);

export default instance;