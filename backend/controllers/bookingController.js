const Booking = require("../models/Booking");
const Event = require("../models/Events");
const Package = require("../models/Package");
const Client = require("../models/Client");
const sendBookingWhatsApp = require("../utils/sendWhatsApp");

// CREATE - called from website BookSummary page on "Confirm Booking"
exports.createBooking = async (req, res) => {
  try {
    const {
      event, package: packageId, isCustomPackage, extraServices,
      eventDate, startTime, endTime, city, venueName,
      guestCount, budgetRange, specialRequirements,
      fullName, phone, email, whatsappUpdates,
    } = req.body;

    if (!event || !eventDate || !startTime || !endTime || !city || !guestCount || !fullName || !phone || !email) {
      return res.status(400).json({ success: false, message: "Missing required booking fields" });
    }

    const eventDoc = await Event.findById(event);
    if (!eventDoc) {
      return res.status(404).json({ success: false, message: "Selected event not found" });
    }

    if (!isCustomPackage && !packageId) {
      return res.status(400).json({ success: false, message: "Select a package or choose Build Your Own" });
    }

    let packagePrice = 0;

    if (isCustomPackage) {
      if (!extraServices || extraServices.length === 0) {
        return res.status(400).json({ success: false, message: "Select at least one service for a custom booking" });
      }
    } else {
      const packageDoc = await Package.findById(packageId);
      if (!packageDoc) {
        return res.status(404).json({ success: false, message: "Selected package not found" });
      }
      packagePrice = packageDoc.finalPrice;
    }

    const extraServicesTotal = (extraServices || []).reduce(
      (sum, s) => sum + Number(s.price || 0),
      0
    );
    const totalAmount = packagePrice + extraServicesTotal;

    // Find an existing client by email or phone, otherwise create a new record.
    let client = await Client.findOne({ $or: [{ email }, { phone }] });

    if (client) {
      if (client.status === "Suspended") {
        return res.status(403).json({
          success: false,
          message: "This account has been suspended. Please contact support to reactivate it before booking.",
        });
      }
      client.fullName = fullName;
      client.email = email;
      client.phone = phone;
      await client.save();
    } else {
      client = await Client.create({ fullName, email, phone });
    }

    const booking = await Booking.create({
      event,
      client: client._id,
      package: isCustomPackage ? null : packageId,
      isCustomPackage: !!isCustomPackage,
      extraServices: extraServices || [],
      eventDate, startTime, endTime, city, venueName,
      guestCount, budgetRange, specialRequirements,
      fullName, phone, email, whatsappUpdates,
      packagePrice,
      extraServicesTotal,
      totalAmount,
      paymentSummary: {
        advanceAmount: Math.round(totalAmount * 0.5),
        balanceAmount: totalAmount - Math.round(totalAmount * 0.5),
      },
    });

    // Fire off a WhatsApp confirmation if the client opted in. This never
    // blocks or fails the booking itself — if Twilio isn't configured yet,
    // or the message fails to send, we just log it and move on.
    if (whatsappUpdates) {
      try {
        await sendBookingWhatsApp({
          phone,
          fullName,
          eventName: eventDoc.eventName,
          eventDate,
          bookingId: booking.bookingId,
          totalAmount,
        });
      } catch (waError) {
        console.error("WhatsApp notification failed:", waError.message);
      }
    }

    res.status(201).json({ success: true, message: "Booking submitted successfully.", data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET ALL - admin ManageBookings page
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate({
        path: "event",
        select: "eventName coverImage category",
        populate: { path: "category", select: "categoryName" },
      })
      .populate("package", "packageName finalPrice")
      .populate("extraServices.service", "serviceName")
      .populate("client", "clientId fullName email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/bookings/:id/approve
exports.approveBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    if (booking.status !== "ReadyForApproval") {
      return res.status(400).json({
        success: false,
        message: "This booking can't be approved yet — the advance payment must be verified first.",
      });
    }

    booking.status = "Confirmed";
    booking.approvedAt = new Date();
    await booking.save();

    const populated = await populateBooking(booking._id);
    res.status(200).json({
      success: true,
      message: "Booking approved successfully. Vendors can now be assigned and event execution can begin.",
      data: populated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/bookings/:id/reject
exports.rejectBooking = async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason || !reason.trim()) {
      return res.status(400).json({ success: false, message: "A reason is required to reject a booking." });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    if (booking.status !== "ReadyForApproval" && booking.status !== "Pending") {
      return res.status(400).json({ success: false, message: "This booking can no longer be rejected." });
    }

    booking.status = "Cancelled";
    booking.cancellationReason = reason.trim();
    await booking.save();

    const hasVerifiedPayment = booking.paymentSummary.advanceStatus === "Paid";

    const populated = await populateBooking(booking._id);
    res.status(200).json({
      success: true,
      message: hasVerifiedPayment
        ? "Booking rejected successfully. The customer has a verified payment — please process the refund from the Payments section."
        : "Booking rejected successfully.",
      data: populated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/bookings/:id/complete
exports.completeEvent = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    if (booking.status !== "Confirmed") {
      return res.status(400).json({ success: false, message: "Only an approved (Confirmed) booking can be marked completed." });
    }

    booking.status = "Completed";
    booking.completedAt = new Date();
    await booking.save();

    const populated = await populateBooking(booking._id);
    res.status(200).json({
      success: true,
      message: "Event marked as completed. Please collect and verify the remaining balance payment from the Payments section.",
      data: populated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/bookings/:id/close
exports.closeBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    if (booking.status !== "Completed") {
      return res.status(400).json({ success: false, message: "Only a completed event can be closed." });
    }
    if (booking.paymentSummary.finalStatus !== "Paid") {
      return res.status(400).json({ success: false, message: "The balance payment must be verified before closing this booking." });
    }

    booking.status = "Closed";
    booking.closedAt = new Date();
    await booking.save();

    const populated = await populateBooking(booking._id);
    res.status(200).json({
      success: true,
      message: "Booking closed successfully. This booking has been completed and archived.",
      data: populated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Shared populate helper — same shape your getAllBookings already uses
async function populateBooking(id) {
  return Booking.findById(id)
    .populate({
      path: "event",
      select: "eventName coverImage category",
      populate: { path: "category", select: "categoryName" },
    })
    .populate("package", "packageName finalPrice")
    .populate("extraServices.service", "serviceName")
    .populate("client", "clientId fullName email phone");
}

// GET - client dashboard "My Bookings"
exports.getClientBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ client: req.params.clientId })
      .populate({
        path: "event",
        select: "eventName coverImage category",
        populate: { path: "category", select: "categoryName" },
      })
      .populate("package", "packageName finalPrice")
      .populate("extraServices.service", "serviceName")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET - single booking, used by the client's payment page
// GET - single booking, used by the client's payment page
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate({
        path: "event",
        select: "eventName coverImage category",
        populate: { path: "category", select: "categoryName" },
      })
      .populate("client", "clientId fullName email phone");

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (!booking.paymentSummary) {
      booking.paymentSummary = {
        advanceAmount: Math.round(booking.totalAmount * 0.5),
        balanceAmount: booking.totalAmount - Math.round(booking.totalAmount * 0.5),
        advanceStatus: "Not Paid",
        finalStatus: "Not Paid",
      };
      await booking.save();
    }

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/bookings/:id/cancel — admin cancels a Confirmed event before it happens
exports.cancelEvent = async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason || !reason.trim()) {
      return res.status(400).json({ success: false, message: "A reason is required to cancel this event." });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    if (booking.status !== "Confirmed") {
      return res.status(400).json({ success: false, message: "Only a confirmed event can be cancelled this way." });
    }

    booking.status = "Cancelled";
    booking.cancellationReason = reason.trim();
    await booking.save();

    const hasVerifiedAdvance = booking.paymentSummary.advanceStatus === "Paid";

    const populated = await populateBooking(booking._id);
    res.status(200).json({
      success: true,
      message: hasVerifiedAdvance
        ? "Event cancelled successfully. The customer has a verified advance payment — please process the refund from the Payments section."
        : "Event cancelled successfully.",
      data: populated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/bookings/upcoming/list — public, used by the homepage carousel.
// Only returns non-sensitive fields (no client name/phone/email).
exports.getUpcomingBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      status: { $in: ["Confirmed", "ReadyForApproval"] },
      eventDate: { $gte: new Date() },
    })
      .select("eventDate startTime endTime city venueName event")
      .populate({
        path: "event",
        select: "eventName coverImage category",
        populate: { path: "category", select: "categoryName" },
      })
      .sort({ eventDate: 1 })
      .limit(6);

    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};