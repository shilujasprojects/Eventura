require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const Banner = require("../models/Banner");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

const UPLOADS_DIR = path.join(__dirname, "..", "uploads");

const migrateBannerImages = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const banner = await Banner.findOne();
    if (!banner) {
      console.log("No banner document found — nothing to migrate.");
      process.exit(0);
    }

    console.log(`Found ${banner.images.length} hero images`);

    const migratedImages = [];

    for (const img of banner.images) {
      // Already migrated (has url + public_id) — keep as-is
      if (img && img.url && img.public_id) {
        migratedImages.push(img);
        continue;
      }

      // Old shape: plain filename string
      const filename = typeof img === "string" ? img : null;
      if (!filename) {
        console.warn("⚠️  Skipping unrecognized image entry:", img);
        continue;
      }

      const localPath = path.join(UPLOADS_DIR, filename);
      if (!fs.existsSync(localPath)) {
        console.warn(`⚠️  File not found, skipping: ${filename}`);
        continue;
      }

      try {
        const buffer = fs.readFileSync(localPath);
        const result = await uploadToCloudinary(buffer, "eventura/banners");
        migratedImages.push({ url: result.secure_url, public_id: result.public_id });
        console.log(`✅ Migrated ${filename} → ${result.secure_url}`);
      } catch (err) {
        console.error(`❌ Failed to migrate ${filename}:`, err.message);
      }
    }

    banner.images = migratedImages;
    await banner.save();

    console.log(`\n✅ Done. Banner now has ${migratedImages.length} Cloudinary image(s).`);
    console.log("Local files were NOT deleted — verify on Cloudinary before removing backend/uploads/ manually.");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Migration script failed:", err);
    process.exit(1);
  }
};

migrateBannerImages();