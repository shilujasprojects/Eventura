import api from "./api";

export const fetchNotifications = (params = {}) => api.get("/api/notifications", { params });
export const markNotificationRead = (id) => api.patch(`/api/notifications/${id}/read`);
export const dismissNotification = (id) => api.patch(`/api/notifications/${id}/dismiss`);
export const markAllNotificationsRead = () => api.patch("/api/notifications/mark-all-read");