import axios from "axios";

// Detect environment
const baseURL =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_API_BASE_URL_LOCAL
    : process.env.REACT_APP_API_BASE_URL_DEPLOY;

const API = axios.create({
  baseURL,
});

// Attach token only if it exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && !config.url.includes("marketplace")) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
