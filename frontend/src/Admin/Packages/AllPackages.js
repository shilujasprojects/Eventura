import React from "react";
import {
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import Swal from "sweetalert2";

import "./Packages.css";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../Pages/Admin/Layout/AdminLayout";

const AllPackages = () => {
  const packages = [
    {
      id: 1,
      name: "Royal Wedding Package",
      category: "Wedding",
      services: 8,
      description: "A complete luxury wedding package.",
      price: "₹75,000",
      status: "Active",
      createdAt: "08 Jun 2026",
    },
    {
      id: 2,
      name: "Birthday Premium",
      category: "Birthday",
      services: 5,
      description: "A complete luxury wedding package.",
      price: "₹25,000",
      status: "Active",
      createdAt: "08 Jun 2026",
    },
    {
      id: 3,
      name: "Corporate Elite",
      category: "Corporate",
      services: 10,
      description: "A complete luxury wedding package.",
      price: "₹1,20,000",
      status: "Inactive",
      createdAt: "08 Jun 2026",
    },
  ];

  const handleDelete = (id) => {
  Swal.fire({
    title: "Delete Package?",
    text: "This package will be permanently removed.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Delete",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {

      // Delete API Call Here
      console.log("Delete Package:", id);

      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Package deleted successfully.",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  });
};

  const navigate = useNavigate();

  return (
    <>
      <AdminLayout>
        <div className="allPackages">

      {/* Header */}

      <div className="allPackages-header">

        <div>
          <h2>All Packages</h2>
          <p>Manage all event packages</p>
        </div>

        <button className="allPackages-addBtn" onClick={() =>navigate('/addPackage')}>
          <Plus size={18} />
          Add Package
        </button>

      </div>

      {/* Search */}

      <div className="allPackages-searchBox">

        <Search size={18} />

        <input
          type="text"
          placeholder="Search packages..."
        />

      </div>

      {/* Table */}

      <div className="allPackages-tableWrapper mt-3">

        <table className="allPackages-table">

          <thead>

            <tr>
              <th>Package Name</th>
              <th>Category</th>
              <th>Services</th>
              
              <th>Price</th>
              <th>Status</th>
              <th>CreatedAt</th>
              <th>Actions</th>
            </tr>

          </thead>

          <tbody>

            {packages.map((pkg) => (
              <tr key={pkg.id}>

                <td>{pkg.name}</td>

                <td>{pkg.category}</td>

                <td>{pkg.services} Services</td>

               

                <td>{pkg.price}</td>

                <td>

                  <span
                    className={
                      pkg.status === "Active"
                        ? "allPackages-status active"
                        : "allPackages-status inactive"
                    }
                  >
                    {pkg.status}
                  </span>

                </td>

                <td>
                  {pkg.createdAt}
                </td>

                <td>

                  <div className="allPackages-actions">

                    <button onClick={() => navigate(`/viewPackage/${pkg.id}`)}>
                      <Eye size={16} />
                    </button>

                    <button onClick={() => navigate(`/editPackage/${pkg.id}`)}>
                      <Pencil size={16} />
                    </button>

                    <button  onClick={() => handleDelete(pkg.id)}>
                      <Trash2 size={16} />
                    </button>

                  </div>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
      </AdminLayout>
    </>
  );
};

export default AllPackages;