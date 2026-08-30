const Service = require("../models/Service");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

// ── Add Service ───────────────────────────────────────────
exports.addService = async (req, res) => {
  try {
    let bannerImage = "";
    if (req.files?.bannerImage) {
      const result = await uploadToCloudinary(req.files.bannerImage[0].buffer, "eventura/services");
      bannerImage = result.secure_url;
    }

    const galleryImages = [];
    for (const file of req.files?.galleryImages || []) {
      const result = await uploadToCloudinary(file.buffer, "eventura/services/gallery");
      galleryImages.push(result.secure_url);
    }

    const service = await Service.create({
      serviceName: req.body.serviceName,
      servicePrice: req.body.servicePrice,
      description: req.body.description,
      status: req.body.status,
      bannerImage,
      galleryImages,
    });

    res.status(201).json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Get All Services ──────────────────────────────────────
exports.getServices = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const services = await Service.find(filter).sort({ createdAt: -1 });
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
      const result = await uploadToCloudinary(req.files.bannerImage[0].buffer, "eventura/services");
      updatedData.bannerImage = result.secure_url;
    } else if (req.body.removeBanner === "true") {
      updatedData.bannerImage = "";
    }

    // Gallery: merge kept existing images (already Cloudinary URLs) + newly uploaded images
    const keptImages = req.body.keepGalleryImages
      ? Array.isArray(req.body.keepGalleryImages)
        ? req.body.keepGalleryImages
        : [req.body.keepGalleryImages]
      : [];

    const newImages = [];
    for (const file of req.files?.galleryImages || []) {
      const result = await uploadToCloudinary(file.buffer, "eventura/services/gallery");
      newImages.push(result.secure_url);
    }

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

    // No Cloudinary deletion yet — same as Category/Event
    res.status(200).json({ success: true, message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};