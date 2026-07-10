import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

// Interceptor para agregar el token de autenticación a cada solicitud
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("AUTH_TOKEN");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores globales (como el token expirado)
api.interceptors.response.use(
  (response) => {
    // Si la respuesta es exitosa, la dejamos pasar sin cambios
    return response;
  },
  (error) => {
    // Si el backend responde con 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      // 1. Borramos el token que ya no sirve
      localStorage.removeItem("AUTH_TOKEN");

      // 2. Redirigimos al usuario al login de administrador correcto
      // window.location.href hace una recarga completa, lo que limpia
      // cualquier rastro de la sesión anterior en la memoria de React.
      window.location.href = "/auth/login"; // <--- CORREGIDO AQUÍ
    }

    // Retornamos el error para que funciones como getUser() sigan pudiendo atraparlo si es necesario
    return Promise.reject(error);
  },
);

export default api;