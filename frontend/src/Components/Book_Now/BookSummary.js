import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./BookSummary.css";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

function BookSummary() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("eventBooking"));
    setData(storedData);
  }, []);

  const handleConfirm = async () => {
    if (!confirmed) {
      toast.error("Please confirm that all details are correct.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await axios.post("http://localhost:5000/api/bookings", {
        event: data.event,
        package: data.package,
        isCustomPackage: data.isCustomPackage,
        extraServices: data.extraServices,
        eventDate: data.eventDate,
        startTime: data.startTime,
        endTime: data.endTime,
        city: data.city,
        venueName: data.venueName,
        guestCount: data.guestCount,
        budgetRange: data.budgetRange,
        specialRequirements: data.specialRequirements,
        fullName: data.fullName,
        phone: data.phone,
        email: data.email,
        whatsappUpdates: data.whatsappUpdates,
      });

      toast.success("Booking submitted! Redirecting you to make the advance payment...");
      localStorage.removeItem("eventBooking");
      const newBookingId = res.data.data._id;

      setTimeout(() => navigate(`/payment/${newBookingId}`), 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit booking. Please try again.");
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    localStorage.removeItem("eventBooking");
    toast.info("Booking discarded.");
    navigate("/booknow");
  };

  if (!data) {
    return (
      <>
        <Navbar />
        <div className="container summary-container">
          <p className="text-center">No booking details found.</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container summary-container">
        <h3 className="text-center fw-bold mb-4">Review & Confirm Booking</h3>

        <div className="summary-card">
          {/* Event Overview */}
          <div className="section-box">
            <div className="section-title">
              <i className="bi bi-calendar-event"></i> Event Overview
            </div>
            <div className="info-row">
              <span>Event</span>
              <strong>{data.eventName}</strong>
            </div>
            <div className="info-row">
              <span>Category</span>
              <strong>{data.categoryName}</strong>
            </div>
            <div className="info-row">
              <span>Date</span>
              <strong>{data.eventDate}</strong>
            </div>
            <div className="info-row">
              <span>Time</span>
              <strong>{data.startTime} – {data.endTime}</strong>
            </div>
            <div className="info-row">
              <span>City</span>
              <strong>{data.city}</strong>
            </div>
          </div>

          {/* Package & Services */}
          <div className="section-box">
            <div className="section-title">
              <i className="bi bi-box-seam"></i> Package & Services
            </div>
            <div className="info-row">
              <span>Package</span>
              <strong>
                {data.packageName}
                {!data.isCustomPackage && ` — ₹${data.packagePrice?.toLocaleString()}`}
              </strong>
            </div>
            {data.isCustomPackage && data.budgetRange && (
              <div className="info-row">
                <span>Estimated Budget</span>
                <strong>{data.budgetRange}</strong>
              </div>
            )}
            <div className="mt-2">
              {data.extraServices?.length === 0 ? (
                <p className="text-muted mb-0">No services selected</p>
              ) : (
                data.extraServices.map((s) => (
                  <span key={s.service} className="badge-service">
                    {s.serviceName} (+₹{s.price})
                  </span>
                ))
              )}
            </div>
            <div className="info-row mt-2">
              <span>Total Amount</span>
              <strong>₹{data.totalAmount?.toLocaleString()}</strong>
            </div>
          </div>

          {/* Guests */}
          <div className="section-box">
            <div className="section-title">
              <i className="bi bi-people"></i> Guests
            </div>
            <div className="info-row">
              <span>Guest Count</span>
              <strong>{data.guestCount}</strong>
            </div>
          </div>

          {/* Contact */}
          <div className="section-box">
            <div className="section-title">
              <i className="bi bi-person-circle"></i> Contact Details
            </div>
            <div className="info-row">
              <span>Name</span>
              <strong>{data.fullName}</strong>
            </div>
            <div className="info-row">
              <span>Phone</span>
              <strong>{data.phone}</strong>
            </div>
            <div className="info-row">
              <span>Email</span>
              <strong>{data.email}</strong>
            </div>
          </div>

          {/* Confirm Checkbox */}
          <div className="form-check mb-4">
            <input
              className="input-check me-2"
              type="checkbox"
              checked={confirmed}
              onChange={() => setConfirmed(!confirmed)}
            />
            <label className="form-check-label">I confirm that all details are correct.</label>
          </div>

          <div className="row g-3">
            <div className="col-md-6">
              <button className="btn btn-confirm w-100" onClick={handleConfirm} disabled={submitting}>
                {submitting ? "Submitting..." : "Confirm Booking"}
              </button>
            </div>
            <div className="col-md-6">
              <button
                className="btn btn-secondary btn-cancel w-100"
                onClick={handleCancel}
                disabled={submitting}
              >
                Cancel Booking
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default BookSummary;