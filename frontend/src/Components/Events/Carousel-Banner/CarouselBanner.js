import React, { useEffect, useRef, useState } from "react";
import "./CarouselBanner.css";

const API_BASE_URL = "http://localhost:5000/api";
const UPLOADS_BASE_URL = "http://localhost:5000/uploads";

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function CarouselBanner() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/bookings/upcoming/list`);
        const data = await res.json();
        if (data.success) {
          // Only keep bookings whose event still resolves — a booking
          // could technically outlive its event/category being deleted.
          setBookings(data.data.filter((b) => b.event && b.event.coverImage));
        }
      } catch (err) {
        console.error("Error fetching upcoming bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcoming();
  }, []);

  // Bootstrap's data-bs-ride auto-init only scans the DOM at page load —
  // since these slides render after an async fetch, we init manually.
  useEffect(() => {
    if (bookings.length === 0 || !carouselRef.current) return;
    if (!window.bootstrap) return;

    const instance = new window.bootstrap.Carousel(carouselRef.current, {
      ride: "carousel",
    });

    return () => instance.dispose();
  }, [bookings]);

  if (loading || bookings.length === 0) return null;

  return (
    <div
      id="event-carousel"
      className="carousel slide"
      ref={carouselRef}
    >
      {/* Carousel indicators */}
      <div className="carousel-indicators">
        {bookings.map((booking, index) => (
          <button
            key={booking._id}
            type="button"
            data-bs-target="#event-carousel"
            data-bs-slide-to={index}
            className={index === 0 ? "active" : ""}
          ></button>
        ))}
      </div>

      {/* Slides */}
      <div className="carousel-inner">
        {bookings.map((booking, index) => (
          <div
            className={`carousel-item ${index === 0 ? "active" : ""}`}
            key={booking._id}
          >
            <img
              src={`${UPLOADS_BASE_URL}/${booking.event.coverImage}`}
              alt={booking.event.eventName}
              className="img-fluid"
            />

            <div className="carousel-content">
              <div className="carousel-text">
                <h2>{booking.event.eventName}</h2>
                <p>
                  <i className="bi bi-bag-check me-2"></i>
                  {formatDate(booking.eventDate)} · {booking.startTime} onwards
                </p>
                <p>
                  <i className="bi bi-geo-alt me-2"></i>
                  {booking.venueName ? `${booking.venueName}, ` : ""}
                  {booking.city}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#event-carousel"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon"></span>
      </button>

      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#event-carousel"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon"></span>
      </button>
    </div>
  );
}

export default CarouselBanner;