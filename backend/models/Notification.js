const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["payment", "inquiry", "booking", "testimonial", "system"],
      required: true,
    },
    priority: {
      type: String,
      enum: ["urgent", "general"],
      default: "general",
    },
    message: { type: String, required: true, trim: true },
    // Optional path so the admin can jump straight to the related page
    link: { type: String, default: null },
    isRead: { type: Boolean, default: false },
    // Once true, it stops showing on the Dashboard alert banner —
    // but it still stays visible on the Notifications page.
    isDismissed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);