import api from "./axios";

export const fetchNotifications = (params = {}) => api.get("/notifications", { params });
export const markNotificationRead = (id) => api.patch(`/notifications/${id}/read`);
export const dismissNotification = (id) => api.patch(`/notifications/${id}/dismiss`);
export const markAllNotificationsRead = () => api.patch("/notifications/mark-all-read");