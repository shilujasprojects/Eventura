const Service = require("../models/Service");

// ── Add Service ───────────────────────────────────────────
exports.addService = async (req, res) => {
  try {
    const service = await Service.create({
      serviceName: req.body.serviceName,
      servicePrice: req.body.servicePrice,
      description: req.body.description,
      status: req.body.status,
      bannerImage: req.files?.bannerImage
        ? req.files.bannerImage[0].filename
        : "",
      galleryImages: req.files?.galleryImages
        ? req.files.galleryImages.map((img) => img.filename)
        : [],
    });

    res.status(201).json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Get All Services ──────────────────────────────────────
exports.getServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Get Single Service ────────────────────────────────────
exports.getService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    res.status(200).json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Update Service ────────────────────────────────────────
exports.updateService = async (req, res) => {
  try {
    const updatedData = {
      serviceName: req.body.serviceName,
      servicePrice: req.body.servicePrice,
      description: req.body.description,
      status: req.body.status,
    };

    // Banner: replace with new file OR clear if removeBanner flag is set
    if (req.files?.bannerImage) {
      updatedData.bannerImage = req.files.bannerImage[0].filename;
    } else if (req.body.removeBanner === "true") {
      updatedData.bannerImage = "";
    }

    // Gallery: merge kept existing images + any newly uploaded images
    // Frontend sends "keepGalleryImages" as the filenames to preserve
    const keptImages = req.body.keepGalleryImages
      ? Array.isArray(req.body.keepGalleryImages)
        ? req.body.keepGalleryImages
        : [req.body.keepGalleryImages]
      : [];

    const newImages = req.files?.galleryImages
      ? req.files.galleryImages.map((img) => img.filename)
      : [];

    updatedData.galleryImages = [...keptImages, ...newImages];

    const service = await Service.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    res.status(200).json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Delete Service ────────────────────────────────────────
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    res.status(200).json({ success: true, message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};