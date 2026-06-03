import React, { useState } from "react";
import "./Auth.css";
import Navbar from "../Navbar/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { auth } from "../Firebase/firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import logo from "../Images/logo2.png";
import googleIcon from "../Images/google-icon.png"
import Footer from "../Footer/Footer";

const Auth = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});

  // handle entered form data
  const handleChange = (e) => {
    setSignupData({
      ...signupData,
      [e.target.name]: e.target.value,
    });
  };

  // Validate SignUp form
  const validateSignUp = () => {
    let newErrors = {};

    // NAME VALIDATION
    if (!signupData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    // EMAIL VALIDATION
    let mailformat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!signupData.email) {
      newErrors.email = "Email is required";
    }
    else if(!signupData.email.match(mailformat)){
      newErrors.email = "Email format is incorrect"
    }

    // PASSWORD VALIDATION
    if (!signupData.password) {
      newErrors.password = "Password is required";
    }

    // CONFIRM PASSWORD
    if (signupData.password !== signupData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // PHONE VALIDATION
    if (!signupData.phone) {
      newErrors.phone = "Phone number is required";
    }
    else if (signupData.phone.length !== 10) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };
  // signup form submitted
  const handleSignUp = (e) => {
    e.preventDefault(); //Prevent Page Refresh

    if (validateSignUp()) {
      toast.success("Signup successful")
    }
  };

  // Google login 
  const googleLogin = async () => {
  try {
    const provider = new GoogleAuthProvider();

    const result = await signInWithPopup(auth, provider);

    console.log(result.user);

    toast.success("Login successful")
  } catch (error) {
    console.log(error);
  }
};

  return (
    <>
      <Navbar />
     

      <div className="auth-container">
        <div className={`auth-box ${isSignup ? "active" : ""}`}>
          {/* LEFT PANEL */}
          <div className="auth-left ">
            <img src={logo} style={{ width: "170px" }} />
            <h1>Eventura</h1>
            <p>Discover and book unforgettable events with elegance ✨</p>
            <button onClick={() => setIsSignup(!isSignup)}>
              {isSignup ? "Login" : "Sign Up"}
            </button>
          </div>

          {/* RIGHT PANEL */}
          <div className="auth-right">
            {/* LOGIN */}
            <div className={`form login ${isSignup ? "hide" : ""}`}>
              <h2>Login</h2>

              <input type="email" placeholder="Email" />

              <div className="password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                />
                <span onClick={() => setShowPassword(!showPassword)}>
                  <i className="bi bi-eye"></i>
                </span>
              </div>

              <button className="primary-btn">Login</button>
              <button className="google-btn" onClick={googleLogin}>
                <img src={googleIcon} className="google-image" /> &nbsp;
  Continue with Google
</button>
              <p>
                Don’t have an account?{" "}
                <span onClick={() => setIsSignup(true)}>Sign up</span>
              </p>
            </div>

            {/* SIGNUP */}
            <div className={`form signup ${isSignup ? "show" : ""}`}>
              <h2>Sign Up</h2>

              <input
                type="text"
                name="name"
                placeholder="Name"
                value={signupData.name}
                onChange={handleChange}
              />
              {errors.name && <small>{errors.name}</small>}

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={signupData.email}
                onChange={handleChange}
              />
              {errors.email && <small>{errors.email}</small>}

              <input
                type="number"
                name="phone"
                maxLength="10"
                placeholder="Phone number"
                value={signupData.phone}
                onChange={handleChange}
              />
              {errors.phone && <small>{errors.phone}</small>}

              <div className="password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  name="password"
                  value={signupData.password}
                  onChange={handleChange}
                />
                {errors.password && <small>{errors.password}</small>}
                <span onClick={() => setShowPassword(!showPassword)}>
                  <i className="bi bi-eye"></i>
                </span>
              </div>

              <div className="password-field">
              <input type={showPassword? "text" : "password"}
              placeholder="Confirm Password" 
              name="confirmPassword"
              value={signupData.confirmPassword}
              onChange={handleChange} 
              />
              <span onClick={() => setShowPassword(!showPassword)}>
                <i className="bi bi-eye"></i>
              </span>
            </div>

              <button className="primary-btn" onClick={handleSignUp}>
                Sign Up
              </button>

              <p>
                Already have an account?{" "}
                <span onClick={() => setIsSignup(false)}>Login</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <ToastContainer />
    </>
  );
};

export default Auth;
