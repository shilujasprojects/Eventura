import React, { useState } from "react";
import AdminNavbar from "../../../Admin/Shared/AdminNavbar";
import Sidebar from "../../../Admin/Shared/Sidebar";
import "./global.css";

function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="admin-layout">
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      <div className="admin-layout-content">
        <AdminNavbar onMenuClick={toggleSidebar} />

        <div className="adminDashboardBody payments-page">
          {children}
        </div>
      </div>
    </div>
  );
}
export default AdminLayout;