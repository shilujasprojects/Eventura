import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Star, X, Pencil } from "lucide-react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import ClientInquiryForm from "../Inquiries_Form/ClientInquiryForm";
import "./ClientDashboard.css";

const BASE_URL = "http://localhost:5000";

// ---------- VALIDATION ----------
const validateReviewField = (name, value) => {
  if (name === "review") {
    const trimmed = (value || "").trim();
    if (!trimmed) return "Please share a few words about your experience.";
    if (trimmed.length < 20) return "Review must be at least 20 characters.";
    if (trimmed.length > 500) return "Review must be under 500 characters.";
  }
  if (name === "rating") {
    if (!value) return "Please select a star rating.";
  }
  return "";
};

const validateProfileField = (name, value, allValues = {}) => {
  if (name === "fullName") {
    const trimmed = (value || "").trim();
    if (!trimmed) return "Full name is required.";
    if (!/^[a-zA-Z\s]{3,50}$/.test(trimmed)) return "Name should only contain letters (3–50 characters).";
  }
  if (name === "phone" && value) {
    if (!/^[6-9]\d{9}$/.test(value.trim())) return "Enter a valid 10-digit phone number.";
  }
  const isChangingPassword =
    (allValues.currentPassword || allValues.newPassword || allValues.confirmNewPassword || "").trim() !== "";

  if (name === "currentPassword" && isChangingPassword) {
    if (!value) return "Enter your current password.";
  }
  if (name === "newPassword" && isChangingPassword) {
    if (!value) return "Enter a new password.";
    else if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(value))
      return "Password must be 8+ characters with at least one letter and one number.";
  }
  if (name === "confirmNewPassword" && isChangingPassword) {
    if (!value) return "Please confirm your new password.";
    else if (value !== allValues.newPassword) return "Passwords do not match.";
  }
  return "";
};

const getEventTypeLabel = (booking) =>
  booking?.event?.category?.categoryName || booking?.event?.eventName || "Event";

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const [myTestimonials, setMyTestimonials] = useState([]);

  const [reviewingBooking, setReviewingBooking] = useState(null);
  const [newReview, setNewReview] = useState({ review: "", rating: 0 });
  const [reviewErrors, setReviewErrors] = useState({});
  const [submittingReview, setSubmittingReview] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [profileErrors, setProfileErrors] = useState({});
  const [savingProfile, setSavingProfile] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const authHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const storedRole = localStorage.getItem("role");

      if (!storedUser || storedRole !== "client") {
        navigate("/loginSign");
        return;
      }

      try {
        setClient(storedUser);

        const [bookingsRes, inquiriesRes, testimonialsRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/bookings/client/${storedUser._id}`),
          axios.get(`${BASE_URL}/api/inquiries/client/${storedUser._id}`),
          axios.get(`${BASE_URL}/api/testimonials/client/${storedUser._id}`),
        ]);

        setBookings(bookingsRes.data.data);
        setInquiries(inquiriesRes.data.data);
        setMyTestimonials(testimonialsRes.data.data);
      } catch (error) {
        console.log(error);
        toast.error("Could not load your dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event("authChange"));
    navigate("/");
  };

  const handleNewInquiry = (inquiry) => {
    setInquiries((prev) => [inquiry, ...prev]);
  };

  const reviewedBookingIds = new Set(myTestimonials.map((t) => t.booking).filter(Boolean));

  // ── Review modal ──────────────────────────────────────────
  const handleOpenReviewModal = (booking) => {
    setReviewingBooking(booking);
    setNewReview({ review: "", rating: 0 });
    setReviewErrors({});
  };

  const handleCloseReviewModal = () => {
    setReviewingBooking(null);
    setNewReview({ review: "", rating: 0 });
    setReviewErrors({});
  };

  const handleReviewTextChange = (value) => {
    setNewReview((prev) => ({ ...prev, review: value }));
    setReviewErrors((prev) => ({ ...prev, review: validateReviewField("review", value) }));
  };

  const handleRatingChange = (value) => {
    setNewReview((prev) => ({ ...prev, rating: value }));
    setReviewErrors((prev) => ({ ...prev, rating: validateReviewField("rating", value) }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    const errors = {
      review: validateReviewField("review", newReview.review),
      rating: validateReviewField("rating", newReview.rating),
    };
    setReviewErrors(errors);

    if (errors.review || errors.rating) {
      toast.error("Please fix the highlighted fields before submitting.");
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/testimonials`, {
        clientId: client._id,
        bookingId: reviewingBooking._id,
        eventType: getEventTypeLabel(reviewingBooking),
        review: newReview.review,
        rating: newReview.rating,
      });
      setMyTestimonials((prev) => [res.data.data, ...prev]);
      toast.success("Thank you! Your review has been submitted for approval.");
      handleCloseReviewModal();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit your review. Please try again.");
    } finally {
      setSubmittingReview(false);
    }
  };

  // ── Edit profile modal ────────────────────────────────────
  const handleOpenEditProfile = () => {
    setProfileForm({
      fullName: client?.fullName || "",
      phone: client?.phone || "",
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
    setProfileErrors({});
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmNewPassword(false);
    setEditingProfile(true);
  };

  const handleCloseEditProfile = () => {
    setEditingProfile(false);
    setProfileErrors({});
  };

  const handleProfileFieldChange = (name, value) => {
    const updatedForm = { ...profileForm, [name]: value };
    setProfileForm(updatedForm);

    if (["currentPassword", "newPassword", "confirmNewPassword"].includes(name)) {
      setProfileErrors((prev) => ({
        ...prev,
        currentPassword: validateProfileField("currentPassword", updatedForm.currentPassword, updatedForm),
        newPassword: validateProfileField("newPassword", updatedForm.newPassword, updatedForm),
        confirmNewPassword: validateProfileField("confirmNewPassword", updatedForm.confirmNewPassword, updatedForm),
      }));
    } else {
      setProfileErrors((prev) => ({ ...prev, [name]: validateProfileField(name, value, updatedForm) }));
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    const errors = {
      fullName: validateProfileField("fullName", profileForm.fullName, profileForm),
      phone: validateProfileField("phone", profileForm.phone, profileForm),
      currentPassword: validateProfileField("currentPassword", profileForm.currentPassword, profileForm),
      newPassword: validateProfileField("newPassword", profileForm.newPassword, profileForm),
      confirmNewPassword: validateProfileField("confirmNewPassword", profileForm.confirmNewPassword, profileForm),
    };
    setProfileErrors(errors);

    if (Object.values(errors).some(Boolean)) {
      toast.error("Please fix the highlighted fields before saving.");
      return;
    }

    setSavingProfile(true);
    try {
      const payload = {
        fullName: profileForm.fullName.trim(),
        phone: profileForm.phone.trim(),
      };

      if (profileForm.newPassword.trim()) {
        payload.currentPassword = profileForm.currentPassword;
        payload.newPassword = profileForm.newPassword;
      }

      const res = await axios.patch(`${BASE_URL}/api/clients/${client._id}`, payload, authHeader());

      const updatedClient = res.data.data;
      setClient(updatedClient);

      const storedUser = JSON.parse(localStorage.getItem("user"));
      localStorage.setItem("user", JSON.stringify({ ...storedUser, ...updatedClient }));

      toast.success(res.data.message);
      handleCloseEditProfile();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update your profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  if (loading) return <p className="dashboard-loading">Loading your dashboard...</p>;

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Welcome, {client?.fullName}</h1>
          {client?.status === "Suspended" && (
            <div className="suspended-banner">
              Your account is currently suspended. You can still view your existing bookings and inquiries,
              but new event bookings are disabled until an admin reactivates your account.
            </div>
          )}
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>

        <section className="dashboard-section">
          <div className="section-heading-row">
            <h2>My Info</h2>
            <button className="edit-info-btn" onClick={handleOpenEditProfile}>
              <Pencil size={14} /> Edit
            </button>
          </div>
          <div className="info-card">
            <p><strong>Client ID:</strong> {client?.clientId}</p>
            <p><strong>Email:</strong> {client?.email}</p>
            <p><strong>Phone:</strong> {client?.phone || "Not added yet"}</p>
          </div>
        </section>

        <section className="dashboard-section">
          <h2>My Bookings</h2>
          {bookings.length === 0 ? (
            <p>You have no bookings yet.</p>
          ) : (
            <div className="card-list">
              {bookings.map((booking) => {
                const isReviewable = booking.status === "Completed" || booking.status === "Closed";
                const alreadyReviewed = reviewedBookingIds.has(booking._id);
                const eventTypeLabel = getEventTypeLabel(booking);

                const summary = booking.paymentSummary || {
                  advanceAmount: Math.round(booking.totalAmount * 0.5),
                  balanceAmount: booking.totalAmount - Math.round(booking.totalAmount * 0.5),
                  advanceStatus: "Not Paid",
                  finalStatus: "Not Paid",
                };

                const isCancelled = booking.status === "Cancelled";

                const canPayAdvance =
                  !isCancelled &&
                  (summary.advanceStatus === "Not Paid" || summary.advanceStatus === "Failed");

                const canPayFinal =
                  !isCancelled &&
                  summary.advanceStatus === "Paid" &&
                  booking.status === "Completed" &&
                  (summary.finalStatus === "Not Paid" || summary.finalStatus === "Failed");

                return (
                  <div className="dashboard-card" key={booking._id}>
                    <div className="card-top">
                      <span className="booking-id">{booking.bookingId}</span>
                      <span className={`status-badge status-${booking.status.toLowerCase()}`}>
                        {booking.status}
                      </span>
                    </div>
                    <p><strong>Event:</strong> {booking.event?.eventName} ({eventTypeLabel})</p>
                    <p><strong>Event Date:</strong> {new Date(booking.eventDate).toLocaleDateString()}</p>
                    <p><strong>Venue:</strong> {booking.venueName || booking.city}</p>
                    <p><strong>Guests:</strong> {booking.guestCount}</p>
                    <p><strong>Total Amount:</strong> ₹{booking.totalAmount}</p>

                    {isCancelled && booking.cancellationReason && (
                      <div className="cancellation-note">
                        <strong>Booking cancelled:</strong> {booking.cancellationReason}
                      </div>
                    )}

                    <div className="payment-status-row">
                      <div className="payment-status-item">
                        <span>Advance (₹{summary.advanceAmount.toLocaleString()})</span>
                        <span className={`payment-pill payment-${summary.advanceStatus.toLowerCase().replace(" ", "-")}`}>
                          {summary.advanceStatus}
                        </span>
                      </div>
                      <div className="payment-status-item">
                        <span>Balance (₹{summary.balanceAmount.toLocaleString()})</span>
                        <span className={`payment-pill payment-${summary.finalStatus.toLowerCase().replace(" ", "-")}`}>
                          {summary.finalStatus}
                        </span>
                      </div>
                    </div>

                    {canPayAdvance && (
                      <button
                        className="write-review-btn"
                        onClick={() => navigate(`/payment/${booking._id}`)}
                      >
                        {summary.advanceStatus === "Failed" ? "Retry Advance Payment" : "Pay Advance"}
                      </button>
                    )}

                    {canPayFinal && (
                      <button
                        className="write-review-btn"
                        onClick={() => navigate(`/payment/${booking._id}`)}
                      >
                        {summary.finalStatus === "Failed" ? "Retry Balance Payment" : "Pay Remaining Balance"}
                      </button>
                    )}

                    {isReviewable && (
                      alreadyReviewed ? (
                        <span className="reviewed-badge">✓ Reviewed</span>
                      ) : (
                        <button className="write-review-btn" onClick={() => handleOpenReviewModal(booking)}>
                          Write a Review
                        </button>
                      )
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="dashboard-section">
          <h2>Need Help? Raise a New Inquiry</h2>
          <ClientInquiryForm loggedInClient={client} onSuccess={handleNewInquiry} />
        </section>

        <section className="dashboard-section">
          <h2>My Inquiries</h2>
          {inquiries.length === 0 ? (
            <p>You haven't raised any inquiries yet.</p>
          ) : (
            <div className="card-list">
              {inquiries.map((inquiry) => (
                <div className="dashboard-card" key={inquiry._id}>
                  <div className="card-top">
                    <span className="booking-id">{inquiry.ticketId}</span>
                    <span className={`status-badge status-${inquiry.status.toLowerCase().replace(" ", "-")}`}>
                      {inquiry.status}
                    </span>
                  </div>
                  <p><strong>Subject:</strong> {inquiry.subject}</p>
                  <p>{inquiry.message}</p>

                  {inquiry.replies.length > 0 && (
                    <div className="replies">
                      {inquiry.replies.map((reply, i) => (
                        <div key={i} className={`reply ${reply.repliedBy === "Admin" ? "admin-reply" : "client-reply"}`}>
                          <strong>{reply.repliedBy}:</strong> {reply.text}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="dashboard-section">
          <h2>My Testimonials</h2>
          {myTestimonials.length === 0 ? (
            <p>You haven't shared a review yet. Reviews become available once one of your events is marked Completed.</p>
          ) : (
            <div className="card-list">
              {myTestimonials.map((t) => (
                <div className="dashboard-card" key={t._id}>
                  <div className="card-top">
                    <span className="booking-id">{t.eventType}</span>
                    <span className={`status-badge ${t.featured ? "status-confirmed" : "status-pending"}`}>
                      {t.featured ? "Featured on Home" : "Pending Review"}
                    </span>
                  </div>
                  <div className="review-stars">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} size={16} className="star-filled" fill="currentColor" />
                    ))}
                  </div>
                  <p>{t.review}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* REVIEW MODAL */}
      {reviewingBooking && (
        <div className="review-modal-overlay" onClick={handleCloseReviewModal}>
          <div className="review-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="review-modal-close" onClick={handleCloseReviewModal} aria-label="Close">
              <X size={20} />
            </button>

            <div className="review-modal-header">
              <h3>Share Your Experience</h3>
              <p>{reviewingBooking.event?.eventName} — {getEventTypeLabel(reviewingBooking)}</p>
            </div>

            <form onSubmit={handleSubmitReview} className="review-modal-form">
              <div className="form-row">
                <label>Your Rating *</label>
                <div className="star-picker">
                  {[1, 2, 3, 4, 5].map((n) => {
                    const isFilled = n <= (hoveredStar || newReview.rating);
                    return (
                      <Star
                        key={n}
                        size={32}
                        className={isFilled ? "star-filled" : "star-empty"}
                        fill={isFilled ? "currentColor" : "none"}
                        onMouseEnter={() => setHoveredStar(n)}
                        onMouseLeave={() => setHoveredStar(0)}
                        onClick={() => handleRatingChange(n)}
                      />
                    );
                  })}
                </div>
                <div className="rating-label">
                  {newReview.rating > 0
                    ? `${newReview.rating} out of 5 stars selected`
                    : "Tap a star to rate"}
                </div>
                {reviewErrors.rating && <span className="field-error">{reviewErrors.rating}</span>}
              </div>

              <div className="form-row">
                <label>Your Review *</label>
                <textarea
                  rows={5}
                  placeholder={`Tell us how your ${getEventTypeLabel(reviewingBooking).toLowerCase()} went...`}
                  className={reviewErrors.review ? "has-error" : ""}
                  value={newReview.review}
                  onChange={(e) => handleReviewTextChange(e.target.value)}
                />
                <div className="char-count">{newReview.review.length} / 500</div>
                {reviewErrors.review && <span className="field-error">{reviewErrors.review}</span>}
              </div>

              <div className="review-modal-actions">
                <button type="button" className="cancel-review-btn" onClick={handleCloseReviewModal}>
                  Cancel
                </button>
                <button type="submit" className="write-review-btn" disabled={submittingReview}>
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PROFILE MODAL */}
      {editingProfile && (
        <div className="review-modal-overlay" onClick={handleCloseEditProfile}>
          <div className="review-modal-card edit-profile-card" onClick={(e) => e.stopPropagation()}>
            <button className="review-modal-close" onClick={handleCloseEditProfile} aria-label="Close">
              <X size={20} />
            </button>

            <div className="review-modal-header">
              <h3>Edit Your Info</h3>
              <p>Update your name, phone number, or password.</p>
            </div>

            <form onSubmit={handleSaveProfile} className="review-modal-form">
              {/* Row 1 — Full Name + Phone */}
              <div className="field-row-2">
                <div className="form-row">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    className={profileErrors.fullName ? "has-error" : ""}
                    value={profileForm.fullName}
                    onChange={(e) => handleProfileFieldChange("fullName", e.target.value)}
                  />
                  {profileErrors.fullName && <span className="field-error">{profileErrors.fullName}</span>}
                </div>

                <div className="form-row">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    className={profileErrors.phone ? "has-error" : ""}
                    value={profileForm.phone}
                    onChange={(e) => handleProfileFieldChange("phone", e.target.value)}
                  />
                  {profileErrors.phone && <span className="field-error">{profileErrors.phone}</span>}
                </div>
              </div>

              {/* Row 2 — Email + Current Password */}
              <div className="field-row-2">
                <div className="form-row">
                  <label>Email</label>
                  <input type="email" value={client?.email || ""} disabled />
                  <small className="field-hint">Can't be changed here.</small>
                </div>

                <div className="form-row">
                  <label>Current Password</label>
                  <div className="password-field">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="Current Password"
                      className={profileErrors.currentPassword ? "has-error" : ""}
                      value={profileForm.currentPassword}
                      onChange={(e) => handleProfileFieldChange("currentPassword", e.target.value)}
                    />
                    <span onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                      <i className={`bi ${showCurrentPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                    </span>
                  </div>
                  {profileErrors.currentPassword ? (
                    <span className="field-error">{profileErrors.currentPassword}</span>
                  ) : (
                    <small className="field-hint">Leave blank to keep your current password.</small>
                  )}
                </div>
              </div>

              {/* Row 3 — New Password + Confirm New Password */}
              <div className="field-row-2">
                <div className="form-row">
                  <label>New Password</label>
                  <div className="password-field">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="New Password"
                      className={profileErrors.newPassword ? "has-error" : ""}
                      value={profileForm.newPassword}
                      onChange={(e) => handleProfileFieldChange("newPassword", e.target.value)}
                    />
                    <span onClick={() => setShowNewPassword(!showNewPassword)}>
                      <i className={`bi ${showNewPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                    </span>
                  </div>
                  {profileErrors.newPassword && <span className="field-error">{profileErrors.newPassword}</span>}
                </div>

                <div className="form-row">
                  <label>Confirm New Password</label>
                  <div className="password-field">
                    <input
                      type={showConfirmNewPassword ? "text" : "password"}
                      placeholder="Confirm New Password"
                      className={profileErrors.confirmNewPassword ? "has-error" : ""}
                      value={profileForm.confirmNewPassword}
                      onChange={(e) => handleProfileFieldChange("confirmNewPassword", e.target.value)}
                    />
                    <span onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}>
                      <i className={`bi ${showConfirmNewPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                    </span>
                  </div>
                  {profileErrors.confirmNewPassword && <span className="field-error">{profileErrors.confirmNewPassword}</span>}
                </div>
              </div>

              <div className="review-modal-actions">
                <button type="button" className="cancel-review-btn" onClick={handleCloseEditProfile}>
                  Cancel
                </button>
                <button type="submit" className="write-review-btn" disabled={savingProfile}>
                  {savingProfile ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default ClientDashboard;