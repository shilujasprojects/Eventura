import React, { useEffect, useRef, useState } from "react";
import "../Navbar/Navbar.css";
import Logo from "../Images/logo2.png";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const loadUserFromStorage = () => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  };

  useEffect(() => {
    loadUserFromStorage();

    // Fires when localStorage changes in another tab
    window.addEventListener("storage", loadUserFromStorage);
    // Fires when we log in/out in THIS tab (dispatched manually — see Auth.jsx)
    window.addEventListener("authChange", loadUserFromStorage);

    return () => {
      window.removeEventListener("storage", loadUserFromStorage);
      window.removeEventListener("authChange", loadUserFromStorage);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("authChange"));
    toast.success("Logged out successfully");
    setMenuOpen(false);
    navigate("/");
  };

  const displayName = user
    ? (user.fullName || user.name || user.email).split(/[\s@]/)[0]
    : "";

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark fixed-top"
      style={{ backgroundColor: "#062036" }}
    >
      <img src={Logo} alt="Logo" style={{ width: "100px", height: "80px" }} />

      <h1
        className="navbar-brand"
        style={{ fontFamily: "Cinzel", fontSize: "x-large", color: "white" }}
      >
        EVENTURA
      </h1>

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

          {/* ROLE-BASED AUTH AREA */}
          {!user ? (
            <li className="nav-item">
              <Link
                to="/loginSign"
                className="btn btn-warning mx-2"
                id="book-now"
              >
                Login / SignUp
              </Link>
            </li>
          ) : (
            <li className="nav-item user-menu" ref={menuRef}>
              

              <button
                className="btn btn-warning mx-2 user-menu-trigger"
                id="book-now"
                onClick={() => setMenuOpen((prev) => !prev)}
              >
                <span className="user-avatar">
                  {displayName.charAt(0).toUpperCase()}
                </span>
                {/* {displayName} */}
                {displayName.charAt(0).toUpperCase() + displayName.slice(1).toLowerCase()}
                <i
                  className={`bi bi-caret-down-fill user-menu-caret ${menuOpen ? "rotated" : ""}`}
                ></i>
              </button>

              {menuOpen && (
                <ul className="user-dropdown">
                  <li>
                    <Link
                      to="/clientDashboard"
                      onClick={() => setMenuOpen(false)}
                    >
                      Client Dashboard
                    </Link>
                  </li>
                  <li onClick={handleLogout} className="logout-option">
                    Logout
                  </li>
                </ul>
              )}
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
