import React, { useState, useEffect } from "react";
import { Search, Plus, Eye, Pencil, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import "./Packages.css";
import AdminLayout from "../../Pages/Admin/Layout/AdminLayout";



const AllPackages = () => {
  const [packages, setPackages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchPackages();
    fetchCategories();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/packages");
      setPackages(res.data.data || []);
    } catch {
      toast.error("Failed to load packages.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/category");
      setCategories(res.data.data || res.data || []);
    } catch {
      toast.error("Failed to load categories.");
    }
  };

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
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      try {
        await axios.delete(`http://localhost:5000/api/packages/${id}`);
        setPackages((prev) => prev.filter((pkg) => pkg._id !== id));
        Swal.fire({
          icon: "success",
          title: "Deleted",
          text: "Package deleted successfully.",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch {
        toast.error("Failed to delete package.");
      }
    });
  };

  // Same discount math used in AddPackages / EditPackages / ViewPackages
  const getFinalPrice = (pkg) => {
    const original = Number(pkg.basePrice || 0);
    const discountValue = Number(pkg.packageDiscount?.value || 0);
    let final = original;

    if (pkg.packageDiscount?.type === "Percentage") {
      final = original - (original * discountValue) / 100;
    } else if (pkg.packageDiscount?.type === "Flat") {
      final = original - discountValue;
    }

    return Math.max(0, final);
  };

  const filteredPackages = packages.filter((pkg) => {
    const term = searchTerm.toLowerCase();

    const matchesSearch =
      pkg.packageName?.toLowerCase().includes(term) ||
      pkg.category?.categoryName?.toLowerCase().includes(term);

    const matchesCategory = !categoryFilter || pkg.category?._id === categoryFilter;
    const matchesStatus = !statusFilter || pkg.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="allPackages">
        <div className="allPackages-header">
          <div>
            <h2>All Packages</h2>
            <p>Manage all event packages</p>
          </div>
          <button className="allPackages-addBtn" onClick={() => navigate("/addPackage")}>
            <Plus size={18} />
            Add Package
          </button>
        </div>

        <div className="allPackages-filters">
          <div className="allPackages-searchBox">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by package or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="allPackages-filterSelect">
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.categoryName}</option>
              ))}
            </select>
          </div>

          <div className="allPackages-filterSelect">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="allPackages-tableWrapper">
          <table className="allPackages-table">
            <thead>
              <tr>
                <th>Package Name</th>
                <th>Category</th>
                <th>Services</th>
                <th>Price</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>Loading packages...</td>
                </tr>
              )}

              {!loading && filteredPackages.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    {packages.length === 0 ? "No packages added yet." : "No packages match your filters."}
                  </td>
                </tr>
              )}

              {!loading && filteredPackages.map((pkg) => {
                const finalPrice = getFinalPrice(pkg);
                const hasDiscount = finalPrice < Number(pkg.basePrice || 0);

                return (
                  <tr key={pkg._id}>
                    <td>{pkg.packageName}</td>
                    <td>{pkg.category?.categoryName || "-"}</td>
                    <td>
                      <span className="allPackages-serviceBadge">
                        {pkg.services?.length || 0} Services
                      </span>
                    </td>
                    <td>
                      {hasDiscount ? (
                        <>
                          <span style={{ textDecoration: "line-through", color: "#8a9ba8", marginRight: 6 }}>
                            ₹{Number(pkg.basePrice).toLocaleString()}
                          </span>
                          <span style={{ color: "#f1d49b", fontWeight: 600 }}>
                            ₹{finalPrice.toLocaleString()}
                          </span>
                        </>
                      ) : (
                        <span>₹{Number(pkg.basePrice || 0).toLocaleString()}</span>
                      )}
                    </td>
                    <td>
                      <span className={pkg.status === "Active" ? "allPackages-status active" : "allPackages-status inactive"}>
                        {pkg.status}
                      </span>
                    </td>
                    <td>
                      {new Date(pkg.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td>
                      <div className="allPackages-actions">
                        <button onClick={() => navigate(`/viewPackage/${pkg._id}`)}><Eye size={16} /></button>
                        <button onClick={() => navigate(`/editPackage/${pkg._id}`)}><Pencil size={16} /></button>
                        <button onClick={() => handleDelete(pkg._id)}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AllPackages;