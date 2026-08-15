import React, { useEffect, useState } from "react";
import { Search, Plus, Eye, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./CategoryEvents.css";
import AdminLayout from "../../Pages/Admin/Layout/AdminLayout";

const ROWS_PER_PAGE = 4;

const AllCategoryEvents = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);   // full list from API
  const [searchQuery, setSearchQuery] = useState("");  // search input
  const [currentPage, setCurrentPage] = useState(1);

  // ---------- fetch ----------
  const fetchCategory = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/category");
      setCategories(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load categories.");
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  // ---------- client-side search filter ----------
  const filtered = categories.filter((cat) =>
    cat.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Whenever the search query or underlying data changes, the result set
  // is different — jump back to page 1 so we don't land on an
  // empty/out-of-range page.
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categories]);

  // ---------- pagination ----------
  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // ---------- delete (confirm FIRST, then delete) ----------
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Category?",
      text: "This category will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      background: "#0d2131",
      color: "#fff7ee",
    });

    if (!result.isConfirmed) return; // user cancelled — do nothing

    try {
      await axios.delete(`http://localhost:5000/api/category/${id}`);
      setCategories((prev) => prev.filter((cat) => cat._id !== id));

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Category deleted successfully.",
        timer: 1500,
        showConfirmButton: false,
        background: "#0d2131",
        color: "#fff7ee",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete category.");
    }
  };

  // ---------- format date ----------
  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };


  const ActionButtons = ({ cat }) => (
  <div className="allCategory-actions">
    <button
      data-tooltip="View Category"
      aria-label="View Category"
      onClick={() => navigate(`/viewCategoryEvent/${cat._id}`)}
    >
      <Eye size={16} />
    </button>
    <button
      data-tooltip="Edit Category"
      aria-label="Edit"
      onClick={() => navigate(`/editCategoryEvent/${cat._id}`)}
    >
      <Pencil size={16} />
    </button>
    <button
      data-tooltip="Delete Category"
      aria-label="Delete"
      className="delete-btn"
      onClick={() => handleDelete(cat._id)}
    >
      <Trash2 size={16} />
    </button>
  </div>
);

  return (
    <>
      <AdminLayout>
        <div className="allCategory">
          {/* Header */}
          <div className="allCategory-header">
            <div className="allCategory-headerText">
              <h2>Event Categories</h2>
              <p>Manage all event categories</p>
            </div>
            <button
              className="allCategory-addBtn"
              onClick={() => navigate("/addCategoryEvent")}
              title="Add Category"
            >
              <Plus size={18} />
              <span className="btn-text">Add Category</span>
            </button>
          </div>

          {/* Search */}
          <div className="allCategory-searchBox">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by name, description or status..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="search-clear-btn"
                onClick={() => setSearchQuery("")}
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          <div className="allCategory-tableWrapper">
            {/* ---------- TABLE VIEW (large & medium screens) ---------- */}
            <table className="allCategory-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Category Name</th>
                  <th className="col-description">Description</th>
                  <th>Status</th>
                  <th className="col-created">Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="allCategory-empty">
                      {searchQuery
                        ? "No categories match your search."
                        : "No categories found. Add one!"}
                    </td>
                  </tr>
                ) : (
                  paginated.map((cat) => (
                    <tr key={cat._id}>
                      <td>
                        {cat.image ? (
                          <img
                            src={`http://localhost:5000/uploads/${cat.image}`}
                            alt={cat.categoryName}
                            className="allCategory-image"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="allCategory-no-image">No Image</div>
                        )}
                      </td>
                      <td>{cat.categoryName}</td>
                      <td className="allCategory-description col-description">
                        {cat.description.length > 60
                          ? cat.description.slice(0, 60) + "..."
                          : cat.description}
                      </td>
                      <td>
                        <span
                          className={`allCategory-status ${
                            cat.status === "Active" ? "active" : "inactive"
                          }`}
                        >
                          {cat.status}
                        </span>
                      </td>
                      <td className="col-created">{formatDate(cat.createdAt)}</td>
                      <td>
                        <ActionButtons cat={cat} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* ---------- CARD VIEW (small screens only) ---------- */}
            <div className="allCategory-cardList">
              {filtered.length === 0 ? (
                <div className="allCategory-empty-card">
                  {searchQuery
                    ? "No categories match your search."
                    : "No categories found. Add one!"}
                </div>
              ) : (
                paginated.map((cat) => (
                  <div className="allCategory-card" key={cat._id}>
                    <div className="allCategory-card-top">
                      {cat.image ? (
                        <img
                          src={`http://localhost:5000/uploads/${cat.image}`}
                          alt={cat.categoryName}
                          className="allCategory-card-image"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="allCategory-card-noImage">No Image</div>
                      )}
                      <div className="allCategory-card-titleBlock">
                        <h4>{cat.categoryName}</h4>
                        <span
                          className={`allCategory-status ${
                            cat.status === "Active" ? "active" : "inactive"
                          }`}
                        >
                          {cat.status}
                        </span>
                      </div>
                    </div>

                    <p className="allCategory-card-description">
                      {cat.description}
                    </p>

                    <div className="allCategory-card-footer">
                      <span className="allCategory-card-date">
                        Created: {formatDate(cat.createdAt)}
                      </span>
                      <ActionButtons cat={cat} />
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination — shared by both views */}
            {filtered.length > 0 && (
              <div className="allCategory-pagination">
                <span className="pagination-info">
                  Showing {(currentPage - 1) * ROWS_PER_PAGE + 1}–
                  {Math.min(currentPage * ROWS_PER_PAGE, filtered.length)} of {filtered.length}
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

          {/* Result count */}
          {searchQuery && (
            <p className="search-result-count">
              Showing {filtered.length} of {categories.length} categories
            </p>
          )}
        </div>
      </AdminLayout>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default AllCategoryEvents;