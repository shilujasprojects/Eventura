const express = require("express");
const router = express.Router();
const { getDashboardStats, getBadgeCounts, globalSearch  } = require("../controllers/dashboardController");


router.get("/stats", getDashboardStats);

// sidebar badge counter
router.get("/badge-counts", getBadgeCounts);

// Add the search route
router.get("/search", globalSearch);

module.exports = router;