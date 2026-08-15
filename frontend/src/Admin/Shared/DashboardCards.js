import React, { useState, useEffect, useCallback } from "react";
import {
  Calendar,
  CreditCard,
  Users,
  Star,
  TrendingUp,
  TrendingDown,
  Clock,
  PlusCircle,
  ArrowRight,
  ShieldAlert,
  MapPin,
  MessageSquare,
} from "lucide-react";
import { toast, ToastContainer  } from "react-toastify";


import "./Admin.css";
import AdminLayout from "../../Pages/Admin/Layout/AdminLayout";
import { fetchDashboardStats } from "../../api/dashboardApi";
import { dismissNotification } from  "../../api/notificationApi";
import { useNavigate } from "react-router-dom";

const POLL_INTERVAL = 20000; // 20s — keeps alerts feeling "live" without needing sockets

const DashboardCards = () => {
  const [stats, setStats] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const loadDashboard = useCallback(async (isBackgroundRefresh = false) => {
    try {
      const res = await fetchDashboardStats();
      const { stats, upcomingEvents, alerts } = res.data.data;
      setStats(stats);
      setUpcomingEvents(upcomingEvents);
      setAlerts(alerts);
    } catch (error) {
      if (!isBackgroundRefresh) {
        toast.error("Couldn't load dashboard data. Please refresh the page.");
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
    const interval = setInterval(() => loadDashboard(true), POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [loadDashboard]);

  const handleDismissAlert = async (id) => {
    // Remove instantly from the screen, then confirm with the server
    setAlerts((prev) => prev.filter((alert) => alert._id !== id));
    try {
      await dismissNotification(id);
    } catch (error) {
      toast.error("Could not dismiss the alert — it may reappear on refresh.");
    }
  };

  const statCards = stats
    ? [
        { label: "Total Bookings", value: stats.totalBookings, growth: stats.bookingsChange, isPositive: stats.bookingsUp, icon: Calendar },
        { label: "Revenue This Month", value: `₹${(stats.revenueThisMonth / 100000).toFixed(1)}L`, growth: stats.revenueChange, isPositive: stats.revenueUp, icon: CreditCard },
        { label: "Active Clients", value: stats.activeClients, growth: `+${stats.newClientsThisWeek} new this week`, isPositive: true, icon: Users },
        { label: "Client Rating", value: stats.clientRating || "—", growth: "Based on client testimonials", isPositive: true, icon: Star },
      ]
    : [];

  if (loading) {
    return (
      <AdminLayout>
        <div className="adminDashboard">
          <p style={{ color: "#8a9ba8" }}>Loading dashboard...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="adminDashboard">
        <div className="adminDashboard-welcome">
          <div>
            <h1>Heritage Celebrations Desk</h1>
            <p>Welcome back, Administrator. Here is your current operations checklist and platform performance overview.</p>
          </div>
          <div className="system-time-badge">
            <Clock size={14} />
            <span>Operational Mode: Active</span>
          </div>
        </div>

        {alerts.length > 0 && (
          <div className="dashboard-alerts-section">
            {alerts.map((alert) => (
              <div key={alert._id} className="dashboard-alert-card">
                <div className="alert-content">
                  <ShieldAlert size={18} className="alert-warning-icon" />
                  <span className="alert-text"><strong>Action Required:</strong> {alert.message}</span>
                  <span className="alert-time">{new Date(alert.createdAt).toLocaleString()}</span>
                </div>
                <button className="alert-dismiss-btn" onClick={() => handleDismissAlert(alert._id)}>&times;</button>
              </div>
            ))}
          </div>
        )}

        <div className="adminDashboardCards-container">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div key={index} className="adminDashboardCards-card">
                <div className="card-header-row">
                  <span className="card-label">{card.label}</span>
                  <div className="adminDashboardCards-icon"><Icon size={18} /></div>
                </div>
                <h2>{card.value}</h2>
                <div className={`adminDashboardCards-growth ${card.isPositive ? "positive" : "negative"}`}>
                  {card.isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  <span>{card.growth}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="dashboard-operational-grid">
          <div className="operations-card upcoming-bookings-panel">
            <div className="panel-header">
              <h3>Live Event Pipeline</h3>
              <p>Active and pending heritage assemblies across regional nodes.</p>
            </div>

            <div className="bookings-preview-table-wrapper">
              <table className="bookings-preview-table">
                <thead>
                  <tr><th>Event details</th><th>Date / Location</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {upcomingEvents.length === 0 ? (
                    <tr><td colSpan={3} style={{ color: "#8a9ba8", padding: "20px 12px" }}>No upcoming events right now.</td></tr>
                  ) : (
                    upcomingEvents.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="table-primary-cell">
                            <strong>{item.event}</strong>
                            <span>ID: {item.id} • {item.client}</span>
                          </div>
                        </td>
                        <td>
                          <div className="table-secondary-cell">
                            <span className="date-txt">{item.date}</span>
                            <span className="loc-txt"><MapPin size={12} /> {item.location}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`status-pill ${item.status.toLowerCase().replace(/\s+/g, '-')}`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="operations-card quick-actions-panel">
            <div className="panel-header">
              <h3>Management Shortcuts</h3>
              <p>Quick pathways to onboard vendors, audit ledger, or support desks.</p>
            </div>

            <div className="quick-shortcuts-list">
              <button className="shortcut-action-item" onClick={() => navigate('/vendors')} >
                <div className="shortcut-meta">
                  <PlusCircle size={18} className="shortcut-icon" />
                  <div><strong>Onboard Service Partner</strong><span>Register a new vendor in Kochi/Trivandrum</span></div>
                </div>
                <ArrowRight size={16} className="arrow-right-icon"/>
              </button>
              <button className="shortcut-action-item"  onClick={() => navigate('/payments')} >
                <div className="shortcut-meta">
                  <CreditCard size={18} className="shortcut-icon" />
                  <div><strong>Audit Balance Ledger</strong><span>Verify awaiting deposits and screen slips</span></div>
                </div>
                <ArrowRight size={16} className="arrow-right-icon"/>
              </button>
              <button className="shortcut-action-item" onClick={() => navigate('/support')} >
                <div className="shortcut-meta">
                  <MessageSquare size={18} className="shortcut-icon" />
                  <div><strong>Respond to Inquiries</strong><span>Review customer contact submissions</span></div>
                </div>
                <ArrowRight size={16} className="arrow-right-icon"  />
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={4000} theme="dark" />
    </AdminLayout>
  );
};

export default DashboardCards;