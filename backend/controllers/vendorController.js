const Vendor = require("../models/Vendor");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

// Add Vendor
exports.addVendor = async (req, res) => {
  try {
    const lastVendor = await Vendor.findOne().sort({ createdAt: -1 });

    let vendorId = "VEN-001";
    if (lastVendor && lastVendor.vendorId) {
      const lastNumber = parseInt(lastVendor.vendorId.split("-").pop());
      vendorId = `VEN-${String(lastNumber + 1).padStart(3, "0")}`;
    }

    let image = "";
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, "eventura/vendors");
      image = result.secure_url;
    }

    const vendor = await Vendor.create({
      vendorId,
      ...req.body,
      image,
    });

    const populatedVendor = await vendor.populate("serviceCategory", "serviceName status");

    res.status(201).json({
      success: true,
      data: populatedVendor,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Vendors
exports.getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find()
      .populate("serviceCategory", "serviceName status")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: vendors.length,
      data: vendors,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Single Vendor
exports.getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id)
      .populate("serviceCategory", "serviceName status");

    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    res.status(200).json({ success: true, data: vendor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Vendor
exports.updateVendor = async (req, res) => {
  try {
    const updatedData = { ...req.body };

    if (req.body.removeImage === "true") {
      updatedData.image = "";
    }

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, "eventura/vendors");
      updatedData.image = result.secure_url;
    }

    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    res.status(200).json({ success: true, data: vendor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Vendor
exports.deleteVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndDelete(req.params.id);

    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    res.status(200).json({ success: true, message: "Vendor deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Change Status
exports.changeVendorStatus = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.status(200).json({ success: true, data: vendor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};