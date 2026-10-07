import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

// Attach the saved JWT (if any) to every outgoing request
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("gearisUser"));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default api;