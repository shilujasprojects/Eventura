const express = require("express");
const router = express.Router();

const {
  createBooking,
  getAllBookings,
  getUpcomingBookings,
  getClientBookings,
  getBookingById,
  approveBooking,
  rejectBooking,
  completeEvent,
  cancelEvent,
  closeBooking,
} = require("../controllers/bookingController");

router.post("/", createBooking);
router.get("/", getAllBookings);
router.get("/upcoming/list", getUpcomingBookings);
router.get("/:id", getBookingById);
router.get("/client/:clientId", getClientBookings);
router.patch("/:id/approve", approveBooking);
router.patch("/:id/reject", rejectBooking);
router.patch("/:id/complete", completeEvent);
router.patch("/:id/cancel", cancelEvent);
router.patch("/:id/close", closeBooking);

module.exports = router;