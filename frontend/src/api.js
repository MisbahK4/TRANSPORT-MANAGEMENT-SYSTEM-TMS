import axios from 'axios'

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
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
