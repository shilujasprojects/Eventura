// One-time migration: uploads existing local images (from backend/uploads/)
// to Cloudinary and updates the matching MongoDB documents.
//
// Run manually: node scripts/migrateCategoryImagesToCloudinary.js
// Does NOT run automatically on server start, and does NOT delete local files.

require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const Category = require("../models/Category");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

const UPLOADS_DIR = path.join(__dirname, "..", "uploads");

const migrateCategoryImages = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const categories = await Category.find({});
    console.log(`Found ${categories.length} categories total`);

    let migrated = 0;
    let skippedAlready = 0;
    let skippedMissing = 0;
    let failed = 0;

    for (const category of categories) {
      const currentImage = category.image;

      // Already a Cloudinary URL — nothing to do
      if (!currentImage || currentImage.startsWith("http")) {
        skippedAlready++;
        continue;
      }

      const localPath = path.join(UPLOADS_DIR, currentImage);

      if (!fs.existsSync(localPath)) {
        console.warn(`⚠️  Skipping "${category.categoryName}" (${category._id}) — file not found: ${currentImage}`);
        skippedMissing++;
        continue;
      }

      try {
        const buffer = fs.readFileSync(localPath);
        const result = await uploadToCloudinary(buffer, "eventura/categories");

        category.image = result.secure_url;
        await category.save();

        console.log(`✅ Migrated "${category.categoryName}" (${category._id}) → ${result.secure_url}`);
        migrated++;
      } catch (err) {
        console.error(`❌ Failed to migrate "${category.categoryName}" (${category._id}):`, err.message);
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

migrateCategoryImages();