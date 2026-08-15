const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    transactionId: { type: String, unique: true },

    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },

    // Which half of the payment this is
    paymentStage: { type: String, enum: ["Advance", "Final"], required: true },

    amount: { type: Number, required: true },

    method: {
      type: String,
      enum: ["UPI", "Bank Transfer", "Cash"],
      required: true,
    },

    // What the client typed in — the UTR / bank reference number from their own app
    referenceNumber: { type: String, required: true, trim: true },
    receiptUrl: { type: String, default: null },

    status: {
      type: String,
      enum: ["Pending", "Success", "Failed", "Refunded"],
      default: "Pending",
    },

    reviewedAt: { type: Date, default: null },
    notes: { type: String, trim: true },
    refundReason: { type: String, trim: true, default: null },
    
    // How much was actually refunded — may be less than `amount` for a
    // partial refund. Null until a refund happens.
    refundedAmount: { type: Number, default: null },
  },
  { timestamps: true },
);

// Auto-generate TXN-2026-0001 — same pattern as Booking/Client IDs
transactionSchema.pre("save", async function () {
  if (this.transactionId) return;

  const year = new Date().getFullYear();
  const lastTxn = await mongoose
    .model("Transaction")
    .findOne(
      { transactionId: new RegExp(`^TXN-${year}-`) },
      { transactionId: 1 },
    )
    .sort({ createdAt: -1 });

  let nextNumber = 1;
  if (lastTxn) {
    nextNumber = parseInt(lastTxn.transactionId.split("-")[2]) + 1;
  }
  this.transactionId = `TXN-${year}-${String(nextNumber).padStart(4, "0")}`;
});

module.exports = mongoose.model("Transaction", transactionSchema);
