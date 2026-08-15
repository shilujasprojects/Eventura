const bcrypt = require("bcryptjs");
const Client = require("../models/Client");
const Booking = require("../models/Booking");
const Inquiry = require("../models/Inquiry");

const NAME_REGEX = /^[a-zA-Z\s]{3,50}$/;
const PHONE_REGEX = /^[6-9]\d{9}$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

// GET /api/clients/:id
const getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id).select("-password");

    if (!client) {
      return res.status(404).json({ success: false, message: "Client not found" });
    }
    res.status(200).json({ success: true, data: client });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// PATCH /api/clients/:id — client edits their own fullName / phone,
// and optionally their password. Email is intentionally not editable
// here since it's also the login identifier — changing it would need
// its own verification flow.
const updateClientProfile = async (req, res) => {
  console.log("🔥 NEW controller running, body:", req.body);
  try {
    const { fullName, phone, currentPassword, newPassword } = req.body;

    if (!fullName || !fullName.trim()) {
      return res.status(400).json({ success: false, message: "Full name is required." });
    }
    if (!NAME_REGEX.test(fullName.trim())) {
      return res.status(400).json({ success: false, message: "Name should only contain letters (3–50 characters)." });
    }
    if (phone && !PHONE_REGEX.test(phone.trim())) {
      return res.status(400).json({ success: false, message: "Enter a valid 10-digit phone number." });
    }

    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ success: false, message: "Client not found" });
    }

    // Password change is optional — only runs if the client filled in newPassword
    const wantsPasswordChange = !!(newPassword && newPassword.trim());
    if (wantsPasswordChange) {
      if (!currentPassword) {
        return res.status(400).json({ success: false, message: "Enter your current password to set a new one." });
      }
      const isMatch = await bcrypt.compare(currentPassword, client.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: "Current password is incorrect." });
      }
      if (!PASSWORD_REGEX.test(newPassword)) {
        return res.status(400).json({
          success: false,
          message: "New password must be 8+ characters with at least one letter and one number.",
        });
      }
      // pre-save hook on the model hashes this automatically since it's modified
      client.password = newPassword;
    }

    client.fullName = fullName.trim();
    client.phone = phone ? phone.trim() : client.phone;
    await client.save();

    client.password = undefined;

    res.status(200).json({
      success: true,
      message: wantsPasswordChange ? "Profile and password updated successfully." : "Profile updated successfully.",
      data: client,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// GET /api/clients/:clientId/bookings
const getBookingsByClient = async (req, res) => {
  try {
    const bookings = await Booking.find({ client: req.params.clientId })
      .populate("event")
      .populate("package")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// GET /api/clients/:clientId/inquiries
const getInquiriesByClient = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ client: req.params.clientId }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, data: inquiries });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// GET /api/admin/clients — Admin "Manage Clients" list, each with computed
// booking stats. We pull all bookings once and group them in memory instead
// of running a separate query per client — simpler to read than an
// aggregation pipeline, and plenty fast for this app's scale.
const getAllClientsForAdmin = async (req, res) => {
  try {
    const clients = await Client.find().select("-password").sort({ createdAt: -1 });

    const bookings = await Booking.find()
      .populate("event", "eventName")
      .sort({ createdAt: -1 });

    const clientsWithStats = clients.map((client) => {
      const clientBookings = bookings.filter(
        (b) => b.client.toString() === client._id.toString()
      );

      const totalSpent = clientBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

      const history = clientBookings.map((b) => ({
        bookingId: b.bookingId,
        eventName: b.event?.eventName || "Event",
        date: b.eventDate,
        amount: b.totalAmount,
        status: b.status,
      }));

      return {
        _id: client._id,
        clientId: client.clientId,
        fullName: client.fullName,
        email: client.email,
        phone: client.phone,
        status: client.status,
        createdAt: client.createdAt,
        totalBookings: clientBookings.length,
        totalSpent,
        history,
      };
    });

    res.status(200).json({ success: true, data: clientsWithStats });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// PATCH /api/admin/clients/:id/status — Admin suspends or reactivates a client
const toggleClientStatus = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ success: false, message: "Client not found" });
    }

    client.status = client.status === "Active" ? "Suspended" : "Active";
    await client.save();

    res.status(200).json({ success: true, data: client });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// GET /api/public/clients/:id/status — lightweight, unprotected check used by
// the BookNow page to confirm a logged-in client's account is still Active
// before letting them start a new booking. The real enforcement always
// happens server-side in bookingController regardless of this check.
const getClientStatus = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id).select("status");
    if (!client) {
      return res.status(404).json({ success: false, message: "Client not found" });
    }
    res.status(200).json({ success: true, status: client.status });
  } catch (error) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

module.exports = {
  getClientById,
  updateClientProfile,
  getBookingsByClient,
  getInquiriesByClient,
  getAllClientsForAdmin,
  toggleClientStatus,
  getClientStatus,
};