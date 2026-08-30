require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const Transaction = require("../models/Transaction");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

const UPLOADS_DIR = path.join(__dirname, "..", "uploads");

const migratePaymentReceipts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const transactions = await Transaction.find({});
    console.log(`Found ${transactions.length} transactions total`);

    let migrated = 0;
    let skippedAlready = 0;
    let skippedMissing = 0;
    let failed = 0;

    for (const txn of transactions) {
      const currentReceipt = txn.receiptUrl;

      if (!currentReceipt || currentReceipt.startsWith("http")) {
        skippedAlready++;
        continue;
      }

      const localPath = path.join(UPLOADS_DIR, currentReceipt);

      if (!fs.existsSync(localPath)) {
        console.warn(`⚠️  Skipping "${txn.transactionId}" (${txn._id}) — file not found: ${currentReceipt}`);
        skippedMissing++;
        continue;
      }

      try {
        const buffer = fs.readFileSync(localPath);
        const result = await uploadToCloudinary(buffer, "eventura/payments/receipts");

        txn.receiptUrl = result.secure_url;
        await txn.save();

        console.log(`✅ Migrated "${txn.transactionId}" (${txn._id}) → ${result.secure_url}`);
        migrated++;
      } catch (err) {
        console.error(`❌ Failed to migrate "${txn.transactionId}" (${txn._id}):`, err.message);
        failed++;
      }
    }

    console.log("\n----- Migration Summary -----");
    console.log(`Migrated:        ${migrated}`);
    console.log(`Already on Cloudinary: ${skippedAlready}`);
    console.log(`Local file missing:    ${skippedMissing}`);
    console.log(`Failed:                ${failed}`);
    console.log("------------------------------\n");
    console.log("Local files were NOT deleted — verify receipts on Cloudinary before removing backend/uploads/ manually.");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Migration script failed:", err);
    process.exit(1);
  }
};

migratePaymentReceipts();