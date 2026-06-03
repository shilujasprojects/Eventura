import React, { useEffect, useState } from "react";
import './BookSummary.css'
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

function BookSummary() {

  const [data, setData] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDanger, setShowDanger] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("eventBooking"));
    setData(storedData);
  }, []);

  const handleConfirm = () => {
    if (!confirmed) {
      alert("Please confirm the details before proceeding.");
      return;
    }

    setShowDanger(false);
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  const handleCancel = () => {
    setShowSuccess(false);
    setShowDanger(true);

    setTimeout(() => {
      setShowDanger(false);
    }, 3000);
  };

  if (!data) {
    return (

    
      <div className="container summary-container">
        <p className="text-center">No booking details found.</p>
      </div>
    );
  }
  return (
    
      <>
      <Navbar />
        <div className="container summary-container ">

      <h3 className="text-center fw-bold mb-4">
        Review & Confirm Booking
      </h3>

      {showSuccess && (
        <div className="alert alert-success fade show">
          <i className="bi bi-check-circle-fill me-2"></i>
          <strong>Success!</strong> Your event booking has been confirmed.
        </div>
      )}

      {showDanger && (
        <div className="alert alert-danger fade show">
          <strong>Cancelled!</strong> Your event booking has been cancelled.
        </div>
      )}

      <div className="summary-card">

        {/* Event Overview */}
        <div className="section-box">
          <div className="section-title">
            <i className="bi bi-calendar-event"></i> Event Overview
          </div>

          <div className="info-row">
            <span>Event Type</span>
            <strong>{data.eventType}</strong>
          </div>

          <div className="info-row">
            <span>Date</span>
            <strong>{data.date}</strong>
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

        {/* Guests & Services */}
        <div className="section-box">
          <div className="section-title">
            <i className="bi bi-people"></i> Guests & Services
          </div>

          <div className="info-row">
            <span>Guests</span>
            <strong>{data.guestCount}</strong>
          </div>

          <div className="mt-2">
            {data.services?.map((s, index) => (
              <span key={index} className="badge-service">
                {s}
              </span>
            ))}
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
          <label className="form-check-label">
            I confirm that all details are correct.
          </label>
        </div>

        <div className="row g-3">
          <div className="col-md-6">
            <button className="btn btn-confirm w-100" onClick={handleConfirm}>
              Confirm Booking
            </button>
          </div>

          <div className="col-md-6">
            <button
              className="btn btn-secondary btn-cancel w-100"
              onClick={handleCancel}
            >
              Cancel Booking
            </button>
          </div>
        </div>

      </div>
    </div>

    <Footer />
      </>
  )
}

export default BookSummary
