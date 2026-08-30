require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const Vendor = require("../models/Vendor");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

const UPLOADS_DIR = path.join(__dirname, "..", "uploads");

const migrateVendorImages = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const vendors = await Vendor.find({});
    console.log(`Found ${vendors.length} vendors total`);

    let migrated = 0;
    let skippedAlready = 0;
    let skippedMissing = 0;
    let failed = 0;

    for (const vendor of vendors) {
      const currentImage = vendor.image;

      if (!currentImage || currentImage.startsWith("http")) {
        skippedAlready++;
        continue;
      }

      const localPath = path.join(UPLOADS_DIR, currentImage);

      if (!fs.existsSync(localPath)) {
        console.warn(`⚠️  Skipping "${vendor.name}" (${vendor._id}) — file not found: ${currentImage}`);
        skippedMissing++;
        continue;
      }

      try {
        const buffer = fs.readFileSync(localPath);
        const result = await uploadToCloudinary(buffer, "eventura/vendors");

        vendor.image = result.secure_url;
        await vendor.save();

        console.log(`✅ Migrated "${vendor.name}" (${vendor._id}) → ${result.secure_url}`);
        migrated++;
      } catch (err) {
        console.error(`❌ Failed to migrate "${vendor.name}" (${vendor._id}):`, err.message);
        failed++;
      }
    }

    console.log("\n----- Migration Summary -----");
    console.log(`Migrated:        ${migrated}`);
    console.log(`Already on Cloudinary: ${skippedAlready}`);
    console.log(`Local file missing:    ${skippedMissing}`);
    console.log(`Failed:                ${failed}`);
    console.log("------------------------------\n");
    console.log("Local files were NOT deleted — verify images on Cloudinary before removing backend/uploads/ manually.");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Migration script failed:", err);
    process.exit(1);
  }
};

migrateVendorImages();