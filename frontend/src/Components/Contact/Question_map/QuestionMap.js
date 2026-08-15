import React from "react";
import { useNavigate } from "react-router-dom";
import "./QuestionMap.css";

function QuestionMap() {
  const navigate = useNavigate();

  // Check whether client is logged in
  const isLoggedIn = !!localStorage.getItem("token");

  const handleInquiryClick = () => {
    if (isLoggedIn) {
      // CHANGE THIS if your actual dashboard inquiry route is different
      navigate("/clientDashboard");
    } else {
      // Change this to your actual login route
      navigate("/loginSign");
    }
  };

  return (
    <section className="contact-section">
      <div
        className="contact-container"
        data-aos="zoom-in-left"
        data-aos-duration="1500"
      >
        {/* LEFT SIDE - QUESTION / CTA */}

        <div className="question-side">
          <h2>Have Any Question?</h2>

          <p>
            Have questions about your event or need help planning your special
            day? Our Eventura team is here to help you.
          </p>

          <div className="inquiry-card">
            <div className="inquiry-icon">
              <i className="bi bi-chat-dots"></i>
            </div>

            <h3>Need Assistance?</h3>

            <p>
              Sign in to your Eventura account and send us an inquiry. Our team
              will get back to you shortly.
            </p>

            <button
              type="button"
              className="inquiry-btn"
              onClick={handleInquiryClick}
            >
              <i className="bi bi-send me-2"></i>

              {isLoggedIn
                ? "SEND AN INQUIRY"
                : "LOGIN TO SEND INQUIRY"}
            </button>
          </div>
        </div>

        {/* RIGHT SIDE - MAP */}

        <div className="map-side">
          <h2>Our Location</h2>

          <p className="map-para">
            Visit Eventura at our Kozhikode office to discuss your dream event
            in person and let us help you plan every detail with care and
            excitement.
          </p>

          <iframe
            title="Eventura Kozhikode Office Location Map"
            className="map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d119022.83749813585!2d75.72841332197618!3d11.255555506749628!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba65938563d4747%3A0x32150641ca32ecab!2sKozhikode%2C%20Kerala!5e1!3m2!1sen!2sin!4v1762326144592!5m2!1sen!2sin"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>

          <h4>Social Media</h4>

          <div className="social mt-2">
            <div>
              <i className="bi bi-facebook"></i>
            </div>

            <div>
              <i className="bi bi-twitter"></i>
            </div>

            <div>
              <i className="bi bi-youtube"></i>
            </div>

            <div>
              <i className="bi bi-instagram"></i>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default QuestionMap;