const express = require("express");
const router = express.Router();
const upload = require("../middlewares/cloudinaryUpload"); // was: ../middlewares/upload

const {
  getSettings,
  getBookingConfig,
  updateBusinessSettings,
  updateSystemSettings,
  updateAccountProfile,
  changePassword,
  updateOrganizerProfile,
} = require("../controllers/settingController");

router.get("/", getSettings);
router.get("/booking-config", getBookingConfig);

router.put("/business", updateBusinessSettings);
router.put("/system", updateSystemSettings);
router.put("/account", updateAccountProfile);
router.put("/account/password", changePassword);

router.put("/organizer", upload.single("profileImage"), updateOrganizerProfile);

module.exports = router;