import axios from "axios";

// Crea una instancia base de Axios con configuración común
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api" || "https://bpa-ftmu.onrender.com/api",
  withCredentials: true,
  timeout: 10000, // 10 segundos de timeout
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  }
});

// Interceptor para manejar errores globalmente
instance.interceptors.response.use(
  response => response,
  error => {
    // Manejo centralizado de errores
    if (error.response) {
      // El servidor respondió con un estado fuera del rango 2xx
      console.error("Error de respuesta:", {
        status: error.response.status,
        data: error.response.data,
        url: error.response.config.url
      });
    } else if (error.request) {
      // La petición fue hecha pero no se recibió respuesta
      console.error("Error de red:", error.request);
    } else {
      // Error al configurar la petición
      console.error("Error de configuración:", error.message);
    }
    
    return Promise.reject(error);
  }
);

export default instance;