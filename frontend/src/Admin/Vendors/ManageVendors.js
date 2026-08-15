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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import "./Vendors.css";
import AdminLayout from "../../Pages/Admin/Layout/AdminLayout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const ROWS_PER_PAGE = 10;

const ManageVendors = () => {
  const navigate = useNavigate();

  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

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
          vendor.serviceCategory?.serviceName?.toLowerCase().includes(query) ||
          vendor.location?.toLowerCase().includes(query) ||
          vendor.contactPerson?.toLowerCase().includes(query),
      );
    }

    setFilteredVendors(result);
    // Whenever the tab or search changes, the result set is different —
    // jump back to page 1 so we don't land on an empty/out-of-range page.
    setCurrentPage(1);
  }, [vendors, activeTab, searchQuery]);

  // ── Pagination ──────────────────────────────────────────────
  const totalPages = Math.max(
    1,
    Math.ceil(filteredVendors.length / ROWS_PER_PAGE),
  );
  const paginatedVendors = filteredVendors.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE,
  );

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

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
        status === "Active"
          ? "Vendor activated successfully"
          : "Vendor suspended",
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

  // Shared action buttons — used in both the table row and the card.
  // Uses data-tooltip (not the native title attribute) so the label
  // renders instantly using the app's own tooltip styling, matching
  // the pattern used on the Events page.
  const ActionButtons = ({ vendor }) => (
    <div className="allVendors-actions">
      <button
        className="allVendors-actionBtn action-view"
        data-tooltip="View Vendor"
        aria-label="View Vendor"
        onClick={() => setSelectedVendor(vendor)}
      >
        <Eye size={16} />
      </button>
      <button
        className="allVendors-actionBtn action-edit"
        data-tooltip="Edit Vendor"
        aria-label="Edit Vendor"
        onClick={() => navigate(`/editVendors/${vendor._id}`)}
      >
        <Pencil size={16} />
      </button>
      {vendor.status !== "Suspended" ? (
        <button
          className="allVendors-actionBtn action-reject"
          data-tooltip="Suspend Vendor"
          aria-label="Suspend Vendor"
          onClick={() => handleToggleStatus(vendor._id, "Suspended")}
        >
          <XCircle size={16} />
        </button>
      ) : (
        <button
          className="allVendors-actionBtn action-approve"
          data-tooltip="Activate Vendor"
          aria-label="Activate Vendor"
          onClick={() => handleToggleStatus(vendor._id, "Active")}
        >
          <CheckCircle size={16} />
        </button>
      )}
    </div>
  );

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
            <span className="add-vendor-btn-label">Add Vendor</span>
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

        {/* Data Table / Card List */}
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
            <>
              {/* ---------- TABLE VIEW (large & medium screens) ---------- */}
              <div className="allVendors-tableScroll">
                <table className="allVendors-table">
                  <thead>
                    <tr>
                      <th>Vendor ID</th>
                      <th>Company Name</th>
                      <th>Service Type</th>
                      <th>Rate</th>
                      <th>Contact Person</th>
                      <th>Location</th>
                      {/* <th>Performance</th> */}
                      <th>Status</th>
                      <th style={{ textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedVendors.map((vendor) => (
                      <tr key={vendor._id}>
                        <td className="vendor-id-cell">
                          {vendor.vendorId || "N/A"}
                        </td>
                        <td>
                          <div className="vendor-title-cell">
                            <strong className="vendor-primary-name">
                              {vendor.name}
                            </strong>
                            <span className="vendor-meta-email">
                              {vendor.email}
                            </span>
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
                        {/* <td>
                          <div className="rating-badge-container">
                            <Star
                              size={14}
                              className="star-icon"
                              fill="#f1d49b"
                            />
                            <span>{(vendor.rating || 0).toFixed(1)}</span>
                          </div>
                        </td> */}
                        <td>
                          <span
                            className={`status-pill ${vendor.status?.toLowerCase()}`}
                          >
                            {vendor.status}
                          </span>
                        </td>
                        <td>
                          <ActionButtons vendor={vendor} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ---------- CARD VIEW (small screens only) ---------- */}
              <div className="allVendors-cardList">
                {paginatedVendors.map((vendor) => (
                  <div className="allVendors-card" key={vendor._id}>
                    <div className="allVendors-card-top">
                      <div className="allVendors-card-titleBlock">
                        <h4>{vendor.name}</h4>
                        <span className="allVendors-card-id">
                          {vendor.vendorId || "N/A"}
                        </span>
                        <span className="vendor-category-badge">
                          {vendor.serviceCategory?.serviceName || "N/A"}
                        </span>
                      </div>
                      <span
                        className={`status-pill ${vendor.status?.toLowerCase()}`}
                      >
                        {vendor.status}
                      </span>
                    </div>

                    <div className="allVendors-card-body">
                      <div className="allVendors-card-row">
                        <User size={14} />
                        <span>{vendor.contactPerson}</span>
                      </div>
                      <div className="allVendors-card-row">
                        <Phone size={14} />
                        <span>{vendor.phone}</span>
                      </div>
                      <div className="allVendors-card-row">
                        <MapPin size={14} />
                        <span>{vendor.location}</span>
                        {/* <Star size={14} fill="#f1d49b" />
                        <span>{(vendor.rating || 0).toFixed(1)} rating</span> */}
                      </div>
                      
                    </div>

                    <div className="allVendors-card-footer">
                      <span className="allVendors-card-rate">
                        ₹{vendor.rate?.toLocaleString() || 0}
                      </span>
                      <ActionButtons vendor={vendor} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="allVendors-pagination">
                <span className="pagination-info">
                  Showing {(currentPage - 1) * ROWS_PER_PAGE + 1}–
                  {Math.min(
                    currentPage * ROWS_PER_PAGE,
                    filteredVendors.length,
                  )}{" "}
                  of {filteredVendors.length}
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
                      style={{
                        display: selectedVendor.image ? "none" : "flex",
                      }}
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
                      <strong>Starting Rate: </strong>₹
                      {selectedVendor.rate?.toLocaleString() || 0}
                    </p>
                    {/* <label>Service Performance</label>
                    <p>
                      <strong>Total Assignments: </strong>
                      {selectedVendor.assignedEventsCount || 0} Events
                    </p>
                    <p
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <strong>Quality Rating:</strong>
                      <span
                        className="rating-badge-container"
                        style={{ display: "inline-flex", padding: "2px 8px" }}
                      >
                        <Star size={12} className="star-icon" fill="#f1d49b" />
                        &nbsp;{(selectedVendor.rating || 0).toFixed(1)}
                      </span>
                    </p> */}
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
      <ToastContainer position="top-right" autoClose={3000} />
    </AdminLayout>
  );
};

export default ManageVendors;
