import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Auth.css";
import Navbar from "../Navbar/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../Images/logo2.png";
import Footer from "../Footer/Footer";

const BASE_URL = "http://localhost:5000";

// ---------- VALIDATION ----------
const validateSignupField = (name, value, allValues = {}) => {
  if (name === "name") {
    const trimmed = (value || "").trim();
    if (!trimmed) return "Full name is required.";
    if (!/^[A-Za-z\s]{2,50}$/.test(trimmed)) return "Enter a valid name (letters only).";
  }
  if (name === "email") {
    if (!value) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email address.";
  }
  if (name === "phone") {
    if (!value) return "Phone number is required.";
    if (!/^[6-9]\d{9}$/.test(value)) return "Enter a valid 10-digit phone number.";
  }
  if (name === "password") {
    if (!value) return "Password is required.";
    if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(value))
      return "Password must be 8+ characters with at least one letter and one number.";
  }
  if (name === "confirmPassword") {
    if (!value) return "Please confirm your password.";
    if (value !== allValues.password) return "Passwords do not match.";
  }
  return "";
};

const validateLoginField = (name, value) => {
  if (name === "email") {
    if (!value) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email address.";
  }
  if (name === "password") {
    if (!value) return "Password is required.";
  }
  return "";
};

const Auth = () => {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loginErrors, setLoginErrors] = useState({});
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [signupData, setSignupData] = useState({
    name: "", email: "", phone: "", password: "", confirmPassword: ""
  });
  const [signupErrors, setSignupErrors] = useState({});
  const [isSigningUp, setIsSigningUp] = useState(false);

  // If BookNow sent the user here mid-booking, it leaves this flag behind.
  // Both login and signup check it so the user lands back on their booking
  // instead of the usual dashboard.
  const goToPendingBookingOrDashboard = (role) => {
    const redirectTo = sessionStorage.getItem("postLoginRedirect");
    if (redirectTo) {
      sessionStorage.removeItem("postLoginRedirect");
      navigate(redirectTo);
      return;
    }
    if (role === "admin") {
      navigate("/adminDashboard");
    } else {
      navigate("/clientDashboard");
    }
  };

  // ---------- LOGIN ----------
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
    setLoginErrors((prev) => ({ ...prev, [name]: validateLoginField(name, value) }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const errors = {
      email: validateLoginField("email", loginData.email),
      password: validateLoginField("password", loginData.password),
    };
    setLoginErrors(errors);
    if (errors.email || errors.password) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    setIsLoggingIn(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/auth/login`, loginData);
      if (res.data.success) {
        toast.success("Login successful!");
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("role", res.data.role);
        localStorage.setItem("token", res.data.token);
        window.dispatchEvent(new Event("authChange"));

        goToPendingBookingOrDashboard(res.data.role);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // ---------- SIGNUP ----------
  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...signupData, [name]: value };
    setSignupData(updatedData);
    setSignupErrors((prev) => ({
      ...prev,
      [name]: validateSignupField(name, value, updatedData),
      // Re-check confirmPassword whenever password itself changes
      ...(name === "password"
        ? { confirmPassword: validateSignupField("confirmPassword", updatedData.confirmPassword, updatedData) }
        : {}),
    }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    const errors = {
      name: validateSignupField("name", signupData.name, signupData),
      email: validateSignupField("email", signupData.email, signupData),
      phone: validateSignupField("phone", signupData.phone, signupData),
      password: validateSignupField("password", signupData.password, signupData),
      confirmPassword: validateSignupField("confirmPassword", signupData.confirmPassword, signupData),
    };
    setSignupErrors(errors);

    if (Object.values(errors).some(Boolean)) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    setIsSigningUp(true);
    try {
      // Only send what the backend needs — confirmPassword is a frontend-only check
      const { name, email, phone, password } = signupData;
      const res = await axios.post(`${BASE_URL}/api/auth/register`, { name, email, phone, password });

      if (res.data.success) {
        toast.success("Signup successful! Redirecting...");
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("role", res.data.role);
        localStorage.setItem("token", res.data.token);
        window.dispatchEvent(new Event("authChange"));

        goToPendingBookingOrDashboard("client");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setIsSigningUp(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="auth-container">
        <div className={`auth-box ${isSignup ? "active" : ""}`}>

          <div className="auth-left">
            <img src={logo} alt="Logo" style={{ width: "170px" }} />
            <h1>Eventura</h1>
            <p>Discover and book unforgettable events with elegance ✨</p>
            <button onClick={() => setIsSignup(!isSignup)}>
              {isSignup ? "Login" : "Sign Up"}
            </button>
          </div>

          <div className="auth-right">

            {/* LOGIN FORM */}
            <form className={`form login ${isSignup ? "hide" : ""}`} onSubmit={handleLogin} noValidate>
              <h2>Login</h2>
              <input
                type="email"
                name="email"
                placeholder="Email"
                className={loginErrors.email ? "has-error" : ""}
                value={loginData.email}
                onChange={handleLoginChange}
              />
              {loginErrors.email && <span className="field-error">{loginErrors.email}</span>}

              <div className="password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  className={loginErrors.password ? "has-error" : ""}
                  value={loginData.password}
                  onChange={handleLoginChange}
                />
                <span onClick={() => setShowPassword(!showPassword)}>
                  <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                </span>
              </div>
              {loginErrors.password && <span className="field-error">{loginErrors.password}</span>}

              <button type="submit" className="primary-btn" disabled={isLoggingIn}>
                {isLoggingIn ? "Logging in..." : "Login"}
              </button>
              <p>Don't have an account? <span onClick={() => setIsSignup(true)}>Sign up</span></p>
            </form>

            {/* SIGNUP FORM */}
            <form className={`form signup ${isSignup ? "show" : ""}`} onSubmit={handleSignUp} noValidate>
              <h2>Sign Up</h2>

              <input
                type="text"
                name="name"
                placeholder="Full Name"
                className={signupErrors.name ? "has-error" : ""}
                value={signupData.name}
                onChange={handleSignupChange}
              />
              {signupErrors.name && <span className="field-error">{signupErrors.name}</span>}

              <input
                type="email"
                name="email"
                placeholder="Email"
                className={signupErrors.email ? "has-error" : ""}
                value={signupData.email}
                onChange={handleSignupChange}
              />
              {signupErrors.email && <span className="field-error">{signupErrors.email}</span>}

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                className={signupErrors.phone ? "has-error" : ""}
                value={signupData.phone}
                onChange={handleSignupChange}
              />
              {signupErrors.phone && <span className="field-error">{signupErrors.phone}</span>}

              <div className="password-field">
                <input
                  type={showSignupPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  className={signupErrors.password ? "has-error" : ""}
                  value={signupData.password}
                  onChange={handleSignupChange}
                />
                <span onClick={() => setShowSignupPassword(!showSignupPassword)}>
                  <i className={`bi ${showSignupPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                </span>
              </div>
              {signupErrors.password && <span className="field-error">{signupErrors.password}</span>}

              <div className="password-field">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className={signupErrors.confirmPassword ? "has-error" : ""}
                  value={signupData.confirmPassword}
                  onChange={handleSignupChange}
                />
                <span onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <i className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                </span>
              </div>
              {signupErrors.confirmPassword && <span className="field-error">{signupErrors.confirmPassword}</span>}

              <button type="submit" className="primary-btn" disabled={isSigningUp}>
                {isSigningUp ? "Creating account..." : "Sign Up"}
              </button>
              <p>Already have an account? <span onClick={() => setIsSignup(false)}>Login</span></p>
            </form>

          </div>
        </div>
      </div>
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default Auth;