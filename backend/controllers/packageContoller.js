const Package = require("../models/Package");
const Category = require("../models/Category");
const Service = require("../models/Service");

const validatePackageBody = async (body) => {
  const { packageName, category, services, basePrice } = body;

  if (!packageName || !category || !services || services.length === 0) {
    return "Package Name, Category and at least one Service are required.";
  }

  if (!basePrice || Number(basePrice) <= 0) {
    return "A valid package price is required.";
  }

  const categoryExists = await Category.findById(category);
  if (!categoryExists) return "Selected category not found.";

  const serviceIds = services.map((item) => item.service);
  const availableServices = await Service.find({ _id: { $in: serviceIds } });
  if (availableServices.length !== serviceIds.length) {
    return "One or more selected services are invalid.";
  }

  return null;
};

// Create Package
exports.createPackage = async (req, res) => {
  try {
    const error = await validatePackageBody(req.body);
    if (error) return res.status(400).json({ success: false, message: error });

    const newPackage = await Package.create(req.body);

    res.status(201).json({ success: true, message: "Package created successfully.", data: newPackage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Packages
exports.getPackages = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;

    const packages = await Package.find(filter)
      .populate("category")
      .populate("services.service")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: packages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Single Package
exports.getPackageById = async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id)
      .populate("category")
      .populate("services.service");

    if (!pkg) return res.status(404).json({ success: false, message: "Package not found." });

    res.status(200).json({ success: true, data: pkg });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Package
exports.updatePackage = async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) return res.status(404).json({ success: false, message: "Package not found." });

    const error = await validatePackageBody(req.body);
    if (error) return res.status(400).json({ success: false, message: error });

    Object.assign(pkg, req.body);
    await pkg.save();

    res.status(200).json({ success: true, message: "Package updated successfully.", data: pkg });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Package
exports.deletePackage = async (req, res) => {
  try {
    const pkg = await Package.findByIdAndDelete(req.params.id);
    if (!pkg) return res.status(404).json({ success: false, message: "Package not found." });

    res.status(200).json({ success: true, message: "Package deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};