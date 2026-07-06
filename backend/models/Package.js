const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema(
  {
    packageName: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    description: {
      type: String,
      trim: true,
    },

    services: [
      {
        service: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Service",
          required: true,
        },
        isOptional: {
          type: Boolean,
          default: false,
        },
      },
    ],

    basePrice: {
      type: Number,
      required: true,
    },

    packageDiscount: {
      type: {
        type: String,
        enum: ["Percentage", "Flat"],
        default: "Percentage",
      },
      value: {
        type: Number,
        default: 0,
      },
    },

    tags: [
      {
        type: String,
        enum: [
          "Recommended",
          "Featured",
          "Popular",
          "Best Seller",
          "Trending",
          "Luxury",
          "New",
        ],
      },
    ],

    displayOrder: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Package", packageSchema);