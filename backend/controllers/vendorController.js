const Vendor = require("../models/Vendor");


// Add Vendor
// exports.addVendor = async (req, res) => {
//   try {

//     const vendor = await Vendor.create({
//       ...req.body,
//       image: req.file ? req.file.filename : "",
//     });

//     res.status(201).json({
//       success: true,
//       data: vendor,
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

exports.addVendor = async (req, res) => {
  try {
    const lastVendor = await Vendor.findOne().sort({ createdAt: -1 });

    let vendorId = "VEN-001";
    if (lastVendor && lastVendor.vendorId) {
      const lastNumber = parseInt(lastVendor.vendorId.split("-").pop());
      vendorId = `VEN-${String(lastNumber + 1).padStart(3, "0")}`;
    }

    const vendor = await Vendor.create({
      vendorId,
      ...req.body,
      image: req.file ? req.file.filename : "",
    });

    // Populate before sending response
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
    .sort({
      createdAt: -1,
    });

    // ADD THIS TEMPORARILY
    console.log("First vendor serviceCategory:", 
      JSON.stringify(vendors[0]?.serviceCategory, null, 2));

    res.status(200).json({
      success: true,
      count: vendors.length,
      data: vendors,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


// Get Single Vendor
exports.getVendorById = async (req, res) => {
  try {

    const vendor = await Vendor.findById(req.params.id)
    .populate("serviceCategory", "serviceName status");

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    res.status(200).json({
      success: true,
      data: vendor,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// Update Vendor
exports.updateVendor = async (req, res) => {
  try {

    const updatedData = {
      ...req.body,
    };

    // Remove image if admin deleted it
    if (req.body.removeImage === "true") {
      updatedData.image = "";
    }

    // Upload new image
    if (req.file) {
      updatedData.image = req.file.filename;
    }

    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    res.status(200).json({
      success: true,
      data: vendor,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


// Delete Vendor
exports.deleteVendor = async (req, res) => {
  try {

    const vendor = await Vendor.findByIdAndDelete(
      req.params.id
    );

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vendor deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


// Change Status
exports.changeVendorStatus = async (req, res) => {
  try {

    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      data: vendor,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};