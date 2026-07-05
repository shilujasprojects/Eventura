import React, { useEffect, useState } from "react";
import { Search, Plus, Eye, Pencil, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./CategoryEvents.css";
import AdminLayout from "../../Pages/Admin/Layout/AdminLayout";

const AllCategoryEvents = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);   // full list from API
  const [searchQuery, setSearchQuery] = useState("");  // search input

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

  return (
    <>
      <AdminLayout>
        <div className="allCategory">
          {/* Header */}
          <div className="allCategory-header">
            <div>
              <h2>Event Categories</h2>
              <p>Manage all event categories</p>
            </div>
            <button
              className="allCategory-addBtn"
              onClick={() => navigate("/addCategoryEvent")}
            >
              <Plus size={18} />
              Add Category
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

          {/* Table */}
          <div className="allCategory-tableWrapper">
            <table className="allCategory-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Category Name</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Created</th>
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
                  filtered.map((cat) => (
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
                      <td className="allCategory-description">
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
                      <td>{formatDate(cat.createdAt)}</td>
                      <td>
                        <div className="allCategory-actions">
                          <button
                            title="View"
                            onClick={() =>
                              navigate(`/viewCategoryEvent/${cat._id}`)
                            }
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            title="Edit"
                            onClick={() =>
                              navigate(`/editCategoryEvent/${cat._id}`)
                            }
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            title="Delete"
                            className="delete-btn"
                            onClick={() => handleDelete(cat._id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
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