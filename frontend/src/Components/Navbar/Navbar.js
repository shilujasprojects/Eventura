import React from "react";
import "../Navbar/Navbar.css";
import Logo from "../Images/logo2.png";
import { NavLink, Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark fixed-top"
      style={{ backgroundColor: "#062036" }}
    >
      {/* Logo */}
      <img src={Logo} alt="Logo" style={{ width: "100px", height: "80px" }} />

      {/* Brand */}
      <h1
        className="navbar-brand"
        style={{
          fontFamily: "Cinzel",
          fontSize: "x-large",
          color: "white",
        }}
      >
        EVENTURA
      </h1>

      {/* Hamburger button */}
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarItems"
        aria-controls="navbarItems"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      {/* Navbar links */}
      <div className="collapse navbar-collapse" id="navbarItems">
        <ul className="navbar-nav ms-auto hover-overlay">
          <li className="nav-item">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "nav-link active-link" : "nav-link"
              }
            >
              Home
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              to="/events"
              className={({ isActive }) =>
                isActive ? "nav-link active-link" : "nav-link"
              }
            >
              Events
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              to="/services"
              className={({ isActive }) =>
                isActive ? "nav-link active-link" : "nav-link"
              }
            >
              Services
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive ? "nav-link active-link" : "nav-link"
              }
            >
              Our Story
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                isActive ? "nav-link active-link" : "nav-link"
              }
            >
              Contact
            </NavLink>
          </li>

          <li className="nav-item">
            <Link to="/BookNow" className="btn btn-warning" id="book-now">
              Book Now
            </Link>
          </li>
           <li className="nav-item">
            <Link to="/loginSign" className="btn btn-warning mx-2" id="book-now">
              Login / SignUp
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
