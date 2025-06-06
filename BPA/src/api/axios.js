// src/config/axios.js
import axios from "axios";

// Obtiene la URL base desde las variables de entorno
const baseURL = import.meta.env.VITE_API_URL || "https://bpa-ftmu.onrender.com";

const instance = axios.create({
  baseURL: `${baseURL}/api`,
  withCredentials: true,
  timeout: 15000, // 15 segundos de timeout
});

// Interceptor para manejar errores globalmente
instance.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.error("Error de respuesta:", {
        status: error.response.status,
        data: error.response.data,
        url: error.response.config.url
      });
    } else if (error.request) {
      console.error("Error de red:", error.request);
    } else {
      console.error("Error de configuración:", error.message);
    }
    
    return Promise.reject(error);
  }
);

// Agrega un interceptor para solicitudes
instance.interceptors.request.use(config => {
  config.withCredentials = true; // Forzar en todas las solicitudes
  return config;
});

export default instance;