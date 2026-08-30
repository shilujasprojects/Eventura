const express = require("express");
const router = express.Router();

const upload = require("../middlewares/cloudinaryUpload"); // was: ../middlewares/upload

const {
  addVendor,
  getAllVendors,
  getVendorById,
  updateVendor,
  deleteVendor,
  changeVendorStatus,
} = require("../controllers/vendorController");

router.post("/", upload.single("image"), addVendor);

router.get("/", getAllVendors);

router.get("/:id", getVendorById); // no upload middleware — already correct

router.put("/:id", upload.single("image"), updateVendor);

router.delete("/:id", deleteVendor);

router.patch("/status/:id", changeVendorStatus);

module.exports = router;