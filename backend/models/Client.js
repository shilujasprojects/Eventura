// models/Client.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const clientSchema = new mongoose.Schema(
  {
    clientId: { type: String, unique: true },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    phone: { type: String, trim: true, default: "" },
    password: { type: String, required: true },
    status: { type: String, enum: ["Active", "Suspended"], default: "Active" },
  },
  { timestamps: true }
);

// Auto-generate CLI- number
clientSchema.pre("save", async function () {
  if (!this.clientId) {
    const lastClient = await mongoose
      .model("Client")
      .findOne({}, { clientId: 1 })
      .sort({ createdAt: -1 });

    let nextNumber = 1;
    if (lastClient && lastClient.clientId) {
      nextNumber = parseInt(lastClient.clientId.split("-")[1]) + 1;
    }
    this.clientId = `CLI-${String(nextNumber).padStart(6, "0")}`;
  }

  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

module.exports = mongoose.model("Client", clientSchema);