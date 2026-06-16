import React, { useState } from "react";
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
} from "lucide-react";

import { useLocation, useNavigate } from "react-router-dom";

import logo from "../../Components/Images/logo2.png";
import "./Admin.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Paths that belong to the Event Management dropdown
  const eventManagementPaths = [
    "/adminCategoryEvent",
    "/adminEvents",
    "/adminPackages",
    "/adminServices"
  ];

  // Keep dropdown open if current path is one of the sub-items
  const [showEventManagement, setShowEventManagement] = useState(
    eventManagementPaths.includes(location.pathname)
  );

  const mainMenu = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/adminDashboard",
    },
    {
      icon: Briefcase,
      label: "Bookings",
      path: "/bookings",
    },
    {
      icon: Users,
      label: "Clients",
      path: "/clients",
    },
  ];

  const managementMenu = [
    { 
      icon: UserCheck, 
      label: "Vendors", 
      path: "/vendors" 
    },
    { 
      icon: CreditCard, 
      label: "Payments", 
      badge: 3, 
      path: "/payments" 
    },
    { 
      icon: BarChart3, 
      label: "Reports & Analytics", 
      path: "/reports" 
    },
    { 
      icon: FileText, 
      label: "Content (CMS)", 
      path: "/Cms" 
    },
    { 
      icon: MessageSquare, 
      label: "Inquiries & Support", 
      badge: "New",
      path: "/support" 
    },
    { 
      icon: Settings, 
      label: "Settings", 
      path: "/settings" 
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/loginSign");
  };

  return (
    <aside className="sidebar">
      {/* Brand Logo */}
      <div className="sidebar-logo" onClick={() => navigate("/adminDashboard")} style={{ cursor: "pointer" }}>
        <img
          src={logo}
          alt="Eventura Logo"
          className="sidebar-logo-img"
        />
        <h1 className="sidebar-brand">EVENTURA</h1>
      </div>

      {/* Main Section */}
      <div className="sidebar-menu-section">
        <p className="sidebar-menu-title">MAIN OPERATING MENU</p>

        {mainMenu.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <div
              key={item.path}
              className={`sidebar-nav-item ${isActive ? "sidebar-nav-active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              <div className="sidebar-nav-left">
                <Icon size={18} />
                <span>{item.label}</span>
              </div>
            </div>
          );
        })}

        {/* Dynamic Dropdown: Event Management */}
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
                onClick={() => navigate("/adminCategoryEvent")}
              >
                Category Events
              </div>
              <div
                className={`sidebar-submenu-item ${location.pathname === "/adminEvents" ? "sidebar-nav-active" : ""}`}
                onClick={() => navigate("/adminEvents")}
              >
                Events
              </div>
              <div
                className={`sidebar-submenu-item ${location.pathname === "/adminPackages" ? "sidebar-nav-active" : ""}`}
                onClick={() => navigate("/adminPackages")}
              >
                Packages
              </div>
              <div
                className={`sidebar-submenu-item ${location.pathname === "/adminServices" ? "sidebar-nav-active" : ""}`}
                onClick={() => navigate("/adminServices")}
              >
                Services
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Management Section */}
      <div className="sidebar-menu-section">
        <p className="sidebar-menu-title">MANAGEMENT & CONTROLS</p>

        {managementMenu.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <div
              key={item.path}
              className={`sidebar-nav-item ${isActive ? "sidebar-nav-active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              <div className="sidebar-nav-left">
                <Icon size={18} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className={`sidebar-menu-badge ${item.badge === "New" ? "badge-alert" : ""}`}>
                  {item.badge}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Sidebar Footer / Logout */}
      <div className="sidebar-footer">
        <button
          className="sidebar-logout-btn"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;