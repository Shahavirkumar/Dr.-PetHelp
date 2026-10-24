import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token to every request (if present)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("petHelpToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle common errors globally (expired token, network errors, etc.)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // Network error — backend unreachable
      error.friendlyMessage = "Unable to reach the server. Please check your connection.";
    } else if (error.response.status === 401) {
      // Expired / invalid token — log the user out
      localStorage.removeItem("petHelpToken");
      error.friendlyMessage = "Your session has expired. Please log in again.";
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    } else if (error.response.status >= 500) {
      error.friendlyMessage = "Something went wrong on our end. Please try again shortly.";
    } else {
      error.friendlyMessage =
        error.response.data?.detail || error.response.data?.message || "Something went wrong.";
    }
    return Promise.reject(error);
  }
);

export default api;