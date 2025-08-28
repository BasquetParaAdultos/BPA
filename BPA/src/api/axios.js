// src/config/axios.js
import axios from "axios";

// Obtiene la URL base desde las variables de entorno
const baseURL = import.meta.env.VITE_API_URL 

const instance = axios.create({
  baseURL: `${baseURL}/api`,
  withCredentials: true,
  timeout: 15000, // 15 segundos de timeout
});

// Interceptor para solicitudes (se mantiene igual)
instance.interceptors.request.use(config => {
  config.withCredentials = true;
  return config;
}, error => {
  return Promise.reject(error);
});

// Interceptor para manejar errores globales (CORREGIDO)
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
        
        // Manejar error 401 específicamente (CORRECCIÓN APLICADA)
        if (error.response.status === 401) {
          // Solo limpiar el estado local, no redirigir aquí
          localStorage.removeItem('authState');
          
          // Limpiar cookie del frontend (aunque es httpOnly, esto fuerza la expiración en el cliente)
          document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
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