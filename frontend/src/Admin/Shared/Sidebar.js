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
} from "lucide-react";

import { useLocation, useNavigate } from "react-router-dom";

import logo from "../../Components/Images/logo2.png";
import "./Admin.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [showEventManagement, setShowEventManagement] =
    useState(
      location.pathname === "/adminEvents" ||
        location.pathname === "/adminPackages" ||
        location.pathname === "/adminServices"
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
      path: "/adminBookings",
    },
    {
      icon: Users,
      label: "Clients",
      path: "/adminClients",
    },
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
                location.pathname === item.path
                  ? "sidebar-nav-active"
                  : ""
              }`}
              onClick={() => navigate(item.path)}
            >
              <div className="sidebar-nav-left">
                <Icon size={18} />
                <span>{item.label}</span>
              </div>
            </div>
          );
        })}

        {/* Event Management */}

        <div>
          <div
            className="sidebar-nav-item"
            onClick={() =>
              setShowEventManagement(
                !showEventManagement
              )
            }
          >
            <div className="sidebar-nav-left">
              <Calendar size={18} />
              <span>Event Management</span>
            </div>

            {showEventManagement ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </div>

          {showEventManagement && (
            <div className="sidebar-submenu">
              <div
                className={`sidebar-submenu-item ${
                  location.pathname === "/adminEvents"
                    ? "sidebar-nav-active"
                    : ""
                }`}
                onClick={() =>
                  navigate("/adminEvents")
                }
              >
                Events
              </div>

              <div
                className={`sidebar-submenu-item ${
                  location.pathname ===
                  "/adminPackages"
                    ? "sidebar-nav-active"
                    : ""
                }`}
                onClick={() =>
                  navigate("/adminPackages")
                }
              >
                Packages
              </div>

              <div
                className={`sidebar-submenu-item ${
                  location.pathname ===
                  "/adminServices"
                    ? "sidebar-nav-active"
                    : ""
                }`}
                onClick={() =>
                  navigate("/adminServices")
                }
              >
                Services
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Management */}
      <div className="sidebar-menu-section">
        <p className="sidebar-menu-title">
          MANAGEMENT
        </p>

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