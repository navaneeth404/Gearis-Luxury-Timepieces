import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

// Attach the saved admin JWT (if any) to every outgoing request
api.interceptors.request.use((config) => {
  const admin = JSON.parse(localStorage.getItem("gearisAdmin"));
  if (admin?.token) {
    config.headers.Authorization = `Bearer ${admin.token}`;
  }
  return config;
});

export default api;