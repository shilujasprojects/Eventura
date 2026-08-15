const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware");

const {
  getClientById,
  updateClientProfile,
  getBookingsByClient,
  getInquiriesByClient,
} = require("../controllers/clientController");

// Protect all client routes with JWT middleware
router.use(authMiddleware);

// GET /api/clients/:id
router.get("/:id", getClientById);

// PATCH /api/clients/:id — client edits their own profile
router.patch("/:id", updateClientProfile);

// GET /api/clients/:clientId/bookings
router.get("/:clientId/bookings", getBookingsByClient);

// GET /api/clients/:clientId/inquiries
router.get("/:clientId/inquiries", getInquiriesByClient);

module.exports = router;