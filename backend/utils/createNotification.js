const Notification = require("../models/Notification");

// Never throws — a notification failing should never break the real action
// (like a payment or booking) that triggered it.
async function createNotification({ type, priority = "general", message, link = null }) {
  try {
    await Notification.create({ type, priority, message, link });
  } catch (error) {
    console.error("Failed to create notification:", error.message);
  }
}

module.exports = createNotification;