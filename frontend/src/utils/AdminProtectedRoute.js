// src/utils/AdminProtectedRoute.js

import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AdminProtectedRoute = () => {
  // We check the browser's storage to see if they logged in successfully
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // If there's no token, or the user is not an admin, kick them back to Auth/Login
  if (!token || role !== "admin") {
    // Change "/auth" to wherever your login page route actually is (e.g., "/" or "/login")
    return <Navigate to="/" replace />;
  }

  // If they are an admin, render the child routes (Outlet)
  return <Outlet />;
};

export default AdminProtectedRoute;