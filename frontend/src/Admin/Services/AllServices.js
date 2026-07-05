import React, { useState, useEffect } from "react";
import { Search, Plus, Eye, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./Services.css";
import AdminLayout from "../../Pages/Admin/Layout/AdminLayout";
import axios from "axios";
import { toast } from "react-toastify";

const AllServices = () => {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

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
          // ✅ Fixed: was using service.id (undefined) — now uses _id passed directly
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
    service.serviceName.toLowerCase().includes(search.toLowerCase())
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
          >
            <Plus size={18} />
            Add Service
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

        {/* ── Table ── */}
        <div className="allServices-tableWrapper">

          {loading ? (
            <div className="table-empty-state">
              <p>Loading services...</p>
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="table-empty-state">
              {search ? (
                <p>No services found for "<strong>{search}</strong>".</p>
              ) : (
                <p>No services yet. <span onClick={() => navigate("/addService")} className="empty-add-link">Add your first service →</span></p>
              )}
            </div>
          ) : (
            <table className="allServices-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Service Name</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Gallery</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.map((service) => (
                  <tr key={service._id}>

                    <td>
                      <img
                        src={`http://localhost:5000/uploads/${service.bannerImage}`}
                        alt={service.serviceName}
                        className="allServices-image"
                        onError={(e) => {
                          e.target.src = "https://placehold.co/65x65/0d2131/f1d49b?text=No+Image";
                        }}
                      />
                    </td>

                    <td>
                      <div className="allServices-serviceInfo">
                        <h4>{service.serviceName}</h4>
                      </div>
                    </td>

                    <td className="allServices-description">
                      {service.description?.length > 80
                        ? service.description.substring(0, 80) + "..."
                        : service.description}
                    </td>

                    <td>₹{Number(service.servicePrice).toLocaleString("en-IN")}</td>

                    <td>
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

                    <td>{new Date(service.createdAt).toLocaleDateString("en-IN")}</td>

                    <td>
                      <div className="allServices-actions">
                        <button
                          title="View"
                          onClick={() => navigate(`/viewService/${service._id}`)}
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          title="Edit"
                          onClick={() => navigate(`/editService/${service._id}`)}
                        >
                          <Pencil size={16} />
                        </button>
                        {/* ✅ Fixed: passing service._id and name */}
                        <button
                          title="Delete"
                          onClick={() => handleDelete(service._id, service.serviceName)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          )}

        </div>

        {/* ── Result Count ── */}
        {!loading && filteredServices.length > 0 && (
          <p className="results-count">
            Showing {filteredServices.length} of {services.length} service{services.length !== 1 ? "s" : ""}
          </p>
        )}

      </div>
    </AdminLayout>
  );
};

export default AllServices;