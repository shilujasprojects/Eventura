const mongoose = require('mongoose');

// Banner is a singleton — only one document should ever exist for the homepage hero section
const bannerSchema = new mongoose.Schema(
  {
    heroTitle: { type: String, required: true, trim: true },
    heroSubtitle: { type: String, required: true, trim: true },
    ctaText: { type: String, required: true, trim: true },
    promoDiscount: { type: String, required: true, trim: true },
    // Filenames only — the frontend builds the full URL the same way it already
    // does for other uploads: `${BASE_URL}/uploads/${filename}`
    images: {
      type: [String],
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