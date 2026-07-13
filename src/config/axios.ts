import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

// Interceptor para agregar el token de autenticación a cada solicitud
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("AUTH_TOKEN");
  if (token) {
    // Uso de .set() para asegurar compatibilidad en Axios 1.x+
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

// Interceptor para manejar errores globales
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Verificamos si el error es 401
    if (error.response && error.response.status === 401) {
      
      // Evitamos actuar si el error viene precisamente de la petición de login
      const isLoginRequest = error.config.url.includes("/login"); 

      if (!isLoginRequest) {
        // Solo limpiamos y redirigimos si NO estábamos intentando loguearnos
        localStorage.removeItem("AUTH_TOKEN");
        window.location.href = "/auth/login";
      }
    }

    return Promise.reject(error);
  },
);

export default api;