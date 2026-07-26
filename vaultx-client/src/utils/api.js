import axios from "axios";

// Helper to read cookie by name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  withCredentials: true,
});

// Automatically attach CSRF token header for mutating requests
API.interceptors.request.use((config) => {
  const csrfToken = getCookie("csrfToken");
  if (csrfToken && ["post", "put", "delete", "patch"].includes(config.method?.toLowerCase())) {
    config.headers["x-csrf-token"] = csrfToken;
  }
  return config;
});

// Response interceptor with automatic token refresh queueing
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve();
  });
  failedQueue = [];
};

API.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    // Do not attempt refresh on auth endpoints (login, signup, validate-2fa, refresh)
    const isAuthEndpoint = originalRequest?.url?.includes("/auth/");

    if (err?.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => API(originalRequest))
          .catch((retryErr) => Promise.reject(retryErr));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await API.post("/auth/refresh");
        isRefreshing = false;
        processQueue(null);
        return API(originalRequest);
      } catch (refreshErr) {
        isRefreshing = false;
        processQueue(refreshErr);
        if (window.location.pathname !== "/get-started" && window.location.pathname !== "/") {
          window.location.replace("/get-started");
        }
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(err);
  }
);

export default API;
