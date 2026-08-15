const express = require("express");
const router = express.Router();
const {
  createInquiry,
  getInquiries,
  getClientInquiries,
  getInquiryById,
  updateInquiryStatus,
  addInquiryReply,
  deleteInquiry,
} = require("../controllers/inquiryController");

// Public - client website submits an inquiry
router.post("/", createInquiry);

// Client - view own tickets
router.get("/client/:clientId", getClientInquiries);

// Admin
router.get("/", getInquiries);
router.get("/:id", getInquiryById);
router.patch("/:id/status", updateInquiryStatus);
router.post("/:id/replies", addInquiryReply);
router.delete("/:id", deleteInquiry);

module.exports = router;