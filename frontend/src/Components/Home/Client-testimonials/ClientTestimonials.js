import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import "./ClientTestimonials.css";

const BASE_URL = "http://localhost:5000";
const AUTO_ADVANCE_MS = 4000;

// Clients don't upload a profile photo, so we show a navy circle with their
// initials instead — keeps the card layout identical to the old static version.
function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(" ").filter(Boolean);
  return parts.length > 1
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    : parts[0][0].toUpperCase();
}

function ClientTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/testimonials/featured`);
        setTestimonials(res.data.data);
      } catch (error) {
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const goTo = useCallback(
    (index) => {
      if (testimonials.length === 0) return;
      const next = (index + testimonials.length) % testimonials.length;
      setActive(next);
    },
    [testimonials.length]
  );

  const goNext = useCallback(() => goTo(active + 1), [active, goTo]);
  const goPrev = useCallback(() => goTo(active - 1), [active, goTo]);

  // Auto-advance, restarts whenever `active` changes (manual click resets the clock)
  useEffect(() => {
    if (testimonials.length <= 1) return;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(goNext, AUTO_ADVANCE_MS);
    return () => clearTimeout(timerRef.current);
  }, [active, testimonials.length, goNext]);

  // Nothing to show yet (still loading, backend down, or admin hasn't
  // featured any reviews) — skip rendering rather than showing an empty shell.
  if (loading || testimonials.length === 0) return null;

  return (
    <section className="client py-5">
      <div className="container text-center">
        <h2>what our clients say</h2>
        <p style={{ color: "white", marginBottom: "40px" }}>
          Real experiences from people who trusted Eventura for their special
          moments.
        </p>

        <div className="client-carousel">
          <button
            type="button"
            className="client-carousel-control prev"
            onClick={goPrev}
            aria-label="Previous testimonial"
          >
            <i className="bi bi-chevron-left"></i>
          </button>

          <div className="client-carousel-track-wrapper">
            <div
              className="client-carousel-track"
              style={{ transform: `translateX(-${active * 100}%)` }}
            >
              {testimonials.map((testi) => (
                <div className="client-carousel-slide" key={testi._id}>
                  <div className="d-flex justify-content-center mt-0 mt-lg-5">
                    <div className="col-lg-4 col-md-6 col-sm-10 col-11 mx-auto">
                      <div className="card text-center p-3 client-card pb-4">
                        <div className="stars">
                          {Array.from({ length: testi.rating }).map((_, s) => (
                            <i key={s} className="bi bi-star-fill"></i>
                          ))}
                        </div>

                        <p className="card-para">
                          <b>“</b>
                          {testi.review}
                          <b>”</b>
                        </p>

                        <div className="profile-initials">
                          {getInitials(testi.clientName)}
                        </div>
                        <h4 className="card-title">{testi.clientName}</h4>
                        <p className="card-text">{testi.eventType}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="client-carousel-control next"
            onClick={goNext}
            aria-label="Next testimonial"
          >
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>

        <div className="client-carousel-indicators">
          {testimonials.map((_, i) => (
            <button
              key={i}
              type="button"
              className={i === active ? "active" : ""}
              onClick={() => goTo(i)}
              aria-label={`Go to testimonial ${i + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ClientTestimonials;