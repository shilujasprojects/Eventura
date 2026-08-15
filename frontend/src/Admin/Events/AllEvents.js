import React, { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Swal from "sweetalert2";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

import "./Events.css";
import AdminLayout from "../../Pages/Admin/Layout/AdminLayout";

const API_BASE = "http://localhost:5000/api";
const ROWS_PER_PAGE = 8;

const AllEvents = () => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
    fetchCategories();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/events`);
      setEvents(res.data.data || []);
    } catch {
      toast.error("Failed to load events.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE}/category`);
      setCategories(res.data || []);
    } catch {
      toast.error("Failed to load categories.");
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete Event?",
      text: "This event will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (!result.isConfirmed) return;
      try {
        await axios.delete(`${API_BASE}/events/${id}`);
        setEvents((prev) => prev.filter((ev) => ev._id !== id));
        Swal.fire({
          icon: "success",
          title: "Deleted",
          text: "Event deleted successfully.",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch {
        toast.error("Failed to delete event.");
      }
    });
  };

  const filteredEvents = events.filter((event) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      event.eventName?.toLowerCase().includes(term) ||
      event.category?.categoryName?.toLowerCase().includes(term);

    const matchesCategory =
      !categoryFilter || event.category?._id === categoryFilter;
    const matchesStatus = !statusFilter || event.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredEvents.length / ROWS_PER_PAGE),
  );
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE,
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

  // Shared action buttons — used in both the table row and the card
  const ActionButtons = ({ event }) => (
    <div className="allEvents-actions">
      <button
        data-tooltip="View Event"
        aria-label="View Event"
        onClick={() => navigate(`/viewEvents/${event._id}`)}
      >
        <Eye size={16} />
      </button>
      <button
        data-tooltip="Edit Event"
        aria-label="Edit Event"
        onClick={() => navigate(`/editEvents/${event._id}`)}
      >
        <Pencil size={16} />
      </button>
      <button
        data-tooltip="Delete Event"
        aria-label="Delete Event"
        onClick={() => handleDelete(event._id)}
      >
        <Trash2 size={16} />
      </button>
    </div>
  );

  return (
    <AdminLayout>
      <div className="allEvents">
        <div className="allEvents-header">
          <div>
            <h2>All Events</h2>
            <p>Manage all Eventura events</p>
          </div>
          <button
            className="allEvents-addBtn"
            onClick={() => navigate("/addEvents")}
            title="Add Event"
          >
            <Plus size={18} />
            <span className="btn-text">Add Event</span>
          </button>
          
        </div>

        <div className="allEvents-filters">
          <div className="allEvents-searchBox">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by event or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="allEvents-filterSelect">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
          </div>

          <div className="allEvents-filterSelect">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="allEvents-tableWrapper">
          {/* ---------- TABLE VIEW (large & medium screens) ---------- */}
          <table className="allEvents-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Event Name</th>
                <th className="col-category">Category</th>
                <th>Status</th>
                <th className="col-created">Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    Loading events...
                  </td>
                </tr>
              )}

              {!loading && filteredEvents.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    {events.length === 0
                      ? "No events added yet."
                      : "No events match your filters."}
                  </td>
                </tr>
              )}

              {!loading &&
                paginatedEvents.map((event) => (
                  <tr key={event._id}>
                    <td>
                      {event.coverImage ? (
                        <img
                          src={`http://localhost:5000/uploads/${event.coverImage}`}
                          alt={event.eventName}
                          className="allEvents-image"
                        />
                      ) : (
                        <div className="allEvents-imagePlaceholder" />
                      )}
                    </td>
                    <td>{event.eventName}</td>
                    <td className="col-category">
                      {event.category?.categoryName || "-"}
                    </td>
                    <td>
                      <span
                        className={
                          event.status === "Active"
                            ? "allEvents-status active"
                            : "allEvents-status inactive"
                        }
                      >
                        {event.status}
                      </span>
                    </td>
                    <td className="col-created">
                      {formatDate(event.createdAt)}
                    </td>
                    <td>
                      <ActionButtons event={event} />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          {/* ---------- CARD VIEW (small screens only) ---------- */}
          <div className="allEvents-cardList">
            {loading && (
              <div className="allEvents-empty-card">Loading events...</div>
            )}

            {!loading && filteredEvents.length === 0 && (
              <div className="allEvents-empty-card">
                {events.length === 0
                  ? "No events added yet."
                  : "No events match your filters."}
              </div>
            )}

            {!loading &&
              paginatedEvents.map((event) => (
                <div className="allEvents-card" key={event._id}>
                  <div className="allEvents-card-top">
                    {event.coverImage ? (
                      <img
                        src={`http://localhost:5000/uploads/${event.coverImage}`}
                        alt={event.eventName}
                        className="allEvents-card-image"
                      />
                    ) : (
                      <div className="allEvents-card-noImage" />
                    )}
                    <div className="allEvents-card-titleBlock">
                      <h4>{event.eventName}</h4>
                      <span className="allEvents-card-category">
                        {event.category?.categoryName || "-"}
                      </span>
                      <span
                        className={
                          event.status === "Active"
                            ? "allEvents-status active"
                            : "allEvents-status inactive"
                        }
                      >
                        {event.status}
                      </span>
                    </div>
                  </div>

                  <div className="allEvents-card-footer">
                    <span className="allEvents-card-date">
                      Created: {formatDate(event.createdAt)}
                    </span>
                    <ActionButtons event={event} />
                  </div>
                </div>
              ))}
          </div>

          {!loading && filteredEvents.length > 0 && (
            <div className="allEvents-pagination">
              <span className="pagination-info">
                Showing {(currentPage - 1) * ROWS_PER_PAGE + 1}–
                {Math.min(currentPage * ROWS_PER_PAGE, filteredEvents.length)}{" "}
                of {filteredEvents.length}
              </span>

              <div className="pagination-controls">
                <button
                  className="pagination-btn"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={16} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      className={
                        page === currentPage
                          ? "pagination-btn active"
                          : "pagination-btn"
                      }
                      onClick={() => goToPage(page)}
                    >
                      {page}
                    </button>
                  ),
                )}

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

export default AllEvents;