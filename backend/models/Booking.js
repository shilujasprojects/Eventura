const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    bookingId: { type: String, unique: true },

    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },

    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      default: null,
    },
    isCustomPackage: { type: Boolean, default: false },

    extraServices: [
      {
        service: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Service",
          required: true,
        },
        price: { type: Number, required: true },
      },
    ],

    eventDate: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    city: { type: String, required: true, trim: true },
    venueName: { type: String, trim: true },
    guestCount: { type: Number, required: true, min: 1 },

    budgetRange: { type: String, trim: true },
    specialRequirements: { type: String, trim: true },

    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    whatsappUpdates: { type: Boolean, default: false },

    packagePrice: { type: Number, default: 0 },
    extraServicesTotal: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },

    // Payment tracking — 50% advance, 50% after the event is completed
    paymentSummary: {
      advanceAmount: { type: Number, default: 0 },
      balanceAmount: { type: Number, default: 0 },
      advanceStatus: {
        type: String,
        enum: [
          "Not Paid",
          "Pending",
          "Paid",
          "Failed",
          "Refunded",
          "Partially Refunded",
        ],
        default: "Not Paid",
      },
      finalStatus: {
        type: String,
        enum: [
          "Not Paid",
          "Pending",
          "Paid",
          "Failed",
          "Refunded",
          "Partially Refunded",
        ],
        default: "Not Paid",
      },
    },
    status: {
      type: String,
      enum: [
        "Pending",
        "ReadyForApproval",
        "Confirmed",
        "Completed",
        "Closed",
        "Cancelled",
      ],
      default: "Pending",
    },

    // Populated whenever a booking is cancelled — by admin action or
    // automatically when a payment is refunded
    cancellationReason: { type: String, trim: true, default: null },

    // Audit trail
    approvedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
    closedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

// Auto-generate a readable bookingId like EVB-2026-0001 before saving a new booking
bookingSchema.pre("save", async function () {
  if (this.bookingId) return;

  const year = new Date().getFullYear();

  const lastBooking = await mongoose
    .model("Booking")
    .findOne({ bookingId: new RegExp(`^BK-${year}-`) }, { bookingId: 1 })
    .sort({ createdAt: -1 });

  let nextNumber = 1;

  if (lastBooking) {
    nextNumber = parseInt(lastBooking.bookingId.split("-")[2]) + 1;
  }

  this.bookingId = `BK-${year}-${String(nextNumber).padStart(6, "0")}`;
});

module.exports = mongoose.model("Booking", bookingSchema);
