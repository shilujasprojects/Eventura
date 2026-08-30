require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const Settings = require("../models/Settings");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

const UPLOADS_DIR = path.join(__dirname, "..", "uploads");

const migrateOrganizerImage = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const settings = await Settings.findOne();
    if (!settings) {
      console.log("No settings document found — nothing to migrate.");
      process.exit(0);
    }

    const currentImage = settings.organizer?.profileImage;

    if (!currentImage) {
      console.log("No organizer profile image set — nothing to migrate.");
      process.exit(0);
    }

    if (currentImage.startsWith("http")) {
      console.log("Organizer profile image is already on Cloudinary — nothing to do.");
      process.exit(0);
    }

    // Old value was stored as "/uploads/filename.jpg" — strip the leading path
    const filename = currentImage.replace(/^\/?uploads\//, "");
    const localPath = path.join(UPLOADS_DIR, filename);

    if (!fs.existsSync(localPath)) {
      console.warn(`⚠️  File not found, can't migrate: ${localPath}`);
      process.exit(0);
    }

    const buffer = fs.readFileSync(localPath);
    const result = await uploadToCloudinary(buffer, "eventura/organizer");

    settings.organizer.profileImage = result.secure_url;
    await settings.save();

    console.log(`✅ Migrated organizer profile image → ${result.secure_url}`);
    console.log("Local file was NOT deleted — verify on Cloudinary before removing it manually.");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Migration script failed:", err);
    process.exit(1);
  }
};

migrateOrganizerImage();