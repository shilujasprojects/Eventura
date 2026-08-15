const Inquiry = require("../models/Inquiry");
const createNotification = require("../utils/createNotification");

// @desc   Create new inquiry (Public - submitted from client website)
// @route  POST /api/inquiries
exports.createInquiry = async (req, res) => {
  try {
    const { clientName, email, phone, subject, message, client } = req.body;

    if (!clientName || !email || !phone || !subject || !message) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Please provide a valid email address." });
    }

    const inquiry = await Inquiry.create({
      clientName: clientName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      subject: subject.trim(),
      message: message.trim(),
      client: client || null,
    });

    // Notification
    await createNotification({
      type: "inquiry",
      priority: "general",
      message: `New inquiry from ${clientName.trim()}: "${subject.trim()}"`,
      link: "/admin/inquiries",
    });

    res.status(201).json({ success: true, data: inquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get all inquiries (Admin)
// @route  GET /api/inquiries
exports.getInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: inquiries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

  
// @desc   Get all inquiries submitted by a specific signed-in client
// @route  GET /api/inquiries/client/:clientId
exports.getClientInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ client: req.params.clientId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: inquiries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get a single inquiry by ID
// @route  GET /api/inquiries/:id
exports.getInquiryById = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ success: false, message: "Inquiry not found." });
    }
    res.status(200).json({ success: true, data: inquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Update inquiry status
// @route  PATCH /api/inquiries/:id/status
exports.updateInquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatus = ["New", "In Progress", "Resolved"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value." });
    }

    const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, { status }, { new: true });

    if (!inquiry) {
      return res.status(404).json({ success: false, message: "Inquiry not found." });
    }

    res.status(200).json({ success: true, data: inquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addInquiryReply = async (req, res) => {
  try {
    const { text, repliedBy } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: "Reply content cannot be blank." });
    }
    if (text.trim().length < 5) {
      return res.status(400).json({ success: false, message: "Reply must be at least 5 characters." });
    }

    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ success: false, message: "Inquiry not found." });
    }

    const sender = repliedBy === "Client" ? "Client" : "Admin";
    inquiry.replies.push({ text: text.trim(), repliedBy: sender });

    // Admin reply on a New ticket bumps it to In Progress.
    // A client follow-up on a Resolved ticket reopens it.
    if (sender === "Admin" && inquiry.status === "New") {
      inquiry.status = "In Progress";
    }
    if (sender === "Client" && inquiry.status === "Resolved") {
      inquiry.status = "In Progress";
    }

    await inquiry.save();
    res.status(200).json({ success: true, data: inquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Delete an inquiry
// @route  DELETE /api/inquiries/:id
exports.deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ success: false, message: "Inquiry not found." });
    }
    res.status(200).json({ success: true, message: "Inquiry deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};