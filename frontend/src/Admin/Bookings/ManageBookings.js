import React, { useState, useEffect } from "react";
import "./Bookings.css";
import AdminLayout from "../../Pages/Admin/Layout/AdminLayout";
import {
  CalendarCheck2,
  CircleCheckBig,
  Eye,
  Folder,
  PackageCheck,
  Pencil,
  Search,
  ShieldAlert,
  X,
} from "lucide-react";

// Mocking real data that directly cross-references your Categories, Events, Services, and Packages
const INTEGRATED_BOOKINGS_DATA = [
  {
    id: "EV-2026-9401",
    clientName: "Rahul Sharma",
    email: "rahul@example.com",
    phone: "+91 98765 43210",
    createdDate: "12 Jun 2026",
    eventDate: "24 Oct 2026",

    // Cross-referenced data fields from your other modules:
    selectedEvent: {
      eventName: "Royal Heritage Wedding",
      categoryName: "Marriage Events",
      coverImage:
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=150",
    },
    selectedPackage: {
      packageName: "Imperial Diamond Suite",
      price: 120000,
      includedServicesCount: 5,
    },
    extraServices: [
      { serviceName: "DJ & Music", price: 15000 },
      { serviceName: "Cake Service", price: 10000 },
    ],

    totalAmount: 145000,
    status: "Pending",
  },
  {
    id: "EV-2026-9402",
    clientName: "Anita Joseph",
    email: "anita@example.com",
    phone: "+91 94471 23456",
    createdDate: "10 Jun 2026",
    eventDate: "05 Nov 2026",

    selectedEvent: {
      eventName: "Neon Beats Birthday",
      categoryName: "Birthday Parties",
      coverImage:
        "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=150",
    },
    selectedPackage: {
      packageName: "Standard Party Pack",
      price: 25000,
      includedServicesCount: 2,
    },
    extraServices: [{ serviceName: "Photography", price: 10000 }],

    totalAmount: 35000,
    status: "Confirmed",
  },
];

const ManageBookings = () => {
  const [bookings, setBookings] = useState(INTEGRATED_BOOKINGS_DATA);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("Pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // State for the global delete/rejection confirmation modal requirement
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    bookingId: null,
  });

  // Simulate SaaS system loading state changes when switching views
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      let result = bookings.filter((b) => b.status === activeTab);

      if (searchQuery) {
        result = result.filter(
          (b) =>
            b.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.selectedEvent.eventName
              .toLowerCase()
              .includes(searchQuery.toLowerCase()),
        );
      }

      setFilteredBookings(result);
      setIsLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [activeTab, searchQuery, bookings]);

  const handleApprove = (id) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "Confirmed" } : b)),
    );
    if (selectedBooking?.id === id) setSelectedBooking(null);
  };

  const handleComplete = (id) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "Completed" } : b)),
    );
    if (selectedBooking?.id === id) setSelectedBooking(null);
  };

  const openDeleteModal = (id, e) => {
    e.stopPropagation(); // Stop row clicks from opening info triggers
    setDeleteModal({ isOpen: true, bookingId: id });
  };

  const confirmRejectDelete = () => {
    const id = deleteModal.bookingId;
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "Cancelled" } : b)),
    );
    setDeleteModal({ isOpen: false, bookingId: null });
    if (selectedBooking?.id === id) setSelectedBooking(null);
  };

  return (
    <AdminLayout>
      <div className="allBookings">
        {/* Title Header Block */}
        <div className="allBookings-header">
          <div>
            <h2>Event Bookings Engine</h2>
            <p>
              Process customer requests mapped against core event types, system
              packages, and base services.
            </p>
          </div>
        </div>

        {/* Global SaaS Requirement Components: Search Bar */}
        <div className="allBookings-searchBox">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by ID, client name, or chosen event type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => setSearchQuery("")}>
              &times;
            </button>
          )}
        </div>

        {/* Structured Booking State Filter Sub-tabs */}
        <div className="allBookings-tabs">
          <button
            className={activeTab === "Pending" ? "tab-btn active" : "tab-btn"}
            onClick={() => setActiveTab("Pending")}
          >
            New Requests{" "}
            <span className="tab-count">
              {bookings.filter((b) => b.status === "Pending").length}
            </span>
          </button>
          <button
            className={activeTab === "Confirmed" ? "tab-btn active" : "tab-btn"}
            onClick={() => setActiveTab("Confirmed")}
          >
            Active Events{" "}
            <span className="tab-count">
              {bookings.filter((b) => b.status === "Confirmed").length}
            </span>
          </button>
          <button
            className={activeTab === "Completed" ? "tab-btn active" : "tab-btn"}
            onClick={() => setActiveTab("Completed")}
          >
            Booking History{" "}
            <span className="tab-count">
              {bookings.filter((b) => b.status === "Completed").length}
            </span>
          </button>
          <button
            className={activeTab === "Cancelled" ? "tab-btn active" : "tab-btn"}
            onClick={() => setActiveTab("Cancelled")}
          >
            Cancelled{" "}
            <span className="tab-count">
              {bookings.filter((b) => b.status === "Cancelled").length}
            </span>
          </button>
        </div>

        {/* Table Data Render Block handles Loading, Empty, and Success states */}
        <div className="allBookings-tableWrapper">
          {isLoading ? (
            <div className="table-loading-state">
              <div className="spinner"></div>
              <p>Fetching booking records and computing prices...</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="table-empty-state">
              <div className="empty-icon">
                <Folder size={56} />
              </div>
              <h3>No Booking Records Found</h3>
              <p>
                There are no logs matching your criteria under the "{activeTab}"
                filter.
              </p>
            </div>
          ) : (
            <table className="allBookings-table">
              <thead>
                <tr>
                  <th>Event View</th>
                  <th>Booking Details</th>
                  <th>Client Details</th>
                  <th>Event Date</th>
                  <th>Pricing Context</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>
                      <img
                        src={booking.selectedEvent.coverImage}
                        alt={booking.selectedEvent.eventName}
                        className="booking-table-img"
                      />
                    </td>
                    <td>
                      <div className="booking-meta">
                        <strong className="event-primary-txt">
                          {booking.selectedEvent.eventName}
                        </strong>
                        <span className="category-sub-tag">
                          {booking.selectedEvent.categoryName}
                        </span>
                        <small className="booking-uid-lbl">{booking.id}</small>
                      </div>
                    </td>
                    <td>
                      <div className="client-meta">
                        <strong>{booking.clientName}</strong>
                        <span>{booking.email}</span>
                      </div>
                    </td>
                    <td>
                      <div className="date-meta">
                        <span>{booking.eventDate}</span>
                        <small>Created: {booking.createdDate}</small>
                      </div>
                    </td>
                    <td>
                      <div className="pricing-meta">
                        <strong className="gold-text">
                          ₹{booking.totalAmount.toLocaleString()}
                        </strong>
                        <small>{booking.selectedPackage.packageName}</small>
                      </div>
                    </td>
                    <td>
                      <div className="allBookings-actions">
                        <button
                          className="allEvents-actions-btn action-view"
                          onClick={() => setSelectedBooking(booking)}
                          title="View Complete Structure"
                        >
                          <Eye size={16} />
                        </button>

                        {booking.status === "Pending" && (
                          <>
                            <button
                              className="allEvents-actions-btn action-approve"
                              onClick={() => handleApprove(booking.id)}
                              title="Approve Request"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              className="allEvents-actions-btn action-reject"
                              onClick={(e) => openDeleteModal(booking.id, e)}
                              title="Reject/Cancel Booking"
                            >
                              <X size={16} />
                            </button>
                          </>
                        )}

                        {booking.status === "Confirmed" && (
                          <>
                            <button
                              className="allEvents-actions-btn action-complete"
                              onClick={() => handleComplete(booking.id)}
                              title="Mark Complete"
                            >
                              <CalendarCheck2 size={16} />
                            </button>
                            <button
                              className="allEvents-actions-btn action-reject"
                              onClick={(e) => openDeleteModal(booking.id, e)}
                              title="Cancel Event"
                            >
                              <X size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal Element 1: Complete Operational Detail Inspection Window */}
        {selectedBooking && (
          <div
            className="bookingModal-overlay"
            onClick={() => setSelectedBooking(null)}
          >
            <div
              className="bookingModal-card"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bookingModal-header">
                <h3>Detailed Manifest: {selectedBooking.id}</h3>
                <button
                  className="closeModal-btn"
                  onClick={() => setSelectedBooking(null)}
                >
                  &times;
                </button>
              </div>

              <div className="bookingModal-body">
                <div className="bookingModal-topHero">
                  <img
                    src={selectedBooking.selectedEvent.coverImage}
                    alt="Event Cover"
                  />
                  <div>
                    <h4>{selectedBooking.selectedEvent.eventName}</h4>
                    <span className="category-badge">
                      {selectedBooking.selectedEvent.categoryName}
                    </span>
                  </div>
                </div>

                <div className="bookingModal-grid">
                  <div className="bookingModal-infoBlock">
                    <label>Customer Matrix</label>
                    <p>
                      <strong>Name:</strong> {selectedBooking.clientName}
                    </p>
                    <p>
                      <strong>Email:</strong> {selectedBooking.email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {selectedBooking.phone}
                    </p>
                  </div>
                  <div className="bookingModal-infoBlock">
                    <label>Execution Timeline</label>
                    <p>
                      <strong>Target Date:</strong> {selectedBooking.eventDate}
                    </p>
                    <p>
                      <strong>Filing Date:</strong>{" "}
                      {selectedBooking.createdDate}
                    </p>
                    <p>
                      <strong>Workflow Status:</strong>{" "}
                      <span
                        className={`status-pill ${selectedBooking.status.toLowerCase()}`}
                      >
                        {selectedBooking.status}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="bookingModal-servicesSection">
                  <label>
                    Package Selected (Includes{" "}
                    {selectedBooking.selectedPackage.includedServicesCount} Base
                    Services)
                  </label>
                  <div className="package-detail-strip">
                    <span>
                      <PackageCheck size={20} />{" "}
                      {selectedBooking.selectedPackage.packageName}
                    </span>
                    <strong>
                      ₹{selectedBooking.selectedPackage.price.toLocaleString()}
                    </strong>
                  </div>

                  {selectedBooking.extraServices.length > 0 && (
                    <>
                      <label style={{ marginTop: "15px" }}>
                        Custom Service Add-ons Selected
                      </label>
                      <div className="bookingModal-servicesGrid">
                        {selectedBooking.extraServices.map((service, index) => (
                          <div key={index} className="bookingModal-serviceItem">
                            <span>
                              <CircleCheckBig  size={16}/>&nbsp;&nbsp;
                              {service.serviceName}
                            </span>
                            <strong>+ ₹{service.price.toLocaleString()}</strong>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <div className="bookingModal-totalPrice">
                  <span>Aggregated Gross Total:</span>
                  <span className="price-tag">
                    ₹{selectedBooking.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="bookingModal-footer">
                {selectedBooking.status === "Pending" && (
                  <>
                    <button
                      className="btn-approve-submit"
                      onClick={() => handleApprove(selectedBooking.id)}
                    >
                      Confirm Booking
                    </button>
                    <button
                      className="btn-reject-trigger"
                      onClick={(e) => {
                        setSelectedBooking(null);
                        openDeleteModal(selectedBooking.id, e);
                      }}
                    >
                      Reject Booking
                    </button>
                  </>
                )}
                <button
                  className="bookingModal-cancelBtn"
                  onClick={() => setSelectedBooking(null)}
                >
                  Dismiss View
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Element 2: Global Standard Cancellation/Rejection Confirmation Modal */}
        {deleteModal.isOpen && (
          <div className="bookingModal-overlay">
            <div className="bookingModal-card confirmation-mini">
              <div className="bookingModal-body text-center">
                <div className="warning-icon">
                  <ShieldAlert size={56} />
                </div>
                <h3>Confirm Action Request</h3>
                <p>
                  Are you sure you want to cancel or reject booking{" "}
                  <strong>{deleteModal.bookingId}</strong>? This changes
                  customer processing workflow tracking states.
                </p>
                <div className="confirmation-actions">
                  <button
                    className="btn-danger-execute"
                    onClick={confirmRejectDelete}
                  >
                    Yes, Proceed Rejection
                  </button>
                  <button
                    className="addEvent-cancelBtn"
                    onClick={() =>
                      setDeleteModal({ isOpen: false, bookingId: null })
                    }
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ManageBookings;
