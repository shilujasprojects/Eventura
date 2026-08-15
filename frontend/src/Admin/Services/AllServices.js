import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./Services.css";
import AdminLayout from "../../Pages/Admin/Layout/AdminLayout";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const ROWS_PER_PAGE = 6;

const AllServices = () => {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/services");
      setServices(response.data.data);
    } catch (error) {
      toast.error("Failed to load services.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id, serviceName) => {
    Swal.fire({
      title: `Delete "${serviceName}"?`,
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      background: "#0d2131",
      color: "#fff7ee",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:5000/api/services/${id}`);
          toast.success(`"${serviceName}" deleted successfully.`);
          fetchServices();
        } catch (error) {
          toast.error("Failed to delete service.");
        }
      }
    });
  };

  // ── Search Filter ─────────────────────────────────────────
  const filteredServices = services.filter((service) =>
    service.serviceName.toLowerCase().includes(search.toLowerCase()),
  );

  // ── Pagination ──────────────────────────────────────────────
  const totalPages = Math.max(
    1,
    Math.ceil(filteredServices.length / ROWS_PER_PAGE),
  );
  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE,
  );

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Whenever the search query changes, the result set is different —
  // jump back to page 1 so we don't land on an empty/out-of-range page.
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // Shared action buttons — used in both the table row and the card
  const ActionButtons = ({ service }) => (
    <div className="allServices-actions">
      <button
        data-tooltip="View Service"
        aria-label="View Service"
        onClick={() => navigate(`/viewService/${service._id}`)}
      >
        <Eye size={16} />
      </button>
      <button
        data-tooltip="Edit Service"
        aria-label="Edit Service"
        onClick={() => navigate(`/editService/${service._id}`)}
      >
        <Pencil size={16} />
      </button>
      <button
        data-tooltip="Delete Service"
        aria-label="Delete Service"
        onClick={() => handleDelete(service._id, service.serviceName)}
      >
        <Trash2 size={16} />
      </button>
    </div>
  );

  return (
    <AdminLayout>
      <div className="allServices">
        {/* ── Header ── */}
        <div className="allServices-header">
          <div>
            <h2>All Services</h2>
            <p>Manage all Eventura services</p>
          </div>
          <button
            className="allServices-addBtn"
            onClick={() => navigate("/addService")}
            title="Add Service"
          >
            <Plus size={18} />
            <span className="btn-text">Add Service</span>
          </button>
        </div>

        {/* ── Search ── */}
        <div className="allServices-searchBox">
          <Search size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services by name..."
          />
          {search && (
            <button
              className="search-clear-btn"
              onClick={() => setSearch("")}
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* ── Table / Cards ── */}
        <div className="allServices-tableWrapper">
          {loading ? (
            <div className="table-empty-state">
              <p>Loading services...</p>
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="table-empty-state">
              {search ? (
                <p>
                  No services found for "<strong>{search}</strong>".
                </p>
              ) : (
                <p>
                  No services yet.{" "}
                  <span
                    onClick={() => navigate("/addService")}
                    className="empty-add-link"
                  >
                    Add your first service →
                  </span>
                </p>
              )}
            </div>
          ) : (
            <>
              {/* ---------- TABLE VIEW (large & medium screens) ---------- */}
              <table className="allServices-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Service Name</th>
                    <th className="col-description">Description</th>
                    <th>Price</th>
                    <th className="col-gallery">Gallery</th>
                    <th>Status</th>
                    <th className="col-created">Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedServices.map((service) => (
                    <tr key={service._id}>
                      <td>
                        <img
                          src={`http://localhost:5000/uploads/${service.bannerImage}`}
                          alt={service.serviceName}
                          className="allServices-image"
                          onError={(e) => {
                            e.target.src =
                              "https://placehold.co/65x65/0d2131/f1d49b?text=No+Image";
                          }}
                        />
                      </td>

                      <td>
                        <div className="allServices-serviceInfo">
                          <h4>{service.serviceName}</h4>
                        </div>
                      </td>

                      <td className="allServices-description col-description">
                        {service.description?.length > 80
                          ? service.description.substring(0, 80) + "..."
                          : service.description}
                      </td>

                      <td>
                        ₹{Number(service.servicePrice).toLocaleString("en-IN")}
                      </td>

                      <td className="col-gallery">
                        <span className="allServices-galleryBadge">
                          {service.galleryImages?.length || 0} Images
                        </span>
                      </td>

                      <td>
                        <span
                          className={
                            service.status === "Active"
                              ? "allServices-status active"
                              : "allServices-status inactive"
                          }
                        >
                          {service.status}
                        </span>
                      </td>

                      <td className="col-created">
                        {new Date(service.createdAt).toLocaleDateString(
                          "en-IN",
                        )}
                      </td>

                      <td>
                        <ActionButtons service={service} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* ---------- CARD VIEW (small screens only) ---------- */}
              <div className="allServices-cardList">
                {paginatedServices.map((service) => (
                  <div className="allServices-card" key={service._id}>
                    <div className="allServices-card-top">
                      <img
                        src={`http://localhost:5000/uploads/${service.bannerImage}`}
                        alt={service.serviceName}
                        className="allServices-card-image"
                        onError={(e) => {
                          e.target.src =
                            "https://placehold.co/65x65/0d2131/f1d49b?text=No+Image";
                        }}
                      />
                      <div className="allServices-card-titleBlock">
                        <h4>{service.serviceName}</h4>
                        <span className="allServices-card-price">
                          ₹
                          {Number(service.servicePrice).toLocaleString("en-IN")}
                        </span>
                        <span
                          className={
                            service.status === "Active"
                              ? "allServices-status active"
                              : "allServices-status inactive"
                          }
                        >
                          {service.status}
                        </span>
                      </div>
                    </div>

                    <p className="allServices-card-description">
                      {service.description?.length > 100
                        ? service.description.substring(0, 100) + "..."
                        : service.description}
                    </p>

                    {/* <div className="allServices-card-footer">
                      <div className="allServices-card-meta">
                        <span className="allServices-galleryBadge">
                          {service.galleryImages?.length || 0} Images
                        </span>
                        <span className="allServices-card-date">
                          {new Date(service.createdAt).toLocaleDateString(
                            "en-IN",
                          )}
                        </span>
                      </div>
                      <ActionButtons service={service} />
                    </div> */}

                    <div className="allServices-card-meta">
    <span className="allServices-galleryBadge">
      {service.galleryImages?.length || 0} Images
    </span>
    <span className="allServices-card-date">
      {new Date(service.createdAt).toLocaleDateString("en-IN")}
    </span>
  </div>

  <div className="allServices-card-footer">
    <ActionButtons service={service} />
  </div>
                  </div>
                ))}
              </div>

              <div className="allServices-pagination">
                <span className="pagination-info">
                  Showing {(currentPage - 1) * ROWS_PER_PAGE + 1}–
                  {Math.min(
                    currentPage * ROWS_PER_PAGE,
                    filteredServices.length,
                  )}{" "}
                  of {filteredServices.length}
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
            </>
          )}
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </AdminLayout>
  );
};

export default AllServices;
