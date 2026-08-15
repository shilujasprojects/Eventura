const express = require("express");
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  dismissNotification,
  markAllAsRead,
} = require("../controllers/notificationController");

router.get("/", getNotifications);
router.patch("/mark-all-read", markAllAsRead);
router.patch("/:id/read", markAsRead);
router.patch("/:id/dismiss", dismissNotification);

module.exports = router;