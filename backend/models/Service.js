const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    serviceName: {
      type: String,
      required: true,
      trim: true,
    },

    servicePrice: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
    },

    bannerImage: {
      type: String,
    },

    galleryImages: [
      {
        type: String,
      },
    ],

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Service", serviceSchema);