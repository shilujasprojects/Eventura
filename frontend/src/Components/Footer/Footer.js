import React, { useState, useEffect } from "react";
import "./Footer.css";
import Logo from "../Images/logo2.png";
import { Link } from "react-router-dom";

const CATEGORY_LIMIT = 6;
const SERVICE_LIMIT = 5;

export default function Footer() {
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [settings, setSettings] = useState(null);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllServices, setShowAllServices] = useState(false);

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const API_BASE_URL = "http://localhost:5000/api";

        const [categoryRes, serviceRes, settingsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/category?status=Active`),
          fetch(`${API_BASE_URL}/services?status=Active`),
          fetch(`${API_BASE_URL}/settings`),
        ]);

        const categoryData = await categoryRes.json();
        const serviceData = await serviceRes.json();
        const settingsData = await settingsRes.json();

        if (Array.isArray(categoryData)) {
          const sorted = [...categoryData].sort((a, b) =>
            a.categoryName.localeCompare(b.categoryName),
          );
          setCategories(sorted);
        }

        if (serviceData.success) {
          const service_sorted = [...serviceData.data].sort((a, b) =>
            a.serviceName.localeCompare(b.serviceName),
          );
          setServices(service_sorted);
        }

        if (settingsData.success) {
          setSettings(settingsData.data);
        }
      } catch (error) {
        console.error("Error fetching footer data:", error);
      }
    };

    fetchFooterData();
  }, []);

  const companyName = settings?.business?.companyName || "EVENTURA";
  const address = settings?.business?.officeAddress || "Kerala, India";
  const email = settings?.business?.supportEmail || "support@eventura.com";
  const phone = settings?.business?.contactPhone || "+91 98765 43210";

  const description =
    settings?.business?.description ||
    `${companyName} makes event planning simple, reliable, and stress-free. From joyful celebrations to meaningful ceremonies, we bring all services together in one trusted platform. With verified vendors, transparent pricing, and seamless coordination, ${companyName} helps you plan every detail with confidence, turning your vision into a smooth, memorable experience.`;

  const visibleCategories = showAllCategories
    ? categories
    : categories.slice(0, CATEGORY_LIMIT);
  const hasMoreCategories = categories.length > CATEGORY_LIMIT;

  const visibleServices = showAllServices
    ? services
    : services.slice(0, SERVICE_LIMIT);
  const hasMoreServices = services.length > SERVICE_LIMIT;

  return (
    <footer className="eventura-footer">
      <div className="container">
        <img
          src={Logo}
          alt={`${companyName} Logo`}
          className="img-fluid-footer"
        />

        <div className="row">
          {/* Brand Info */}
          <div className="col-lg-4 col-md-6">
            <h3 className="footer-logo">{companyName.toUpperCase()}</h3>
            <p className="footer-text">{description}</p>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h5 className="footer-title">Quick Links</h5>
            <ul className="footer-links">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/events">Events</Link>
              </li>
              <li>
                <Link to="/services">Services</Link>
              </li>
              <li>
                <Link to="/about">Our Story</Link>
              </li>
              <li>
                <Link to="/contact">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Dynamic Categories */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h5 className="footer-title">Our Categories</h5>
            <ul className="footer-links">
              {visibleCategories.length > 0 ? (
                visibleCategories.map((cat) => (
                  <li key={cat._id}>
                    <Link to={`/explore/${cat._id}`}>{cat.categoryName}</Link>
                  </li>
                ))
              ) : (
                <li>Loading...</li>
              )}
              {hasMoreCategories && (
                <li
                  className="footer-toggle"
                  onClick={() => setShowAllCategories((prev) => !prev)}
                >
                  {showAllCategories ? "Show less" : "More"}
                </li>
              )}
            </ul>
          </div>

          {/* Dynamic Services */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h5 className="footer-title">Our Services</h5>
            <ul className="footer-links">
              {visibleServices.length > 0 ? (
                visibleServices.map((srv) => (
                  <li key={srv._id}>
                    <Link to={`/service/${srv._id}`}>{srv.serviceName}</Link>
                  </li>
                ))
              ) : (
                <li>Loading...</li>
              )}
              {hasMoreServices && (
                <li
                  className="footer-toggle"
                  onClick={() => setShowAllServices((prev) => !prev)}
                >
                  {showAllServices ? "Show less" : "More"}
                </li>
              )}
            </ul>
          </div>

          {/* Dynamic Contact Info */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h5 className="footer-title">Contact Us</h5>
            <p className="footer-text">
              <i className="bi bi-geo-alt-fill"></i> {address} <br />
              <i className="bi bi-envelope"></i> {email} <br />
              <i className="bi bi-telephone"></i> {phone}
            </p>

            <div className="footer-social">
              <Link to="#">
                <i className="bi bi-facebook"></i>
              </Link>
              <Link to="#">
                <i className="bi bi-instagram"></i>
              </Link>
              <Link to="#">
                <i className="bi bi-twitter-x"></i>
              </Link>
              <Link to="#">
                <i className="bi bi-linkedin"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom text-center">
        <p>
          © {new Date().getFullYear()} {companyName}. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
