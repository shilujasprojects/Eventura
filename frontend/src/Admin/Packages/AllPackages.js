import React, { useState, useEffect } from "react";
import { Search, Plus, Eye, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import Swal from "sweetalert2";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

import "./Packages.css";
import AdminLayout from "../../Pages/Admin/Layout/AdminLayout";

const ROWS_PER_PAGE = 6;

const AllPackages = () => {
  const [packages, setPackages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

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
      setCategories(res.data || []);
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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredPackages.length / ROWS_PER_PAGE));
  const paginatedPackages = filteredPackages.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const formatDate = (dateStr) =>
    dateStr
      ? new Date(dateStr).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "-";

  // Shared price block — same discount display used in table and card
  const PriceDisplay = ({ pkg }) => {
    const finalPrice = getFinalPrice(pkg);
    const hasDiscount = finalPrice < Number(pkg.basePrice || 0);

    return hasDiscount ? (
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
    );
  };

  const ActionButtons = ({ pkg }) => (
    <div className="allPackages-actions">
      <button
        data-tooltip="View Package"
        aria-label="View Package"
        onClick={() => navigate(`/viewPackage/${pkg._id}`)}
      >
        <Eye size={16} />
      </button>
      <button
        data-tooltip="Edit Package"
        aria-label="Edit Package"
        onClick={() => navigate(`/editPackage/${pkg._id}`)}
      >
        <Pencil size={16} />
      </button>
      <button
        data-tooltip="Delete Package"
        aria-label="Delete Package"
        onClick={() => handleDelete(pkg._id)}
      >
        <Trash2 size={16} />
      </button>
    </div>
  );

  return (
    <AdminLayout>
      <div className="allPackages">
        <div className="allPackages-header">
          <div>
            <h2>All Packages</h2>
            <p>Manage all event packages</p>
          </div>
          <button
            className="allPackages-addBtn"
            onClick={() => navigate("/addPackage")}
            title="Add Package"
          >
            <Plus size={18} />
            <span className="btn-text">Add Package</span>
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
          {/* ---------- TABLE VIEW (large & medium screens) ---------- */}
          <table className="allPackages-table">
            <thead>
              <tr>
                <th>Package Name</th>
                <th className="col-category">Category</th>
                <th className="col-services">Services</th>
                <th>Price</th>
                <th>Status</th>
                <th className="col-created">Created At</th>
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

              {!loading && paginatedPackages.map((pkg) => (
                <tr key={pkg._id}>
                  <td>{pkg.packageName}</td>
                  <td className="col-category">{pkg.category?.categoryName || "-"}</td>
                  <td className="col-services">
                    <span className="allPackages-serviceBadge">
                      {pkg.services?.length || 0} Services
                    </span>
                  </td>
                  <td><PriceDisplay pkg={pkg} /></td>
                  <td>
                    <span className={pkg.status === "Active" ? "allPackages-status active" : "allPackages-status inactive"}>
                      {pkg.status}
                    </span>
                  </td>
                  <td className="col-created">{formatDate(pkg.createdAt)}</td>
                  <td>
                    <ActionButtons pkg={pkg} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ---------- CARD VIEW (small screens only) ---------- */}
          <div className="allPackages-cardList">
            {loading && <div className="allPackages-empty-card">Loading packages...</div>}

            {!loading && filteredPackages.length === 0 && (
              <div className="allPackages-empty-card">
                {packages.length === 0 ? "No packages added yet." : "No packages match your filters."}
              </div>
            )}

            {!loading && paginatedPackages.map((pkg) => (
              <div className="allPackages-card" key={pkg._id}>
                <div className="allPackages-card-top">
                  <div className="allPackages-card-titleBlock">
                    <h4>{pkg.packageName}</h4>
                    <span className="allPackages-card-category">
                      {pkg.category?.categoryName || "-"}
                    </span>
                  </div>
                  <span className={pkg.status === "Active" ? "allPackages-status active" : "allPackages-status inactive"}>
                    {pkg.status}
                  </span>
                </div>

                <div className="allPackages-card-meta">
                  <span className="allPackages-serviceBadge">
                    {pkg.services?.length || 0} Services
                  </span>
                  <span className="allPackages-card-price"><PriceDisplay pkg={pkg} /></span>
                </div>

                <div className="allPackages-card-footer">
                  <span className="allPackages-card-date">
                    Created: {formatDate(pkg.createdAt)}
                  </span>
                  <ActionButtons pkg={pkg} />
                </div>
              </div>
            ))}
          </div>

          {!loading && filteredPackages.length > 0 && (
            <div className="allPackages-pagination">
              <span className="pagination-info">
                Showing {(currentPage - 1) * ROWS_PER_PAGE + 1}–
                {Math.min(currentPage * ROWS_PER_PAGE, filteredPackages.length)} of {filteredPackages.length}
              </span>

              <div className="pagination-controls">
                <button
                  className="pagination-btn"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={16} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={page === currentPage ? "pagination-btn active" : "pagination-btn"}
                    onClick={() => goToPage(page)}
                  >
                    {page}
                  </button>
                ))}

                <button
                  className="pagination-btn"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </AdminLayout>
  );
};

export default AllPackages;