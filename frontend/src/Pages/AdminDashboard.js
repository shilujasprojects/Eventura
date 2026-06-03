import Sidebar from "../Components/Admin/Sidebar/Sidebar";
import AdminNavbar from "../Components/Admin/AdminNavbar/AdminNavbar";
import AdminDashboardCards from "../Components/Admin/DashboardCards/AdminDashboardCards";

import "../App.css";

function AdminDashboard() {
  return (
    <div className="adminDashboard">
      <Sidebar />

      <div className="adminDashboardContent">
        <AdminNavbar />

        <div className="adminDashboardBody">
          <AdminDashboardCards />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;