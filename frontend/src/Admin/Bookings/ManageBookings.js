import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "./Bookings.css";
import AdminLayout from "../../Pages/Admin/Layout/AdminLayout";
import {
  CalendarCheck2,
  CheckCircle,
  CircleCheckBig,
  Eye,
  Folder,
  Lock,
  PackageCheck,
  Search,
  ShieldAlert,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const BASE_URL = "http://localhost:5000";

// Tabs shown in the UI, mapped to the actual booking.status values stored in
// the DB. Order matters — it mirrors the lifecycle left to right.
const TABS = [
  { key: "Pending", label: "Awaiting Advance" },
  { key: "ReadyForApproval", label: "Pending Approval" },
  { key: "Confirmed", label: "Active Events" },
  { key: "Completed", label: "Awaiting Balance" },
  { key: "Closed", label: "Closed" },
  { key: "Cancelled", label: "Cancelled" },
];

// How many rows to show per page. Same convention as ManagePayments.
const ROWS_PER_PAGE = 8;

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("ReadyForApproval");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Shared modal for any action that requires a typed reason —
  // rejecting a ReadyForApproval booking, or cancelling a Confirmed event.
  const [reasonModal, setReasonModal] = useState({
    isOpen: false,
    type: null, // "reject" | "cancel"
    id: null,
    bookingId: "",
    reason: "",
  });
  const [reasonError, setReasonError] = useState("");

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/bookings`);
      setBookings(res.data.data);
    } catch (error) {
      toast.error("Failed to load bookings.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    let result = bookings.filter((b) => b.status === activeTab);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.fullName?.toLowerCase().includes(q) ||
          b._id?.toLowerCase().includes(q) ||
          b.bookingId?.toLowerCase().includes(q) ||
          b.event?.eventName?.toLowerCase().includes(q),
      );
    }

    setFilteredBookings(result);
    // Whenever the tab or search changes, the result set is different —
    // jump back to page 1 so we don't land on an empty/out-of-range page.
    setCurrentPage(1);
  }, [activeTab, searchQuery, bookings]);

  // ── Pagination ──────────────────────────────────────────────
  const totalPages = Math.max(
    1,
    Math.ceil(filteredBookings.length / ROWS_PER_PAGE),
  );
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE,
  );

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Generic runner for the simple, no-reason-required actions
  // (approve / complete / close). Applies the returned booking to state
  // and surfaces the backend's guidance message as the toast.
  const runAction = async (id, url, method = "patch", payload = {}) => {
    setActionLoadingId(id);
    try {
      const res = await axios[method](`${BASE_URL}${url}`, payload);
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? res.data.data : b)),
      );
      toast.success(res.data.message);
      if (selectedBooking?._id === id) setSelectedBooking(res.data.data);
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Action failed.");
      return false;
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleApprove = (id) => runAction(id, `/api/bookings/${id}/approve`);

  const handleComplete = (id) => runAction(id, `/api/bookings/${id}/complete`);

  const handleClose = (id) => runAction(id, `/api/bookings/${id}/close`);

  // ── Reason-required actions (reject / cancel) share one modal ──
  const openReasonModal = (booking, type, e) => {
    e?.stopPropagation();
    setReasonModal({
      isOpen: true,
      type,
      id: booking._id,
      bookingId: booking.bookingId,
      reason: "",
    });
    setReasonError("");
  };

  const closeReasonModal = () => {
    setReasonModal({
      isOpen: false,
      type: null,
      id: null,
      bookingId: "",
      reason: "",
    });
    setReasonError("");
  };

  const confirmReasonAction = async () => {
    if (!reasonModal.reason.trim()) {
      setReasonError(
        reasonModal.type === "reject"
          ? "Please explain why this booking is being rejected."
          : "Please explain why this event is being cancelled.",
      );
      return;
    }

    const url =
      reasonModal.type === "reject"
        ? `/api/bookings/${reasonModal.id}/reject`
        : `/api/bookings/${reasonModal.id}/cancel`;

    const payload = { reason: reasonModal.reason.trim() };

    const success = await runAction(reasonModal.id, url, "patch", payload);

    if (success) {
      if (selectedBooking?._id === reasonModal.id) setSelectedBooking(null);
      closeReasonModal();
    }
  };

  const formatDate = (dateStr) =>
    dateStr
      ? new Date(dateStr).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "-";

  // Human-friendly label for the status pill / badge
  const statusLabel = (status) => {
    const map = {
      Pending: "Awaiting Advance",
      ReadyForApproval: "Pending Approval",
      Confirmed: "Confirmed",
      Completed: "Awaiting Balance",
      Closed: "Closed",
      Cancelled: "Cancelled",
    };
    return map[status] || status;
  };

  const statusPillClass = (status) => `status-pill ${status.toLowerCase()}`;

  const canClose = (booking) =>
    booking.status === "Completed" &&
    booking.paymentSummary?.finalStatus === "Paid";

  // Shared action buttons — identical markup/logic used in both the
  // table row and the mobile card, same pattern as ManageClients.jsx
  const BookingActions = ({ booking }) => (
    <div className="allBookings-actions">
      <div className="tooltip-wrapper">
        <button
          className="allEvents-actions-btn action-view"
          onClick={() => setSelectedBooking(booking)}
        >
          <Eye size={16} />
        </button>
        <span className="tooltip-text">View Complete Structure</span>
      </div>

      {/* Pending — waiting on the client's advance payment, nothing for admin to do yet */}
      {booking.status === "Pending" && (
        <div className="tooltip-wrapper">
          <span className="allEvents-actions-btn action-locked">
            <Lock size={14} />
          </span>
          <span className="tooltip-text">
            Awaiting verified advance payment
          </span>
        </div>
      )}

      {/* ReadyForApproval — advance verified, admin can approve or reject */}
      {booking.status === "ReadyForApproval" && (
        <>
          <div className="tooltip-wrapper">
            <button
              className="allEvents-actions-btn action-approve"
              onClick={() => handleApprove(booking._id)}
              disabled={actionLoadingId === booking._id}
            >
              <CheckCircle size={16} />
            </button>
            <span className="tooltip-text">Approve Booking</span>
          </div>
          <div className="tooltip-wrapper">
            <button
              className="allEvents-actions-btn action-reject"
              onClick={(e) => openReasonModal(booking, "reject", e)}
              disabled={actionLoadingId === booking._id}
            >
              <X size={16} />
            </button>
            <span className="tooltip-text">Reject Booking</span>
          </div>
        </>
      )}

      {/* Confirmed — event scheduled, admin can mark it complete or cancel it */}
      {booking.status === "Confirmed" && (
        <>
          <div className="tooltip-wrapper">
            <button
              className="allEvents-actions-btn action-complete"
              onClick={() => handleComplete(booking._id)}
              disabled={actionLoadingId === booking._id}
            >
              <CalendarCheck2 size={16} />
            </button>
            <span className="tooltip-text">Mark Event Completed</span>
          </div>
          <div className="tooltip-wrapper">
            <button
              className="allEvents-actions-btn action-reject"
              onClick={(e) => openReasonModal(booking, "cancel", e)}
              disabled={actionLoadingId === booking._id}
            >
              <X size={16} />
            </button>
            <span className="tooltip-text">Cancel Event</span>
          </div>
        </>
      )}

      {/* Completed — event happened, waiting on / closing out the balance payment */}
      {booking.status === "Completed" &&
        (canClose(booking) ? (
          <div className="tooltip-wrapper">
            <button
              className="allEvents-actions-btn action-complete"
              onClick={() => handleClose(booking._id)}
              disabled={actionLoadingId === booking._id}
            >
              <PackageCheck size={16} />
            </button>
            <span className="tooltip-text">Close Booking</span>
          </div>
        ) : (
          <div className="tooltip-wrapper">
            <span className="allEvents-actions-btn action-locked">
              <Lock size={14} />
            </span>
            <span className="tooltip-text">
              Awaiting verified balance payment
            </span>
          </div>
        ))}
    </div>
  );

  return (
    <AdminLayout>
      <div className="allBookings">
        <div className="allBookings-header">
          <div>
            <h2>Event Bookings Engine</h2>
            <p>
              Process customer requests mapped against event types, packages,
              and services.
            </p>
          </div>
        </div>

        <div className="allBookings-searchBox">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by client name, booking ID, or event type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => setSearchQuery("")}>
              &times;
            </button>
          )}
        </div>

        <div className="allBookings-tabs">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              className={activeTab === key ? "tab-btn active" : "tab-btn"}
              onClick={() => setActiveTab(key)}
            >
              {label}
              <span className="tab-count">
                {bookings.filter((b) => b.status === key).length}
              </span>
            </button>
          ))}
        </div>

        <div className="allBookings-tableWrapper">
          {isLoading ? (
            <div className="table-loading-state">
              <div className="spinner"></div>
              <p>Fetching booking records...</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="table-empty-state">
              <div className="empty-icon">
                <Folder size={56} />
              </div>
              <h3>No Booking Records Found</h3>
              <p>
                There are no logs matching your criteria under the "
                {TABS.find((t) => t.key === activeTab)?.label}" filter.
              </p>
            </div>
          ) : (
            <>
              {/* ---------- TABLE VIEW (large & medium screens) ---------- */}
              <div className="allBookings-tableScroll">
                <table className="allBookings-table">
                  <thead>
                    <tr>
                      <th>Event View</th>
                      <th>Booking Details</th>
                      <th>Client Details</th>
                      <th>Event Date</th>
                      <th>Pricing Context</th>
                      <th style={{ textAlign: "center" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedBookings.map((booking) => (
                      <tr key={booking._id}>
                        <td>
                          <img
                            src={`${BASE_URL}/uploads/${booking.event?.coverImage}`}
                            alt={booking.event?.eventName}
                            className="booking-table-img"
                          />
                        </td>
                        <td>
                          <div className="booking-meta">
                            <strong className="event-primary-txt">
                              {booking.event?.eventName}
                            </strong>
                            <span className="category-sub-tag">
                              {booking.event?.category?.categoryName}
                            </span>
                            <small className="booking-uid-lbl">
                              {booking.bookingId}
                            </small>
                          </div>
                        </td>
                        <td>
                          <div className="client-meta">
                            <strong>{booking.fullName}</strong>
                            <span>{booking.email}</span>
                          </div>
                        </td>
                        <td>
                          <div className="date-meta">
                            <span>{formatDate(booking.eventDate)}</span>
                            <small>
                              Created: {formatDate(booking.createdAt)}
                            </small>
                          </div>
                        </td>
                        <td>
                          <div className="pricing-meta">
                            <strong className="gold-text">
                              ₹{booking.totalAmount?.toLocaleString()}
                            </strong>
                            <small>
                              {booking.package?.packageName
                                ? `${booking.package.packageName}`
                                : "Custom Package"}
                            </small>
                          </div>
                        </td>

                        <td>
                          <BookingActions booking={booking} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ---------- CARD VIEW (medium & small screens) ---------- */}
              <div className="allBookings-cardList">
                {paginatedBookings.map((booking) => (
                  <div className="allBookings-card" key={booking._id}>
                    {/* 1. Top Details as Grid */}
                    <div className="allBookings-card-top">
                      <img
                        src={`${BASE_URL}/uploads/${booking.event?.coverImage}`}
                        alt={booking.event?.eventName}
                      />
                      <div className="allBookings-card-titleBlock">
                        <strong>{booking.event?.eventName}</strong>
                        <span className="category-sub-tag">
                          {booking.event?.category?.categoryName}
                        </span>
                        <small className="booking-uid-lbl">
                          {booking.bookingId}
                        </small>
                      </div>
                      <div className="allBookings-card-statusWrap">
                        <span className={statusPillClass(booking.status)}>
                          {statusLabel(booking.status)}
                        </span>
                      </div>
                    </div>

                    {/* 2. Client Details & Price as Grid */}

                    <div className="allBookings-card-infoGrid">
                      {/* Column 1: Client Details */}
                      <div className="allBookings-card-clientCol">
                        <span className="grid-label">Client Details</span>
                        <strong>{booking.fullName}</strong>
                        <small>{booking.email}</small>
                      </div>

                      {/* Column 2: Pricing Details */}
                      <div className="allBookings-card-priceCol">
                        <span className="grid-label">Pricing</span>
                        <strong className="gold-text">
                          ₹{booking.totalAmount?.toLocaleString()}
                        </strong>
                        <small className="package-name">
                          {booking.package?.packageName
                            ? `${booking.package.packageName}`
                            : "Custom Pkg"}
                        </small>
                      </div>
                    </div>

                    <div className="allBookings-card-footer">
                      <span className="allBookings-card-date">
                        Event: {formatDate(booking.eventDate)}
                      </span>
                      <BookingActions booking={booking} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination bar — same layout as ManagePayments:
                  "Showing X–Y of Z" on the left, Prev/numbers/Next on the right */}
              <div className="allBookings-pagination">
                <span className="pagination-info">
                  Showing {(currentPage - 1) * ROWS_PER_PAGE + 1}–
                  {Math.min(
                    currentPage * ROWS_PER_PAGE,
                    filteredBookings.length,
                  )}{" "}
                  of {filteredBookings.length}
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
                <h3>Detailed Manifest: {selectedBooking.bookingId}</h3>
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
                    src={`${BASE_URL}/uploads/${selectedBooking.event?.coverImage}`}
                    alt="Event Cover"
                  />
                  <div>
                    <h4>{selectedBooking.event?.eventName}</h4>
                    <span className="category-badge">
                      {selectedBooking.event?.category?.categoryName}
                    </span>
                  </div>
                </div>

                <div className="bookingModal-grid">
                  <div className="bookingModal-infoBlock">
                    <label>Customer Info</label>
                    <p>
                      <strong>Name:</strong> 
                      {selectedBooking.fullName}
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
                      <strong>Target Date:</strong>{" "}
                      {formatDate(selectedBooking.eventDate)}
                    </p>
                    <p>
                      <strong>Time:</strong> {selectedBooking.startTime} –{" "}
                      {selectedBooking.endTime}
                    </p>
                    <p>
                      <strong>Workflow Status:</strong>{" "}
                      <span className={statusPillClass(selectedBooking.status)}>
                        {statusLabel(selectedBooking.status)}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="bookingModal-grid">
                  <div className="bookingModal-infoBlock">
                    <label>Advance Payment</label>
                    <p>
                      <strong>
                        ₹
                        {selectedBooking.paymentSummary?.advanceAmount?.toLocaleString()}
                      </strong>
                      {" — "}
                      <span
                        className={`payment-inline-status ${selectedBooking.paymentSummary?.advanceStatus?.toLowerCase().replace(" ", "-")}`}
                      >
                        {selectedBooking.paymentSummary?.advanceStatus}
                      </span>
                    </p>
                  </div>
                  <div className="bookingModal-infoBlock">
                    <label>Balance Payment</label>
                    <p>
                      <strong>
                        ₹
                        {selectedBooking.paymentSummary?.balanceAmount?.toLocaleString()}
                      </strong>
                      {" — "}
                      <span
                        className={`payment-inline-status ${selectedBooking.paymentSummary?.finalStatus?.toLowerCase().replace(" ", "-")}`}
                      >
                        {selectedBooking.paymentSummary?.finalStatus}
                      </span>
                    </p>
                  </div>
                </div>

                {selectedBooking.status === "Cancelled" &&
                  selectedBooking.cancellationReason && (
                    <div
                      className="bookingModal-infoBlock"
                      style={{ marginTop: "15px" }}
                    >
                      <label>Cancellation Reason</label>
                      <p className="ledger-notes">
                        {selectedBooking.cancellationReason}
                      </p>
                    </div>
                  )}

                <div className="bookingModal-servicesSection">
                  <label>Package Selected</label>
                  <div className="package-detail-strip">
                    <span>
                      <PackageCheck size={20} />{" "}
                      {selectedBooking.package?.packageName
                        ? `${selectedBooking.package.packageName}`
                        : "Custom Package"}
                    </span>
                    <strong>
                      ₹
                      {selectedBooking.package?.finalPrice?.toLocaleString() ||
                        selectedBooking.totalAmount?.toLocaleString()}
                    </strong>
                  </div>

                  {selectedBooking.extraServices?.length > 0 && (
                    <>
                      <label style={{ marginTop: "15px" }}>
                        Add-on Services Selected
                      </label>
                      <div className="bookingModal-servicesGrid">
                        {selectedBooking.extraServices.map((s, index) => (
                          <div key={index} className="bookingModal-serviceItem">
                            <span>
                              <CircleCheckBig size={16} />
                              &nbsp;&nbsp;{s.service?.serviceName}
                            </span>
                            <strong>+ ₹{s.price?.toLocaleString()}</strong>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <div className="bookingModal-totalPrice">
                  <span>Aggregated Gross Total:</span>
                  <span className="price-tag">
                    ₹{selectedBooking.totalAmount?.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="bookingModal-footer">
                {selectedBooking.status === "ReadyForApproval" && (
                  <>
                    <button
                      className="btn-approve-submit"
                      onClick={() => handleApprove(selectedBooking._id)}
                      disabled={actionLoadingId === selectedBooking._id}
                    >
                      Approve Booking
                    </button>
                    <button
                      className="btn-reject-trigger"
                      onClick={(e) => {
                        setSelectedBooking(null);
                        openReasonModal(selectedBooking, "reject", e);
                      }}
                    >
                      Reject Booking
                    </button>
                  </>
                )}

                {selectedBooking.status === "Confirmed" && (
                  <>
                    <button
                      className="btn-approve-submit"
                      onClick={() => handleComplete(selectedBooking._id)}
                      disabled={actionLoadingId === selectedBooking._id}
                    >
                      Mark Event Completed
                    </button>
                    <button
                      className="btn-reject-trigger"
                      onClick={(e) => {
                        setSelectedBooking(null);
                        openReasonModal(selectedBooking, "cancel", e);
                      }}
                    >
                      Cancel Event
                    </button>
                  </>
                )}

                {selectedBooking.status === "Completed" &&
                  (canClose(selectedBooking) ? (
                    <button
                      className="btn-approve-submit"
                      onClick={() => handleClose(selectedBooking._id)}
                      disabled={actionLoadingId === selectedBooking._id}
                    >
                      Close Booking
                    </button>
                  ) : (
                    <span className="pending-note">
                      Balance payment must be verified before this booking can
                      be closed.
                    </span>
                  ))}

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

        {reasonModal.isOpen && (
          <div className="bookingModal-overlay">
            <div className="bookingModal-card confirmation-mini">
              <div className="bookingModal-body text-center">
                <div className="warning-icon">
                  <ShieldAlert size={56} />
                </div>
                <h3>
                  {reasonModal.type === "reject"
                    ? "Confirm Booking Rejection"
                    : "Confirm Event Cancellation"}
                </h3>
                <p>
                  Are you sure you want to{" "}
                  {reasonModal.type === "reject" ? "reject" : "cancel"} booking{" "}
                  <strong>{reasonModal.bookingId}</strong>?
                </p>

                <div style={{ textAlign: "left", marginTop: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "6px",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                    }}
                  >
                    Reason{" "}
                    {reasonModal.type === "reject"
                      ? "for Rejection"
                      : "for Cancellation"}{" "}
                    *
                  </label>
                  <textarea
                    className="refund-reason-input"
                    rows="3"
                    placeholder={
                      reasonModal.type === "reject"
                        ? "e.g. Requested date conflicts with another confirmed booking"
                        : "e.g. Venue unavailable on the requested date"
                    }
                    value={reasonModal.reason}
                    onChange={(e) => {
                      setReasonModal({
                        ...reasonModal,
                        reason: e.target.value,
                      });
                      if (reasonError) setReasonError("");
                    }}
                  />
                  {reasonError && (
                    <small className="error-text">{reasonError}</small>
                  )}
                </div>

                <div className="confirmation-actions">
                  <button
                    className="btn-danger-execute"
                    onClick={confirmReasonAction}
                    disabled={actionLoadingId === reasonModal.id}
                  >
                    Yes, Proceed
                  </button>
                  <button
                    className="addEvent-cancelBtn"
                    onClick={closeReasonModal}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </AdminLayout>
  );
};

export default ManageBookings;
