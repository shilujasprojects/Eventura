const cloudinary = require("../config/cloudinary");
const uploadToCloudinary = require("../utils/uploadToCloudinary");
const Banner = require('../models/Banner');

// @desc   Get homepage banner (creates a default one on first run)
// @route  GET /api/banner
exports.getBanner = async (req, res) => {
  try {
    let banner = await Banner.findOne();

    if (!banner) {
      banner = await Banner.create({
        heroTitle: 'Crafting Unforgettable Indian & Heritage Celebrations',
        heroSubtitle:
          'Your premium gateway to book heritage weddings, corporate conclaves, and theme parties across Kerala.',
        ctaText: 'Explore Event Packages',
        promoDiscount: 'Up to 15% off on first heritage wedding bookings this season',
        images: [],
      });
    }

    res.status(200).json({ success: true, data: banner });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch banner', error: error.message });
  }
};

// @desc   Update homepage banner text content
// @route  PUT /api/banner
exports.updateBanner = async (req, res) => {
  try {
    const { heroTitle, heroSubtitle, ctaText, promoDiscount } = req.body;

    if (!heroTitle || !heroSubtitle || !ctaText || !promoDiscount) {
      return res.status(400).json({ success: false, message: 'All banner fields are required' });
    }

    let banner = await Banner.findOne();

    if (!banner) {
      banner = await Banner.create({ heroTitle, heroSubtitle, ctaText, promoDiscount });
    } else {
      banner.heroTitle = heroTitle;
      banner.heroSubtitle = heroSubtitle;
      banner.ctaText = ctaText;
      banner.promoDiscount = promoDiscount;
      await banner.save();
    }

    res.status(200).json({ success: true, data: banner });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update banner', error: error.message });
  }
};

// @desc   Upload one hero gallery image (max 4 total)
// @route  POST /api/banner/upload-image
exports.uploadBannerImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file received' });
    }

    let banner = await Banner.findOne();

    if (!banner) {
      banner = await Banner.create({
        heroTitle: 'Crafting Unforgettable Indian & Heritage Celebrations',
        heroSubtitle:
          'Your premium gateway to book heritage weddings, corporate conclaves, and theme parties across Kerala.',
        ctaText: 'Explore Event Packages',
        promoDiscount: 'Up to 15% off on first heritage wedding bookings this season',
        images: [],
      });
    }

    if (banner.images.length >= 4) {
      return res.status(400).json({ success: false, message: 'Maximum of 4 hero images reached. Remove one first.' });
    }

    const result = await uploadToCloudinary(req.file.buffer, "eventura/banners");

    banner.images.push({ url: result.secure_url, public_id: result.public_id });
    await banner.save();

    res.status(200).json({ success: true, data: banner });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to upload image', error: error.message });
  }
};

// @desc   Remove a hero gallery image
// @route  DELETE /api/banner/image/:imageId
exports.deleteBannerImage = async (req, res) => {
  try {
    const { imageId } = req.params;
    const banner = await Banner.findOne();

    if (!banner) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }

    const image = banner.images.id(imageId);
    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }

    await cloudinary.uploader.destroy(image.public_id);

    banner.images.pull(imageId);
    await banner.save();

    res.status(200).json({ success: true, data: banner });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete image', error: error.message });
  }
};