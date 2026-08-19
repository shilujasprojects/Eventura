import React, { useState, useEffect } from "react";
import { ShieldAlert, Bell, CheckCheck, Trash2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import AdminLayout from "../../Pages/Admin/Layout/AdminLayout";
import {
  fetchNotifications,
  markNotificationRead,
  dismissNotification,
  markAllNotificationsRead,
} from "../../api/notificationApi";
import "../Shared/Admin.css";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "urgent", label: "Urgent" },
  { key: "general", label: "General" },
];

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const params = filter !== "all" ? { priority: filter } : {};
        const res = await fetchNotifications(params);
        setNotifications(res.data.data);
      } catch (error) {
        toast.error("Couldn't load notifications.");
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
    const interval = setInterval(loadNotifications, 20000);
    return () => clearInterval(interval);
  }, [filter]);

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
    } catch (error) {
      toast.error("Could not mark as read.");
    }
  };

  const handleDismiss = async (id) => {
    try {
      await dismissNotification(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isDismissed: true, isRead: true } : n))
      );
      toast.success("Notification dismissed from dashboard.");
    } catch (error) {
      toast.error("Could not dismiss notification.");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success("All notifications marked as read.");
    } catch (error) {
      toast.error("Could not mark all as read.");
    }
  };

  return (
    <AdminLayout>
      <div className="adminDashboard">
        <div className="adminDashboard-welcome">
          <div>
            <h1>Notifications</h1>
            <p>Every system alert — urgent items need your attention first, general ones are for awareness.</p>
          </div>
          <button className="sidebar-logout-btn" style={{ width: "auto", padding: "10px 18px" }} onClick={handleMarkAllRead}>
            <CheckCheck size={16} /> Mark all as read
          </button>
        </div>

        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className="shortcut-action-item"
              style={{
                width: "auto",
                padding: "8px 16px",
                background: filter === f.key ? "rgba(241,212,155,0.06)" : "transparent",
                borderColor: filter === f.key ? "#f1d49b" : "rgba(241,212,155,0.06)",
                color: filter === f.key ? "#f1d49b" : "#fff7ee",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="operations-card">
          {loading ? (
            <p style={{ color: "#8a9ba8" }}>Loading notifications...</p>
          ) : notifications.length === 0 ? (
            <p style={{ color: "#8a9ba8" }}>No notifications here.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {notifications.map((n) => (
                <div
                  key={n._id}
                  className="dashboard-alert-card"
                  style={{
                    borderLeftColor: n.priority === "urgent" ? "#ef4444" : "#f1d49b",
                    opacity: n.isRead ? 0.6 : 1,
                  }}
                >
                  <div className="alert-content">
                    {n.priority === "urgent" ? (
                      <ShieldAlert size={18} style={{ color: "#ef4444" }} />
                    ) : (
                      <Bell size={18} className="alert-warning-icon" />
                    )}
                    <span className="alert-text">
                      <strong>{n.priority === "urgent" ? "Urgent: " : ""}</strong>
                      {n.message}
                    </span>
                    <span className="alert-time">{new Date(n.createdAt).toLocaleString()}</span>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {!n.isRead && (
                      <button className="alert-dismiss-btn" title="Mark as read" onClick={() => handleMarkRead(n._id)}>
                        <CheckCheck size={16} />
                      </button>
                    )}
                    {!n.isDismissed && (
                      <button className="alert-dismiss-btn" title="Dismiss from dashboard" onClick={() => handleDismiss(n._id)}>
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </AdminLayout>
  );
};

export default NotificationsPage;