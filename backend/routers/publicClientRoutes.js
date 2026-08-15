const express = require("express");
const router = express.Router();

const { getClientStatus } = require("../controllers/clientController");

// GET /api/public/clients/:id/status
router.get("/:id/status", getClientStatus);

module.exports = router;