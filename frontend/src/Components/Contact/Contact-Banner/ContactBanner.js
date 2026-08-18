import React, { useEffect, useState } from 'react'
import './ContactBanner.css'
import candleLight from '../anniversary-couple.jpg'

const API_BASE_URL = "http://localhost:5000/api";

function ContactBanner() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/settings`);
        const data = await res.json();
        if (data.success) {
          setSettings(data.data);
        }
      } catch (err) {
        console.error("Error fetching settings:", err);
      }
    };

    fetchSettings();
  }, []);

  const phone = settings?.business?.contactPhone || "+91 98765 43210";
  const email = settings?.business?.supportEmail || "support@eventura.com";
  const address = settings?.business?.officeAddress || "Kerala, India";

  return (
    //    Contact Section
    <section className="contact-wrapper mt-5">

      {/* LEFT CONTENT */}
      <div classNameName="content">

        {/* HERO */}
        <div className="hero">
          <h1 data-aos="fade-down-right" data-aos-duration="2000">Contact Us</h1>
          <p data-aos="fade-down-right" data-aos-duration="2000">
            We'd love to hear from you! Whether you have a question about our services,
            need help with booking an event, or just want to get in touch,
            we're here to assist you.
          </p>
        </div>

        {/* CONTACT INFO */}
        <div className="contact-info">
          <h2 data-aos="fade-left" data-aos-duration="2500">Contact Information</h2>
          <p data-aos="fade-left" data-aos-duration="2500">
            Eventura is dedicated to turning your special moments into unforgettable
            experiences — reach out to us for seamless event planning and expert coordination.
          </p>

          <div className="info-boxes" data-aos="fade-left" data-aos-duration="2500">
            <div className="info-box">
              <i className="bi bi-telephone"></i>
              <h4>(+91) {phone}</h4>
              <span>Quick Support</span>
            </div>

            <div className="info-box">
              <i className="bi bi-envelope"></i>
              <h4>{email}</h4>
              <span>Email Assistance</span>
            </div>

            <div className="info-box">
              <i className="bi bi-geo-alt"></i>
              <h4>{address}</h4>
              <span>Office Location</span>
            </div>
          </div>

        </div>
      </div>

      {/* RIGHT SIDE IMAGE */}
      <div className="image-section">
        <div
          className="image-wrapper"
          data-aos="fade-up"
          data-aos-easing="linear"
          data-aos-duration="1500"
        >
          <img src={candleLight} alt="" />
        </div>
      </div>

    </section>
  )
}

export default ContactBanner