import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LayoutDashboard,
  Calendar,
  Briefcase,
  Users,
  UserCheck,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  FileText,
  MessageSquare,
  X,
} from "lucide-react";

import { useLocation, useNavigate } from "react-router-dom";

import logo from "../../Components/Images/logo2.png";
import "./Admin.css";

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const eventManagementPaths = [
    "/adminCategoryEvent",
    "/adminEvents",
    "/adminPackages",
    "/adminServices"
  ];

  const [showEventManagement, setShowEventManagement] = useState(
    eventManagementPaths.includes(location.pathname)
  );

  // Live counts for the sidebar badges — refreshed every 30s.
  // bookings/payments/inquiries = items pending admin action,
  // clients = clients who joined in the last 24 hours.
  const [badgeCounts, setBadgeCounts] = useState({
    bookings: 0,
    clients: 0,
    inquiries: 0,
    payments: 0,
  });

  useEffect(() => {
    const fetchBadgeCounts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/dashboard/badge-counts");
        setBadgeCounts(res.data.data);
      } catch (error) {
        console.error("Failed to load badge counts:", error.message);
      }
    };

    fetchBadgeCounts();
    const interval = setInterval(fetchBadgeCounts, 30000);
    return () => clearInterval(interval);
  }, []);

  const mainMenu = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/adminDashboard" },
    { icon: Briefcase, label: "Bookings", path: "/bookings", badge: badgeCounts.bookings },
    { icon: Users, label: "Clients", path: "/clients", badge: badgeCounts.clients },
  ];

  const managementMenu = [
    { icon: UserCheck, label: "Vendors", path: "/vendors" },
    { icon: CreditCard, label: "Payments", path: "/payments", badge: badgeCounts.payments },
    { icon: BarChart3, label: "Reports & Analytics", path: "/reports" },
    { icon: FileText, label: "Content (CMS)", path: "/Cms" },
    { icon: MessageSquare, label: "Inquiries & Support", path: "/support", badge: badgeCounts.inquiries },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  // --- UPDATED LOGOUT FUNCTION ---
  const handleLogout = () => {
    // 1. Remove all auth data we set during login
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");

    // 2. Navigate back to Auth page ("/") and replace the history
    navigate("/", { replace: true });

    // 3. Force a reload to clear out any leftover React state from memory
    window.location.reload();
  };

  const goTo = (path) => {
    navigate(path);
    onClose && onClose();
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}

      <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
        <button className="sidebar-close-btn" onClick={onClose}>
          <X size={22} />
        </button>

        <div className="sidebar-logo" onClick={() => goTo("/adminDashboard")} style={{ cursor: "pointer" }}>
          <img src={logo} alt="Eventura Logo" className="sidebar-logo-img" />
          <h1 className="sidebar-brand">EVENTURA</h1>
        </div>

        <div className="sidebar-menu-section">
          <p className="sidebar-menu-title">MAIN OPERATING MENU</p>

          {mainMenu.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <div
                key={item.path}
                className={`sidebar-nav-item ${isActive ? "sidebar-nav-active" : ""}`}
                onClick={() => goTo(item.path)}
              >
                <div className="sidebar-nav-left">
                  <Icon size={18} />
                  <span>{item.label}</span>
                </div>

                {item.badge > 0 && (
                  <span className="sidebar-menu-badge">{item.badge}</span>
                )}
              </div>
            );
          })}

          <div>
            <div
              className={`sidebar-nav-item ${eventManagementPaths.includes(location.pathname) ? "sidebar-parent-active" : ""}`}
              onClick={() => setShowEventManagement(!showEventManagement)}
            >
              <div className="sidebar-nav-left">
                <Calendar size={18} />
                <span>Event Management</span>
              </div>
              {showEventManagement ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </div>

            {showEventManagement && (
              <div className="sidebar-submenu">
                <div
                  className={`sidebar-submenu-item ${location.pathname === "/adminCategoryEvent" ? "sidebar-nav-active" : ""}`}
                  onClick={() => goTo("/adminCategoryEvent")}
                >
                  Category Events
                </div>
                <div
                  className={`sidebar-submenu-item ${location.pathname === "/adminEvents" ? "sidebar-nav-active" : ""}`}
                  onClick={() => goTo("/adminEvents")}
                >
                  Events
                </div>
                <div
                  className={`sidebar-submenu-item ${location.pathname === "/adminPackages" ? "sidebar-nav-active" : ""}`}
                  onClick={() => goTo("/adminPackages")}
                >
                  Packages
                </div>
                <div
                  className={`sidebar-submenu-item ${location.pathname === "/adminServices" ? "sidebar-nav-active" : ""}`}
                  onClick={() => goTo("/adminServices")}
                >
                  Services
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="sidebar-menu-section">
          <p className="sidebar-menu-title">MANAGEMENT & CONTROLS</p>

          {managementMenu.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <div
                key={item.path}
                className={`sidebar-nav-item ${isActive ? "sidebar-nav-active" : ""}`}
                onClick={() => goTo(item.path)}
              >
                <div className="sidebar-nav-left">
                  <Icon size={18} />
                  <span>{item.label}</span>
                </div>

                {item.badge > 0 && (
                  <span className="sidebar-menu-badge">{item.badge}</span>
                )}
              </div>
            );
          })}
        </div>

        <div className="sidebar-footer">
          <button className="sidebar-logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;