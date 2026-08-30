const mongoose = require('mongoose');

// Banner is a singleton — only one document should ever exist for the homepage hero section
const bannerSchema = new mongoose.Schema(
  {
    heroTitle: { type: String, required: true, trim: true },
    heroSubtitle: { type: String, required: true, trim: true },
    ctaText: { type: String, required: true, trim: true },
    promoDiscount: { type: String, required: true, trim: true },
    // Each image now stores both the Cloudinary secure_url (for display)
    // and public_id (required to delete it from Cloudinary later).
    images: {
      type: [
        {
          url: { type: String, required: true },
          public_id: { type: String, required: true },
        },
      ],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 4,
        message: 'A maximum of 4 hero images is allowed.',
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Banner', bannerSchema);