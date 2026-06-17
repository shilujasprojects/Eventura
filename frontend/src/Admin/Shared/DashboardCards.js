import React, { useState } from "react";
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
  MessageSquare
} from "lucide-react";

import "./Admin.css";
import AdminLayout from "../../Pages/Admin/Layout/AdminLayout";

// Mock live data for the dashboard elements
const MOCK_UPCOMING_EVENTS = [
  { id: "EV-9401", client: "Rahul Sharma", event: "Royal Heritage Wedding", date: "24 Oct 2026", location: "Fort Kochi", status: "Confirmed" },
  { id: "EV-9402", client: "Anita Joseph", event: "Neon Beats Birthday", date: "05 Nov 2026", location: "Trivandrum", status: "Pending Deposit" },
  { id: "EV-9403", client: "Vikram Malhotra", event: "Corporate Tech Conclave", date: "12 Nov 2026", location: "Kochi Infopark", status: "Confirmed" }
];

const MOCK_SYSTEM_ALERTS = [
  { id: 1, type: "payment", message: "Manual UPI payment receipt uploaded by Anita Joseph for verification.", time: "10 mins ago" },
  { id: 2, type: "inquiry", message: "New custom catering catalog inquiry received from Divya Pillai.", time: "1 hour ago" }
];

const DashboardCards = () => {
  const [upcomingEvents, setUpcomingEvents] = useState(MOCK_UPCOMING_EVENTS);
  const [alerts, setAlerts] = useState(MOCK_SYSTEM_ALERTS);

  // Dynamic calculations for cards
  const stats = [
    {
      label: "Total Bookings",
      value: "48",
      growth: "+12% this month",
      isPositive: true,
      icon: Calendar,
    },
    {
      label: "Revenue This Month",
      value: "₹8.4L",
      growth: "+8.3% vs last month",
      isPositive: true,
      icon: CreditCard,
    },
    {
      label: "Active Clients",
      value: "214",
      growth: "+5 new this week",
      isPositive: true,
      icon: Users,
    },
    {
      label: "Client Rating",
      value: "4.9",
      growth: "+0.1 this quarter",
      isPositive: true,
      icon: Star,
    },
  ];

  // Dismiss a live alert notification
  const handleDismissAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  return (
    <AdminLayout>
      <div className="adminDashboard">
        
        {}
        {/* Section 1: Dynamic Dashboard Welcome Banner */}
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

        {}
        {/* Section 2: Real-time Admin Action Alerts */}
        {alerts.length > 0 && (
          <div className="dashboard-alerts-section">
            {alerts.map((alert) => (
              <div key={alert.id} className="dashboard-alert-card">
                <div className="alert-content">
                  <ShieldAlert size={18} className="alert-warning-icon" />
                  <span className="alert-text"><strong>Action Required:</strong> {alert.message}</span>
                  <span className="alert-time">{alert.time}</span>
                </div>
                <button className="alert-dismiss-btn" onClick={() => handleDismissAlert(alert.id)}>&times;</button>
              </div>
            ))}
          </div>
        )}

        {}
        {/* Section 3: Primary KPI Metric Summary Cards */}
        <div className="adminDashboardCards-container">
          {stats.map((card, index) => {
            const Icon = card.icon;
            return (
              <div key={index} className="adminDashboardCards-card">
                <div className="card-header-row">
                  <span className="card-label">{card.label}</span>
                  <div className="adminDashboardCards-icon">
                    <Icon size={18} />
                  </div>
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

        {}
        {/* Section 4: Split Layout for Live Operational Tracking */}
        <div className="dashboard-operational-grid">
          
          {/* Left Side: Live Upcoming Bookings Table */}
          <div className="operations-card upcoming-bookings-panel">
            <div className="panel-header">
              <h3>Live Event Pipeline</h3>
              <p>Active and pending heritage assemblies across regional nodes.</p>
            </div>

            <div className="bookings-preview-table-wrapper">
              <table className="bookings-preview-table">
                <thead>
                  <tr>
                    <th>Event details</th>
                    <th>Date / Location</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingEvents.map((item) => (
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
                          <span className="loc-txt">
                            <MapPin size={12} /> {item.location}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className={`status-pill ${item.status.toLowerCase().replace(/\s+/g, '-')}`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Side: Quick Shortcuts & Controls */}
          <div className="operations-card quick-actions-panel">
            <div className="panel-header">
              <h3>Management Shortcuts</h3>
              <p>Quick pathways to onboard vendors, audit ledger, or support desks.</p>
            </div>

            <div className="quick-shortcuts-list">
              <button className="shortcut-action-item">
                <div className="shortcut-meta">
                  <PlusCircle size={18} className="shortcut-icon" />
                  <div>
                    <strong>Onboard Service Partner</strong>
                    <span>Register a new vendor in Kochi/Trivandrum</span>
                  </div>
                </div>
                <ArrowRight size={16} className="arrow-right-icon" />
              </button>

              <button className="shortcut-action-item">
                <div className="shortcut-meta">
                  <CreditCard size={18} className="shortcut-icon" />
                  <div>
                    <strong>Audit Balance Ledger</strong>
                    <span>Verify awaiting deposits and screen slips</span>
                  </div>
                </div>
                <ArrowRight size={16} className="arrow-right-icon" />
              </button>

              <button className="shortcut-action-item">
                <div className="shortcut-meta">
                  <MessageSquare size={18} className="shortcut-icon" />
                  <div>
                    <strong>Respond to Inquiries</strong>
                    <span>Review customer contact submissions</span>
                  </div>
                </div>
                <ArrowRight size={16} className="arrow-right-icon" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </AdminLayout>
    
  );
};

export default DashboardCards;