import React from "react";
import "./QuestionMap.css";

function QuestionMap() {
  return (
    <section className="contact-section">
      <div className="contact-container" data-aos="zoom-in-left" data-aos-duration='1500'>
        {/*  LEFT SIDE - FORM */}

        <div className="form-side">
          <h2>Have Any Question?</h2>
          <p>
            We’d love to hear from you. Fill out the form and our team will get
            back to you shortly.
          </p>

          <div className="form-container">
            <form>
              <div className="form-row">
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    placeholder="Your Name"
                    required
                  />
                  <label htmlFor="name">Name</label>
                </div>
                <div className="form-floating">
                  <input
                    type="email"
                    placeholder="Your Email address"
                    className="form-control"
                    required
                  />
                  <label htmlFor="email"> Email Address</label>
                </div>
              </div>

              <div className="form-row">
                <div className="form-floating">
                  <input
                    type="text"
                    placeholder="Your Phone"
                    className="form-control"
                    required
                  />
                  <label htmlFor="phone">Phone</label>
                </div>
                <div className="form-floating">
                  <select className="form-select" required>
                    <option value="">Select Event</option>
                    <option>Wedding</option>
                    <option>Birthday</option>
                    <option>Anniversary</option>
                    <option>Baby Shower</option>
                    <option>Funeral Services</option>
                    <option>House Warming</option>
                    <option>Corporate Events</option>
                    <option>Engagement</option>
                  </select>
                </div>
              </div>

              <div className="form-floating mb-3">
                <textarea
                  className="form-control"
                  id="message"
                  placeholder="Message"
                  style={{ height: "120px" }}
                  required
                ></textarea>
                <label htmlFor="message">Message</label>
              </div>

              <button type="submit" className="submit-btn">
                SUBMIT NOW
              </button>
            </form>
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
