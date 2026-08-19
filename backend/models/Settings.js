const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    account: {
      adminName: { type: String, default: "", trim: true },
      email: { type: String, default: "", trim: true, lowercase: true },
      password: { type: String, default: "" }, // bcrypt hash, empty until first set
    },
    business: {
      companyName: { type: String, default: "", trim: true },
      contactPhone: { type: String, default: "", trim: true },
      supportEmail: { type: String, default: "", trim: true, lowercase: true },
      officeAddress: { type: String, default: "", trim: true, maxlength: 300 },
      description: { type: String, default: "", trim: true, maxlength: 500 }, // NEW — "about our business"
      gstNumber: { type: String, default: "", trim: true, uppercase: true },
    },
    system: {
      advanceDepositPercentage: { type: Number, required: true, min: 10, max: 100, default: 50 },
      serviceTaxPercentage: { type: Number, required: true, min: 0, max: 28, default: 18 },
      minimumBookingMarginDays: { type: Number, required: true, min: 1, default: 7 },
      autoApproveBookings: { type: Boolean, default: false },
      configured: { type: Boolean, default: false },
    },
    // Organizer Section
    organizer: {
      name: { type: String, default: "", trim: true },
      title: { type: String, default: "", trim: true },
      phone: { type: String, default: "", trim: true },
      website: { type: String, default: "", trim: true, lowercase: true },
      profileImage: { type: String, default: "" }, // Will store the file path from Multer
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", settingsSchema);