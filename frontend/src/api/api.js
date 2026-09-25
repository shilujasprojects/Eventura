import axios from "axios";

export const API_URL = process.env.REACT_APP_API_URL  || "http://localhost:5000";

export const ENDPOINTS = {
  category: `${API_URL}/api/category`,
  event: `${API_URL}/api/events`,
  package: `${API_URL}/api/packages`,
  service: `${API_URL}/api/services`,
};

export const IMG_URL = `${API_URL}/uploads/`;

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;