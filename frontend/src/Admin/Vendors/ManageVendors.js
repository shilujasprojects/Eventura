import React, { useState, useEffect } from "react";
import {
  Search,
  Eye,
  Phone,
  Mail,
  Star,
  CheckCircle,
  XCircle,
  Briefcase,
  MapPin,
  User,
  ImageOff,
  Pencil,
  Plus,
  Loader2,
} from "lucide-react";
import "./Vendors.css";
import AdminLayout from "../../Pages/Admin/Layout/AdminLayout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const ManageVendors = () => {
  const navigate = useNavigate();

  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Modal state
  const [selectedVendor, setSelectedVendor] = useState(null);
  // Lightbox state — tracks which image URL to show full screen
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    fetchVendors();
  }, []);

  // Re-filter whenever vendors list, active tab, or search query changes
  useEffect(() => {
    let result = [...vendors];

    if (activeTab !== "All") {
      result = result.filter((vendor) => vendor.status === activeTab);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (vendor) =>
          vendor.name?.toLowerCase().includes(query) ||
          vendor.vendorId?.toLowerCase().includes(query) ||
          vendor.serviceCategory?.serviceName?.toLowerCase().includes(query)||
          vendor.location?.toLowerCase().includes(query) ||
          vendor.contactPerson?.toLowerCase().includes(query)
      );
    }

    setFilteredVendors(result);
  }, [vendors, activeTab, searchQuery]);

  const fetchVendors = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/vendors");
      setVendors(response.data.data);
    } catch (error) {
      console.error("Fetch vendors error:", error);
      toast.error("Failed to fetch vendors");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (id, status) => {
    try {
      await axios.patch(`http://localhost:5000/api/vendors/status/${id}`, {
        status,
      });

      toast.success(
        status === "Active" ? "Vendor activated successfully" : "Vendor suspended"
      );

      // Close modal and refresh
      setSelectedVendor(null);
      fetchVendors();
    } catch (error) {
      console.error("Toggle status error:", error);
      toast.error("Failed to update vendor status");
    }
  };

  // Helper: build full image URL
  const getImageUrl = (imageName) => {
    if (!imageName) return null;
    return `http://localhost:5000/uploads/${imageName}`;
  };

  // Tab count helpers
  const countByStatus = (status) =>
    vendors.filter((v) => v.status === status).length;

  return (
    <AdminLayout>
      <div className="allVendors">

        {/* Page Header */}
        <div className="allVendors-header">
          <div>
            <h2>Service Vendors Directory</h2>
            <p>
              Manage external partners, track ratings, assign event sub-tasks,
              and audit active operations.
            </p>
          </div>
          <button
            className="add-vendor-btn"
            onClick={() => navigate("/addVendors")}
          >
            <Plus size={16} />
            Add Vendor
          </button>
        </div>

        {/* Search Bar */}
        <div className="allVendors-searchBox">
          <Search size={18} className="search-icon-svg" />
          <input
            type="text"
            placeholder="Search by name, ID, category, location, or contact..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="clear-search-btn"
              onClick={() => setSearchQuery("")}
              title="Clear search"
            >
              &times;
            </button>
          )}
        </div>

        {/* Status Tabs */}
        <div className="allVendors-tabs">
          {["All", "Active", "Busy", "Suspended"].map((tab) => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "Busy" ? "Busy / Assigned" : tab}
              <span className="tab-count">
                {tab === "All" ? vendors.length : countByStatus(tab)}
              </span>
            </button>
          ))}
        </div>

        {/* Data Table */}
        <div className="allVendors-tableWrapper">
          {isLoading ? (
            <div className="table-loading-state">
              <Loader2 size={32} className="spin-icon" />
              <p>Syncing partner directory...</p>
            </div>
          ) : filteredVendors.length === 0 ? (
            <div className="table-empty-state">
              <Briefcase size={40} className="empty-state-icon" />
              <h3>No Vendors Found</h3>
              <p>No vendor records match your current filters.</p>
            </div>
          ) : (
            <table className="allVendors-table">
              <thead>
                <tr>
                  <th>Vendor ID</th>
                  <th>Company Name</th>
                  <th>Service Type</th>
                  <th>Rate</th>
                  <th>Contact Person</th>
                  <th>Location</th>
                  <th>Performance</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVendors.map((vendor) => (
                  <tr key={vendor._id}>
                    <td className="vendor-id-cell">
                      {vendor.vendorId || "N/A"}
                    </td>
                    <td>
                      <div className="vendor-title-cell">
                        <strong className="vendor-primary-name">
                          {vendor.name}
                        </strong>
                        <span className="vendor-meta-email">{vendor.email}</span>
                      </div>
                    </td>
                    <td>
                      <span className="vendor-category-badge">
                        {vendor.serviceCategory?.serviceName || "N/A"}
                      </span>
                    </td>
                    <td>₹{vendor.rate?.toLocaleString() || 0}</td>
                    <td>
                      <div className="contact-person-meta">
                        <strong>{vendor.contactPerson}</strong>
                        <span>{vendor.phone}</span>
                      </div>
                    </td>
                    <td>
                      <div className="location-meta-row">
                        <MapPin size={13} className="loc-icon" />
                        <span>{vendor.location}</span>
                      </div>
                    </td>
                    <td>
                      <div className="rating-badge-container">
                        <Star size={14} className="star-icon" fill="#f1d49b" />
                        <span>{(vendor.rating || 0).toFixed(1)}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`status-pill ${vendor.status?.toLowerCase()}`}>
                        {vendor.status}
                      </span>
                    </td>
                    <td>
                      <div className="allVendors-actions">
                        {/* View details modal */}
                        <button
                          className="allEvents-actions-btn action-view"
                          onClick={() => setSelectedVendor(vendor)}
                          title="View Vendor Profile"
                        >
                          <Eye size={16} />
                        </button>

                        {/* Edit */}
                        <button
                          className="allEvents-actions-btn action-edit"
                          onClick={() => navigate(`/editVendors/${vendor._id}`)}
                          title="Edit Vendor"
                        >
                          <Pencil size={16} />
                        </button>

                        {/* Toggle suspend / activate */}
                        {vendor.status !== "Suspended" ? (
                          <button
                            className="allEvents-actions-btn action-reject"
                            onClick={() =>
                              handleToggleStatus(vendor._id, "Suspended")
                            }
                            title="Suspend Vendor"
                          >
                            <XCircle size={16} />
                          </button>
                        ) : (
                          <button
                            className="allEvents-actions-btn action-approve"
                            onClick={() =>
                              handleToggleStatus(vendor._id, "Active")
                            }
                            title="Activate Vendor"
                          >
                            <CheckCircle size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* ── Vendor Detail Modal ── */}
        {selectedVendor && (
          <div
            className="bookingModal-overlay"
            onClick={() => setSelectedVendor(null)}
          >
            <div
              className="bookingModal-card"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bookingModal-header">
                <h3>Vendor Audit: {selectedVendor.vendorId}</h3>
                <button
                  className="closeModal-btn"
                  onClick={() => setSelectedVendor(null)}
                >
                  &times;
                </button>
              </div>

              {/* Modal Body */}
              <div className="bookingModal-body">

                {/* Hero Row: Image + Name + Category */}
                <div className="vendorModal-hero">

                  {/* Vendor image or fallback */}
                  <div className="vendorModal-imgBox">
                    {selectedVendor.image ? (
                      <img
                        src={getImageUrl(selectedVendor.image)}
                        alt={selectedVendor.name}
                        className="vendorModal-img clickable"
                        onClick={() =>
                          setLightboxImage(getImageUrl(selectedVendor.image))
                        }
                        title="Click to enlarge"
                        onError={(e) => {
                          // If image fails to load, swap to fallback
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}

                    {/* Fallback shown when no image or image fails */}
                    <div
                      className="vendorModal-imgFallback"
                      style={{ display: selectedVendor.image ? "none" : "flex" }}
                    >
                      <ImageOff size={28} />
                      <span>No Image</span>
                    </div>
                  </div>

                  <div className="vendorModal-heroInfo">
                    <h4>{selectedVendor.name}</h4>
                    <span className="vendor-category-badge">
                      {selectedVendor.serviceCategory?.serviceName || "N/A"}
                    </span>
                    <p className="vendor-modal-loc">
                      <MapPin size={13} className="loc-icon" />
                      {selectedVendor.location}
                    </p>
                  </div>

                  <div className="vendorModal-badgeContainer">
                    <span
                      className={`status-pill ${selectedVendor.status?.toLowerCase()}`}
                    >
                      {selectedVendor.status}
                    </span>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="bookingModal-grid">

                  <div className="bookingModal-infoBlock">
                    <label>Primary Contact</label>
                    <p>
                      <User size={13} className="loc-icon" />
                      &nbsp;<strong>{selectedVendor.contactPerson}</strong>
                    </p>
                    <p>
                      <Phone size={13} className="loc-icon" />
                      &nbsp;{selectedVendor.phone}
                    </p>
                    <p>
                      <Mail size={13} className="loc-icon" />
                      &nbsp;{selectedVendor.email}
                    </p>
                  </div>

                  <div className="bookingModal-infoBlock">
                    <label>Pricing</label>
                    <p className="mb-3">
                      <strong>Starting Rate: </strong>
                      ₹{selectedVendor.rate?.toLocaleString() || 0}
                    </p>
                    <label>Service Performance</label>
                    <p>
                      <strong>Total Assignments: </strong>
                      {selectedVendor.assignedEventsCount || 0} Events
                    </p>
                    <p style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                      <strong>Quality Rating:</strong>
                      <span className="rating-badge-container" style={{ display: "inline-flex", padding: "2px 8px" }}>
                        <Star size={12} className="star-icon" fill="#f1d49b" />
                        &nbsp;{(selectedVendor.rating || 0).toFixed(1)}
                      </span>
                    </p>
                  </div>

                </div>

                {/* About / Bio section */}
                {selectedVendor.about && (
                  <div className="vendorModal-about">
                    <label>About / Bio</label>
                    <p>{selectedVendor.about}</p>
                  </div>
                )}

              </div>

              {/* Modal Footer */}
              <div className="bookingModal-footer">
                {selectedVendor.status === "Suspended" ? (
                  <button
                    className="btn-approve-submit"
                    onClick={() =>
                      handleToggleStatus(selectedVendor._id, "Active")
                    }
                  >
                    Reinstate Vendor Account
                  </button>
                ) : (
                  <button
                    className="btn-reject-trigger"
                    onClick={() =>
                      handleToggleStatus(selectedVendor._id, "Suspended")
                    }
                  >
                    Suspend Vendor Account
                  </button>
                )}
                <button
                  className="bookingModal-cancelBtn"
                  onClick={() => setSelectedVendor(null)}
                >
                  Dismiss Panel
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ── Global Lightbox (for modal image click) ── */}
        {lightboxImage && (
          <div
            className="lightbox-overlay"
            onClick={() => setLightboxImage(null)}
          >
            <div
              className="lightbox-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="lightbox-close-btn"
                onClick={() => setLightboxImage(null)}
              >
                &times;
              </button>
              <img
                src={lightboxImage}
                alt="Full Size Preview"
                className="lightbox-img"
              />
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};

export default ManageVendors;