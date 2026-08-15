const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    eventName: { type: String, required: true, trim: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    shortDescription: { type: String, trim: true, required: true },
    longDescription: { type: String, trim: true, required: true },
    coverImage: { type: String },
    galleryImages: [{ type: String }],
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);