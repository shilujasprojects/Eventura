const Event = require("../models/Events");
const Category = require("../models/Category");
const fs = require("fs");
const path = require("path");

const deleteFile = (filename) => {
  if (!filename) return;
  const filePath = path.join("uploads", filename);
  fs.unlink(filePath, () => {});
};

// CREATE
exports.createEvent = async (req, res) => {
  try {
    const { eventName, category, shortDescription, longDescription, status } = req.body;

    if (!eventName || !category || !shortDescription || !longDescription) {
      return res.status(400).json({
        success: false,
        message: "Event Name, Category, Short Description and Long Description are required.",
      });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({ success: false, message: "Selected category not found." });
    }

    if (!req.files?.coverImage) {
      return res.status(400).json({ success: false, message: "Cover image is required." });
    }

    const coverImage = req.files.coverImage[0].filename;
    const galleryImages = (req.files.galleryImages || []).map((f) => f.filename);

    const newEvent = await Event.create({
      eventName,
      category,
      shortDescription,
      longDescription,
      status: status || "Active",
      coverImage,
      galleryImages,
    });

    res.status(201).json({ success: true, message: "Event created successfully.", data: newEvent });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET ALL
exports.getEvents = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.status) filter.status = req.query.status;

    const events = await Event.find(filter)
      .populate("category")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET SINGLE
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("category");
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found." });
    }
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE — with cascade activation block
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("category");
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found." });
    }

    const { eventName, category, shortDescription, longDescription, status, removeCover } = req.body;

    // Block activation if parent Category is inactive
    if (status === "Active") {
      const parentCategory = category
        ? await Category.findById(category)
        : event.category;

      if (!parentCategory || parentCategory.status !== "Active") {
        return res.status(400).json({
          success: false,
          message: "Cannot activate this Event because its parent Category is inactive. Please activate the Category first.",
          reason: "PARENT_CATEGORY_INACTIVE",
        });
      }
    }

    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(404).json({ success: false, message: "Selected category not found." });
      }
    }

    // Cover image
    if (req.files?.coverImage) {
      deleteFile(event.coverImage);
      event.coverImage = req.files.coverImage[0].filename;
    } else if (removeCover === "true") {
      deleteFile(event.coverImage);
      event.coverImage = "";
    }

    // Gallery
    const keepGalleryImages = [].concat(req.body.keepGalleryImages || []);
    const removedImages = event.galleryImages.filter((img) => !keepGalleryImages.includes(img));
    removedImages.forEach(deleteFile);
    const newGalleryImages = (req.files?.galleryImages || []).map((f) => f.filename);

    event.eventName = eventName ?? event.eventName;
    event.category = category ?? event.category;
    event.shortDescription = shortDescription ?? event.shortDescription;
    event.longDescription = longDescription ?? event.longDescription;
    event.status = status ?? event.status;
    event.galleryImages = [...keepGalleryImages, ...newGalleryImages];

    await event.save();

    res.status(200).json({ success: true, message: "Event updated successfully.", data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found." });
    }

    deleteFile(event.coverImage);
    (event.galleryImages || []).forEach(deleteFile);

    res.status(200).json({ success: true, message: "Event deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};