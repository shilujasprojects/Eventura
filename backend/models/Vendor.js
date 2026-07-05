const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
  {
    vendorId: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },

    serviceCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },

    contactPerson: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    phone: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    rate: {
      type: Number,
      default: 0,
    },

    about: {
      type: String,
    },

    image: {
      type: String,
    },

    rating: {
      type: Number,
      required: true,
      default: 0,
    },

    assignedEventsCount: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["Active", "Busy", "Suspended"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Vendor", vendorSchema);
