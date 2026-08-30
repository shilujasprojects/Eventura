require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const Service = require("../models/Service");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

const UPLOADS_DIR = path.join(__dirname, "..", "uploads");

const migrateFile = async (filename, folder) => {
  const localPath = path.join(UPLOADS_DIR, filename);
  if (!fs.existsSync(localPath)) return null;
  const buffer = fs.readFileSync(localPath);
  const result = await uploadToCloudinary(buffer, folder);
  return result.secure_url;
};

const migrateServiceImages = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const services = await Service.find({});
    console.log(`Found ${services.length} services total`);

    let migrated = 0;
    let skipped = 0;
    let failed = 0;

    for (const service of services) {
      let changed = false;

      try {
        if (service.bannerImage && !service.bannerImage.startsWith("http")) {
          const url = await migrateFile(service.bannerImage, "eventura/services");
          if (url) {
            service.bannerImage = url;
            changed = true;
          } else {
            console.warn(`⚠️  "${service.serviceName}" — banner file not found: ${service.bannerImage}`);
          }
        }

        const newGallery = [];
        for (const img of service.galleryImages || []) {
          if (img.startsWith("http")) {
            newGallery.push(img);
            continue;
          }
          const url = await migrateFile(img, "eventura/services/gallery");
          if (url) {
            newGallery.push(url);
            changed = true;
          } else {
            console.warn(`⚠️  "${service.serviceName}" — gallery file not found: ${img}`);
          }
        }
        service.galleryImages = newGallery;

        if (changed) {
          await service.save();
          console.log(`✅ Migrated "${service.serviceName}" (${service._id})`);
          migrated++;
        } else {
          skipped++;
        }
      } catch (err) {
        console.error(`❌ Failed to migrate "${service.serviceName}" (${service._id}):`, err.message);
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

migrateServiceImages();