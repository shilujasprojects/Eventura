const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");

const {
  getSettings,
  getBookingConfig,
  updateBusinessSettings,
  updateSystemSettings,
  updateAccountProfile,
  changePassword,
  updateOrganizerProfile,
} = require("../controllers/settingController");

// If you have an admin auth middleware (e.g. `protect`), plug it in like this:
// const { protect } = require("../middleware/authMiddleware");
// router.use(protect);

router.get("/", getSettings);

// Public — used by the client-facing BookNow page, no admin auth needed.
// Must come before any admin-auth middleware you add above.
router.get("/booking-config", getBookingConfig);

router.put("/business", updateBusinessSettings);
router.put("/system", updateSystemSettings);
router.put("/account", updateAccountProfile);
router.put("/account/password", changePassword);

//  Route using multer middleware
router.put("/organizer", upload.single("profileImage"), updateOrganizerProfile);

module.exports = router;