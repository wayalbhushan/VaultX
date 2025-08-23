import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const setAuthToken = (token) => {
  if (token) API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete API.defaults.headers.common["Authorization"];
};

// ⬇️ Add this interceptor
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem("vaultxToken");
      delete API.defaults.headers.common["Authorization"];
      window.location.replace("/get-started");
    }
    return Promise.reject(err);
  }
);

export default API;
