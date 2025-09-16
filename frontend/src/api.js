// src/api.js
import axios from "axios";

const baseURL =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_API_BASE_URL_LOCAL
    : process.env.REACT_APP_API_BASE_URL_DEPLOY;

const API = axios.create({
  baseURL,
});

// Attach access token if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-refresh token if access token expired
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refresh = localStorage.getItem("refresh");
      if (refresh) {
        try {
          const res = await axios.post(`${baseURL}token/refresh/`, { refresh });
          localStorage.setItem("access", res.data.access);

          // retry the original request with new token
          error.config.headers.Authorization = `Bearer ${res.data.access}`;
          return API(error.config);
        } catch (refreshErr) {
          console.error("Refresh failed, logging out");
          localStorage.clear();
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default API;
