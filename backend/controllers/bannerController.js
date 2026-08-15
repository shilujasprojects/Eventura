const fs = require('fs');
const path = require('path');
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

    // Create the banner with defaults if this is somehow the very first save
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
      // reject and clean up the file multer already wrote to disk
      fs.unlink(path.join(__dirname, '..', 'uploads', req.file.filename), () => {});
      return res.status(400).json({ success: false, message: 'Maximum of 4 hero images reached. Remove one first.' });
    }

    banner.images.push(req.file.filename);
    await banner.save();

    res.status(200).json({ success: true, data: banner });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to upload image', error: error.message });
  }
};

// @desc   Remove a hero gallery image
// @route  DELETE /api/banner/image/:filename
exports.deleteBannerImage = async (req, res) => {
  try {
    const { filename } = req.params;
    const banner = await Banner.findOne();

    if (!banner) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }

    banner.images = banner.images.filter((img) => img !== filename);
    await banner.save();

    fs.unlink(path.join(__dirname, '..', 'uploads', filename), () => {});

    res.status(200).json({ success: true, data: banner });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete image', error: error.message });
  }
};