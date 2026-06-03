import React from "react";
import {
  LayoutDashboard,
  Calendar,
  Briefcase,
  Users,
  Star,
  UserCheck,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

import logo from "../../Images/logo2.png";
import "./Sidebar.css";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const mainMenu = [
    { icon: LayoutDashboard, label: "Dashboard" },
    { icon: Calendar, label: "Events", badge: 12 },
    { icon: Briefcase, label: "Bookings" },
    { icon: Users, label: "Clients" },
    { icon: Star, label: "Services" },
  ];

  const managementMenu = [
    { icon: UserCheck, label: "Vendors" },
    { icon: CreditCard, label: "Payments", badge: 3 },
    { icon: BarChart3, label: "Reports" },
    { icon: Settings, label: "Settings" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/loginSign");
  };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <img
          src={logo}
          alt="Eventura Logo"
          className="sidebar-logo-img"
        />

        <h1 className="sidebar-brand">EVENTURA</h1>
      </div>

      {/* Main Menu */}
      <div className="sidebar-menu-section">
        <p className="sidebar-menu-title">MAIN</p>

        {mainMenu.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className={`sidebar-nav-item ${
                item.label === "Dashboard"
                  ? "sidebar-nav-active"
                  : ""
              }`}
            >
              <div className="sidebar-nav-left">
                <Icon size={18} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className="sidebar-menu-badge">
                  {item.badge}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Management */}
      <div className="sidebar-menu-section">
        <p className="sidebar-menu-title">MANAGEMENT</p>

        {managementMenu.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="sidebar-nav-item"
            >
              <div className="sidebar-nav-left">
                <Icon size={18} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className="sidebar-menu-badge">
                  {item.badge}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Logout */}
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