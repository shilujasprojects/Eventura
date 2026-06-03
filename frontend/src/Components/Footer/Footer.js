import React from "react";
import "./Footer.css";
import Logo from "../Images/logo2.png";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="eventura-footer">
      <div className="container">
        <img src={Logo} alt="Eventura Logo" className="img-fluid-footer" />

        <div className="row">
          {/* Brand Info */}
          <div className="col-lg-4 col-md-6">
            <h3 className="footer-logo">EVENTURA</h3>
            <p className="footer-text">
              Eventura makes event planning simple, reliable, and stress-free.
              From joyful celebrations to meaningful ceremonies, we bring all
              services together in one trusted platform. With verified vendors,
              transparent pricing, and seamless coordination, Eventura helps you
              plan every detail with confidence, turning your vision into a
              smooth, memorable experience.
            </p>
          </div>

          {/* Quick Links */}
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

          {/* Events */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h5 className="footer-title">Our Events</h5>
            <ul className="footer-links">
              <li><Link to="/wedding-explore">Wedding</Link></li>
              <li><Link to="/birthday-explore">Birthday</Link></li>
              <li><Link to="/babyshower-explore">Baby Shower</Link></li>
              <li><Link to="/corporate-explore">Corporate Events</Link></li>
              <li><Link to="/anniversary-explore">Anniversary</Link></li>
              <li><Link to="/engagement-explore">Engagement</Link></li>
              <li><Link to="/housewarming-explore">House Warming</Link></li>
              <li><Link to="/funeral-explore">Funeral Service</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h5 className="footer-title">Our Services</h5>
            <ul className="footer-links">
              <li><Link to="#">Catering</Link></li>
              <li><Link to="#">Makeup & Styling</Link></li>
              <li><Link to="#">Rental Outfits</Link></li>
              <li><Link to="#">Event Decoration & Styling</Link></li>
              <li><Link to="#">Photography & Videography</Link></li>
              <li><Link to="#">Music & Entertainment</Link></li>
              <li><Link to="#">Furniture & Equipment</Link></li>
              <li><Link to="#">More</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h5 className="footer-title">Contact Us</h5>
            <p className="footer-text">
              <i className="bi bi-geo-alt-fill"></i> Kerala, India <br />
              <i className="bi bi-envelope"></i> support@eventura.com <br />
              <i className="bi bi-telephone"></i>  +91 98765 43210
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

      {/* Bottom bar */}
      <div className="footer-bottom text-center">
        <p>© 2025 Eventura. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
