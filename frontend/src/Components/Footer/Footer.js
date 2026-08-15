import React, { useState, useEffect } from "react";
import "./Footer.css";
import Logo from "../Images/logo2.png";
import { Link } from "react-router-dom";

export default function Footer() {
  // 1. Set up state for our dynamic data
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [settings, setSettings] = useState(null);

  // 2. Fetch data from the backend when the Footer loads
  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        // Adjust the base URL if your backend runs on a different port
        const API_BASE_URL = "http://localhost:5000/api"; 

        // Fetching all required data in parallel for better performance
        const [categoryRes, serviceRes, settingsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/category?status=Active`),
          fetch(`${API_BASE_URL}/services?status=Active`),
          fetch(`${API_BASE_URL}/settings`),
        ]);

        const categoryData = await categoryRes.json();
        const serviceData = await serviceRes.json();
        const settingsData = await settingsRes.json();

        // The Category controller returns an array directly
        if (Array.isArray(categoryData)) {
          // Grabbing just the first 8 categories so the footer doesn't get too long
          setCategories(categoryData.slice(0, 8)); 
        }

        // The Service controller returns { success: true, data: [...] }
        if (serviceData.success) {
          setServices(serviceData.data.slice(0, 7));
        }

        // The Settings controller returns { success: true, data: { business, ... } }
        if (settingsData.success) {
          setSettings(settingsData.data);
        }

      } catch (error) {
        console.error("Error fetching footer data:", error);
      }
    };

    fetchFooterData();
  }, []);

  // 3. Fallback contact info just in case the database is empty or still loading
  const companyName = settings?.business?.companyName || "EVENTURA";
  const address = settings?.business?.officeAddress || "Kerala, India";
  const email = settings?.business?.supportEmail || "support@eventura.com";
  const phone = settings?.business?.contactPhone || "+91 98765 43210";

  // The "About Our Business" text saved in the admin Settings page.
  // Falls back to the old static blurb if it hasn't been set yet.
  const description =
    settings?.business?.description ||
    `${companyName} makes event planning simple, reliable, and stress-free. From joyful celebrations to meaningful ceremonies, we bring all services together in one trusted platform. With verified vendors, transparent pricing, and seamless coordination, ${companyName} helps you plan every detail with confidence, turning your vision into a smooth, memorable experience.`;

  return (
    <footer className="eventura-footer">
      <div className="container">
        <img src={Logo} alt={`${companyName} Logo`} className="img-fluid-footer" />

        <div className="row">
          {/* Brand Info */}
          <div className="col-lg-4 col-md-6">
            <h3 className="footer-logo">{companyName.toUpperCase()}</h3>
            <p className="footer-text">
              {description}
            </p>
          </div>

          {/* Quick Links (Keeping these static as they are standard app routes) */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h5 className="footer-title">Quick Links</h5>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/events">Events</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/about">Our Story</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>

          {/* Dynamic Events (Fetched from Category Collection) */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h5 className="footer-title">Our Categories</h5>
            <ul className="footer-links">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <li key={cat._id}>
                    {/* Assuming you will route to a dynamic page using the ID */}
                    <Link to={`/explore/${cat._id}`}>{cat.categoryName}</Link>
                  </li>
                ))
              ) : (
                <li>Loading...</li>
              )}
            </ul>
          </div>

          {/* Dynamic Services (Fetched from Service Collection) */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h5 className="footer-title">Our Services</h5>
            <ul className="footer-links">
              {services.length > 0 ? (
                services.map((srv) => (
                  <li key={srv._id}>
                    <Link to={`/service/${srv._id}`}>{srv.serviceName}</Link>
                  </li>
                ))
              ) : (
                <li>Loading...</li>
              )}
              {/* Always keep a "More" button to direct them to the main services page */}
              <li><Link to="/services">More...</Link></li>
            </ul>
          </div>

          {/* Dynamic Contact Info (Fetched from Settings Collection) */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h5 className="footer-title">Contact Us</h5>
            <p className="footer-text">
              <i className="bi bi-geo-alt-fill"></i> {address} <br />
              <i className="bi bi-envelope"></i> {email} <br />
              <i className="bi bi-telephone"></i> {phone}
            </p>

            {/* Social Icons */}
            <div className="footer-social">
              <Link to="#"><i className="bi bi-facebook"></i></Link>
              <Link to="#"><i className="bi bi-instagram"></i></Link>
              <Link to="#"><i className="bi bi-twitter-x"></i></Link>
              <Link to="#"><i className="bi bi-linkedin"></i></Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar with dynamic year */}
      <div className="footer-bottom text-center">
        <p>© {new Date().getFullYear()} {companyName}. All Rights Reserved.</p>
      </div>
    </footer>
  );
}