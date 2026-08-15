const express = require("express");
const router = express.Router();

const { getAllClientsForAdmin, toggleClientStatus } = require("../controllers/clientController");

// GET /api/admin/clients
router.get("/", getAllClientsForAdmin);

// PATCH /api/admin/clients/:id/status
router.patch("/:id/status", toggleClientStatus);

module.exports = router;