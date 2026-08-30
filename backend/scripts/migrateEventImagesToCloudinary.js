require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const Event = require("../models/Events");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

const UPLOADS_DIR = path.join(__dirname, "..", "uploads");

const migrateFile = async (filename, folder) => {
  const localPath = path.join(UPLOADS_DIR, filename);
  if (!fs.existsSync(localPath)) return null;
  const buffer = fs.readFileSync(localPath);
  const result = await uploadToCloudinary(buffer, folder);
  return result.secure_url;
};

const migrateEventImages = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const events = await Event.find({});
    console.log(`Found ${events.length} events total`);

    let migrated = 0;
    let skipped = 0;
    let failed = 0;

    for (const event of events) {
      let changed = false;

      try {
        if (event.coverImage && !event.coverImage.startsWith("http")) {
          const url = await migrateFile(event.coverImage, "eventura/events");
          if (url) {
            event.coverImage = url;
            changed = true;
          } else {
            console.warn(`⚠️  "${event.eventName}" — cover file not found: ${event.coverImage}`);
          }
        }

        const newGallery = [];
        for (const img of event.galleryImages || []) {
          if (img.startsWith("http")) {
            newGallery.push(img);
            continue;
          }
          const url = await migrateFile(img, "eventura/events/gallery");
          if (url) {
            newGallery.push(url);
            changed = true;
          } else {
            console.warn(`⚠️  "${event.eventName}" — gallery file not found: ${img}`);
          }
        }
        event.galleryImages = newGallery;

        if (changed) {
          await event.save();
          console.log(`✅ Migrated "${event.eventName}" (${event._id})`);
          migrated++;
        } else {
          skipped++;
        }
      } catch (err) {
        console.error(`❌ Failed to migrate "${event.eventName}" (${event._id}):`, err.message);
        failed++;
      }
    }

    console.log("\n----- Migration Summary -----");
    console.log(`Migrated: ${migrated}`);
    console.log(`Skipped (already Cloudinary / no local images): ${skipped}`);
    console.log(`Failed:   ${failed}`);
    console.log("------------------------------\n");
    console.log("Local files were NOT deleted — verify on Cloudinary before removing backend/uploads/ manually.");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Migration script failed:", err);
    process.exit(1);
  }
};

migrateEventImages();