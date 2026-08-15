const mongoose = require("mongoose");

const replySchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    repliedBy: { type: String, enum: ["Admin", "Client"], default: "Admin" },
  },
  { timestamps: true }
);

const inquirySchema = new mongoose.Schema(
  {
    ticketId: { type: String, unique: true },

    // Linked if the inquiry came from a signed-in client, null if guest
    client: { type: mongoose.Schema.Types.ObjectId, ref: "Client", default: null },

    clientName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },

    subject: { type: String, required: true, trim: true, maxlength: 120 },
    message: { type: String, required: true, trim: true, maxlength: 2000 },

    status: {
      type: String,
      enum: ["New", "In Progress", "Resolved"],
      default: "New",
    },

    replies: [replySchema],
  },
  { timestamps: true }
);

// Auto-generate a readable ticketId like INQ-2026-001 before saving a new inquiry
inquirySchema.pre("save", async function () {
  if (this.ticketId) return;

  const year = new Date().getFullYear();

  const lastInquiry = await mongoose
    .model("Inquiry")
    .findOne({ ticketId: new RegExp(`^INQ-${year}-`) }, { ticketId: 1 })
    .sort({ createdAt: -1 });

  let nextNumber = 1;
  if (lastInquiry) {
    nextNumber = parseInt(lastInquiry.ticketId.split("-")[2]) + 1;
  }

  this.ticketId = `INQ-${year}-${String(nextNumber).padStart(3, "0")}`;
});

module.exports = mongoose.model("Inquiry", inquirySchema);