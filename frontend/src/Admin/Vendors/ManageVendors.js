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
  AlertTriangle,
} from "lucide-react";
import "./Vendors.css";
import AdminLayout from "../../Pages/Admin/Layout/AdminLayout";
import { useNavigate } from "react-router-dom";

// Mock Vendor Database linked to Eventura service categories
const INITIAL_VENDORS = [
  {
    id: "EV-VEN-2026-001",
    name: "Malabar Catering Co.",
    serviceCategory: "Catering",
    contactPerson: "Faisal Rahman",
    email: "malabar.catering@example.com",
    phone: "+91 98460 12345",
    location: "Kochi, Kerala",
    rating: 4.8,
    status: "Active", // Options: Active, Busy, Suspended
    assignedEventsCount: 14,
    recentAssignment: {
      bookingId: "EV-2026-9401",
      eventName: "Royal Heritage Wedding",
      date: "24 Oct 2026",
    },
  },
  {
    id: "EV-VEN-2026-002",
    name: "Lumiere Photography",
    serviceCategory: "Photography",
    contactPerson: "Thomas Kurian",
    email: "lumiere.photo@example.com",
    phone: "+91 94470 98765",
    location: "Trivandrum, Kerala",
    rating: 4.9,
    status: "Busy", // Currently assigned to an active event today
    assignedEventsCount: 22,
    recentAssignment: {
      bookingId: "EV-2026-9402",
      eventName: "Neon Beats Birthday",
      date: "05 Nov 2026",
    },
  },
  {
    id: "EV-VEN-2026-003",
    name: "Elite Stage Decorators",
    serviceCategory: "Decoration",
    contactPerson: "Suresh Nair",
    email: "elite.decor@example.com",
    phone: "+91 99460 55511",
    location: "Calicut, Kerala",
    rating: 4.2,
    status: "Active",
    assignedEventsCount: 8,
    recentAssignment: null,
  },
  {
    id: "EV-VEN-2026-004",
    name: "Vibe DJ & Sound Solutions",
    serviceCategory: "DJ & Music",
    contactPerson: "DJ Akhil",
    email: "vibe.sounds@example.com",
    phone: "+91 98950 44411",
    location: "Kochi, Kerala",
    rating: 3.9,
    status: "Suspended", // Account flagged/on hold due to service issues
    assignedEventsCount: 5,
    recentAssignment: null,
  },
];



const ManageVendors = () => {
  const [vendors, setVendors] = useState(INITIAL_VENDORS);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [activeTab, setActiveTab] = useState("All"); // Options: All, Active, Busy, Suspended
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Modal Controller
  const [selectedVendor, setSelectedVendor] = useState(null);

  const navigate = useNavigate();
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      let result = vendors;

      // Filter by Tabs
      if (activeTab !== "All") {
        result = result.filter((v) => v.status === activeTab);
      }

      // Filter by Search Query (Match name, service category, location, or vendor ID)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        result = result.filter(
          (v) =>
            v.name.toLowerCase().includes(query) ||
            v.id.toLowerCase().includes(query) ||
            v.serviceCategory.toLowerCase().includes(query) ||
            v.location.toLowerCase().includes(query),
        );
      }

      setFilteredVendors(result);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [activeTab, searchQuery, vendors]);

  const handleToggleStatus = (vendorId, nextStatus) => {
    setVendors((prev) =>
      prev.map((v) => (v.id === vendorId ? { ...v, status: nextStatus } : v)),
    );
    if (selectedVendor?.id === vendorId) {
      setSelectedVendor((prev) => ({ ...prev, status: nextStatus }));
    }
  };

  return (
    <AdminLayout>
      <div className="allVendors">
        {/* Title Header */}
        <div className="allVendors-header">
          <div>
            <h2>Service Vendors Directory</h2>
            <p>
              Manage external partners, track ratings, assign event sub-tasks,
              and audit active operations.
            </p>
          </div>
        </div>

        {/* Search Bar Row */}
        <div className="allVendors-searchBox">
          <Search size={18} className="search-icon-svg" />
          <input
            type="text"
            placeholder="Search vendors by ID, service type, location, or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => setSearchQuery("")}>
              &times;
            </button>
          )}
        </div>

        {/* Sub-tab Navigation */}
        <div className="allVendors-tabs">
          <button
            className={activeTab === "All" ? "tab-btn active" : "tab-btn"}
            onClick={() => setActiveTab("All")}
          >
            All Vendors <span className="tab-count">{vendors.length}</span>
          </button>
          <button
            className={activeTab === "Active" ? "tab-btn active" : "tab-btn"}
            onClick={() => setActiveTab("Active")}
          >
            Active{" "}
            <span className="tab-count">
              {vendors.filter((v) => v.status === "Active").length}
            </span>
          </button>
          <button
            className={activeTab === "Busy" ? "tab-btn active" : "tab-btn"}
            onClick={() => setActiveTab("Busy")}
          >
            Busy / Assigned{" "}
            <span className="tab-count">
              {vendors.filter((v) => v.status === "Busy").length}
            </span>
          </button>
          <button
            className={activeTab === "Suspended" ? "tab-btn active" : "tab-btn"}
            onClick={() => setActiveTab("Suspended")}
          >
            Suspended{" "}
            <span className="tab-count">
              {vendors.filter((v) => v.status === "Suspended").length}
            </span>
          </button>
          <button onClick={() => navigate('/addVendors') }>
            Add Vendors
          </button>
        </div>

        {}
        {/* Main Table Wrapper */}
        <div className="allVendors-tableWrapper">
          {isLoading ? (
            <div className="table-loading-state">
              <div className="spinner"></div>
              <p>Syncing partner directory...</p>
            </div>
          ) : filteredVendors.length === 0 ? (
            <div className="table-empty-state">
              <Briefcase size={40} className="empty-state-icon" />
              <h3>No Vendors Discovered</h3>
              <p>
                We found no vendor logs matching your current configuration
                filters.
              </p>
            </div>
          ) : (
            <table className="allVendors-table">
              <thead>
                <tr>
                  <th>Vendor ID</th>
                  <th>Company Name</th>
                  <th>Service Type</th>
                  <th>Contact Person</th>
                  <th>Location</th>
                  <th>Performance</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVendors.map((vendor) => (
                  <tr key={vendor.id}>
                    <td className="vendor-id-cell">{vendor.id}</td>
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
                        {vendor.serviceCategory}
                      </span>
                    </td>
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
                        <span>{vendor.rating.toFixed(1)}</span>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`status-pill ${vendor.status.toLowerCase()}`}
                      >
                        {vendor.status}
                      </span>
                    </td>
                    <td>
                      <div className="allVendors-actions">
                        <button
                          className="allEvents-actions-btn action-view"
                          onClick={() => setSelectedVendor(vendor)}
                          title="Inspect Vendor Profile"
                        >
                          <Eye size={16} />
                        </button>

                        {vendor.status !== "Suspended" ? (
                          <button
                            className="allEvents-actions-btn action-reject"
                            onClick={() =>
                              handleToggleStatus(vendor.id, "Suspended")
                            }
                            title="Suspend Vendor"
                          >
                            <XCircle size={16} />
                          </button>
                        ) : (
                          <button
                            className="allEvents-actions-btn action-approve"
                            onClick={() =>
                              handleToggleStatus(vendor.id, "Active")
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

        {}
        {/* Detailed Vendor Inspection Modal */}
        {selectedVendor && (
          <div
            className="bookingModal-overlay"
            onClick={() => setSelectedVendor(null)}
          >
            <div
              className="bookingModal-card"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bookingModal-header">
                <h3>Vendor Audit: {selectedVendor.id}</h3>
                <button
                  className="closeModal-btn"
                  onClick={() => setSelectedVendor(null)}
                >
                  &times;
                </button>
              </div>

              <div className="bookingModal-body">
                {/* Profile Card Hero row */}
                <div className="vendorModal-hero">
                  <div className="vendorModal-iconBox">
                    <Briefcase size={30} className="hero-briefcase" />
                  </div>
                  <div>
                    <h4>{selectedVendor.name}</h4>
                    <span className="vendor-category-badge">
                      {selectedVendor.serviceCategory}
                    </span>
                    <p className="vendor-modal-loc">
                      <MapPin size={13} className="loc-icon" />{" "}
                      {selectedVendor.location}
                    </p>
                  </div>
                  <div className="vendorModal-badgeContainer">
                    <span
                      className={`status-pill ${selectedVendor.status.toLowerCase()}`}
                    >
                      {selectedVendor.status}
                    </span>
                  </div>
                </div>

                {/* Contact Information & Analytics */}
                <div className="bookingModal-grid">
                  <div className="bookingModal-infoBlock">
                    <label>Primary Contact</label>
                    <p
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <User size={14} className="loc-icon" />{" "}
                      <strong>{selectedVendor.contactPerson}</strong>
                    </p>
                    <p
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <Phone size={13} className="loc-icon" />{" "}
                      {selectedVendor.phone}
                    </p>
                    <p
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <Mail size={13} className="loc-icon" />{" "}
                      {selectedVendor.email}
                    </p>
                  </div>
                  <div className="bookingModal-infoBlock">
                    <label>Service Performance</label>
                    <p>
                      <strong>Total Assignments:</strong>{" "}
                      {selectedVendor.assignedEventsCount} Events
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
                        <Star size={12} className="star-icon" fill="#f1d49b" />{" "}
                        {selectedVendor.rating.toFixed(1)}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Assignment Information */}
                <div className="vendor-assignment-section">
                  <label>Active Project Allocation</label>
                  {selectedVendor.recentAssignment ? (
                    <div className="active-assignment-box">
                      <div className="assignment-lbl">
                        <strong>
                          {selectedVendor.recentAssignment.eventName}
                        </strong>
                        <span>
                          Assignment Code:{" "}
                          {selectedVendor.recentAssignment.bookingId}
                        </span>
                      </div>
                      <div className="assignment-date">
                        <span>{selectedVendor.recentAssignment.date}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="no-assignment-box">
                      <CheckCircle size={22} className="available-icon" />
                      <span>
                        Vendor is currently open for task assignment and
                        upcoming events.
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bookingModal-footer">
                {selectedVendor.status === "Suspended" ? (
                  <button
                    className="btn-approve-submit"
                    onClick={() =>
                      handleToggleStatus(selectedVendor.id, "Active")
                    }
                  >
                    Reinstate Vendor Account
                  </button>
                ) : (
                  <button
                    className="btn-reject-trigger"
                    onClick={() =>
                      handleToggleStatus(selectedVendor.id, "Suspended")
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
      </div>
    </AdminLayout>
  );
};

export default ManageVendors;
