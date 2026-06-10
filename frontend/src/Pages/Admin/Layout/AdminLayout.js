
import AdminNavbar from "../../../Admin/Shared/AdminNavbar";
import Sidebar from "../../../Admin/Shared/Sidebar";
import "./global.css";

function AdminLayout({ children }) {
  return (
    <div className="adminDashboard">
      <Sidebar />

      <div className="adminDashboardContent">
        <AdminNavbar />

        <div className="adminDashboardBody">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;