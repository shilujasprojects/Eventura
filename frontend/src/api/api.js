// Central place for API base URL + endpoint paths.
// These match the exact mount points in server.js — edit here only if
// server.js route prefixes ever change.

export const API_URL = "http://localhost:5000";

export const ENDPOINTS = {
  category: `${API_URL}/api/category`,
  event: `${API_URL}/api/events`,
  package: `${API_URL}/api/packages`,
  service: `${API_URL}/api/services`,
};

export const IMG_URL = `${API_URL}/uploads/`;