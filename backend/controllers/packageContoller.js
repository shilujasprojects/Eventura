const Package = require("../models/Package");
const Category = require("../models/Category");
const Service = require("../models/Service");


const validatePackageBody = async (body) => {
  const {
    packageName,
    category,
    description,
    services,
  } = body;

  if (!packageName?.trim()) {
    return "Package name is required.";
  }

  if (!category) {
    return "Category is required.";
  }

  if (!description?.trim()) {
    return "Description is required.";
  }

  if (!Array.isArray(services) || services.length === 0) {
    return "At least one service is required.";
  }

  return null;
};

// Create Package
exports.createPackage = async (req, res) => {
  try {
    const error = await validatePackageBody(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error,
      });
    }

    const {
      packageName,
      category,
      description,
      services,
      packageDiscount,
      tags,
      status,
    } = req.body;

    // Fetch selected services
    const serviceIds = services.map((s) => s.service);

    const selectedServices = await Service.find({
      _id: { $in: serviceIds },
    });

    // Calculate Base Price
    const basePrice = selectedServices.reduce(
      (total, service) => total + service.servicePrice,
      0
    );

    // Calculate Final Price
    let finalPrice = basePrice;

    if (packageDiscount?.type === "Percentage") {
      finalPrice =
        basePrice -
        (basePrice * Number(packageDiscount.value || 0)) / 100;
    }

    if (packageDiscount?.type === "Flat") {
      finalPrice =
        basePrice - Number(packageDiscount.value || 0);
    }

    finalPrice = Math.max(0, finalPrice);

    const newPackage = await Package.create({
      packageName,
      category,
      description,
      services,

      basePrice,
      finalPrice,

      packageDiscount,
      tags,
      status,
    });

    res.status(201).json({
      success: true,
      message: "Package created successfully.",
      data: newPackage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Get All Packages
// exports.getPackages = async (req, res) => {
//   try {
//     const filter = {};
//     if (req.query.category) filter.category = req.query.category;

//     const packages = await Package.find(filter)
//       .populate("category")
//       .populate("services.service")
//       .sort({ createdAt: -1 });

//     res.status(200).json({ success: true, data: packages });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


// Get All Packages
exports.getPackages = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.status) filter.status = req.query.status;

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

    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: "Package not found.",
      });
    }

    const error = await validatePackageBody(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error,
      });
    }

    const {
      packageName,
      category,
      description,
      services,
      packageDiscount,
      tags,
      status,
    } = req.body;

    const serviceIds = services.map((s) => s.service);

    const selectedServices = await Service.find({
      _id: { $in: serviceIds },
    });

    const basePrice = selectedServices.reduce(
      (total, service) => total + service.servicePrice,
      0
    );

    let finalPrice = basePrice;

    if (packageDiscount?.type === "Percentage") {
      finalPrice =
        basePrice -
        (basePrice * Number(packageDiscount.value || 0)) / 100;
    }

    if (packageDiscount?.type === "Flat") {
      finalPrice =
        basePrice - Number(packageDiscount.value || 0);
    }

    finalPrice = Math.max(0, finalPrice);

    pkg.packageName = packageName;
    pkg.category = category;
    pkg.description = description;
    pkg.services = services;

    pkg.basePrice = basePrice;
    pkg.finalPrice = finalPrice;

    pkg.packageDiscount = packageDiscount;
    pkg.tags = tags;
    pkg.status = status;

    await pkg.save();

    res.status(200).json({
      success: true,
      message: "Package updated successfully.",
      data: pkg,
    });
  } catch (error) {
  console.error("Update Package Error:", error);

  res.status(500).json({
    success: false,
    message: error.message,
  });
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