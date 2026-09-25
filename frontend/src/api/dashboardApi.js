import api from "./api";

export const fetchDashboardStats = () => api.get("/api/dashboard/stats");