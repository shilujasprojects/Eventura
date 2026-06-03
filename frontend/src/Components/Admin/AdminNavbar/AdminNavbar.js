import React from "react";
import {
  Bell,
  Search,
  Settings,
  ChevronDown,
} from "lucide-react";

import "./AdminNavbar.css";

const AdminNavbar = () => {
  return (
    <nav className="admin-navbar">

      {/* Left Side */}
      <div className="navbar-left">
        <h2>Dashboard</h2>
        <p>Welcome back, Admin 👋</p>
      </div>

      {/* Right Side */}
      <div className="navbar-right">

        {/* Search */}
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search events..."
          />
        </div>

        {/* Notification */}
        <button className="icon-btn">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>

        {/* Settings */}
        <button className="icon-btn">
          <Settings size={20} />
        </button>

        {/* Profile */}
        <div className="profile-section">
          <div className="profile-avatar">
            AR
          </div>

          <div className="profile-details">
            <h6>Arjun Rajan</h6>
            <span>Super Admin</span>
          </div>

          <ChevronDown size={18} />
        </div>

      </div>

    </nav>
  );
};

export default AdminNavbar;