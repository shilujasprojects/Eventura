const express = require("express");
const router = express.Router();
const {
  getSettings,
  updateBusinessSettings,
  updateSystemSettings,
  updateAccountProfile,
  changePassword,
} = require("../controllers/settingController");

// If you have an admin auth middleware (e.g. `protect`), plug it in like this:
// const { protect } = require("../middleware/authMiddleware");
// router.use(protect);

router.get("/", getSettings);
router.put("/business", updateBusinessSettings);
router.put("/system", updateSystemSettings);
router.put("/account", updateAccountProfile);
router.put("/account/password", changePassword);

module.exports = router;