const Transaction = require("../models/Transaction");
const Booking = require("../models/Booking");
const createNotification = require("../utils/createNotification");

// POST /api/payments/submit — client submits proof of an advance or final payment
exports.submitPayment = async (req, res) => {
  try {
    const { bookingId, paymentStage, method, referenceNumber } = req.body;
    const receiptUrl = req.file ? req.file.filename : null;

    if (!bookingId || !paymentStage || !method || !referenceNumber || !receiptUrl) {
      return res.status(400).json({ success: false, message: "All fields, including the receipt, are required." });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (booking.status === "Cancelled") {
      return res.status(400).json({ success: false, message: "This booking has been cancelled and no longer accepts payments." });
    }

    const statusField = paymentStage === "Advance" ? "advanceStatus" : "finalStatus";
    const currentStatus = booking.paymentSummary[statusField];

    if (currentStatus === "Paid") {
      return res.status(400).json({ success: false, message: `${paymentStage} payment is already completed.` });
    }
    if (currentStatus === "Pending") {
      return res.status(400).json({ success: false, message: `${paymentStage} payment is already under review.` });
    }
    // "Not Paid" and "Failed" can both retry — a fresh attempt after a
    // rejected one is normal and expected here.

    if (paymentStage === "Final") {
      if (booking.paymentSummary.advanceStatus !== "Paid") {
        return res.status(400).json({ success: false, message: "Advance payment must be completed first." });
      }
      if (booking.status !== "Completed") {
        return res.status(400).json({ success: false, message: "Final payment unlocks only after the event is marked Completed." });
      }
    }

    const amount = paymentStage === "Advance"
      ? booking.paymentSummary.advanceAmount
      : booking.paymentSummary.balanceAmount;

    const transaction = await Transaction.create({
      booking: booking._id,
      client: booking.client,
      paymentStage,
      amount,
      method,
      referenceNumber,
      receiptUrl,
      status: "Pending",
    });

    booking.paymentSummary[statusField] = "Pending";
    await booking.save();

    // NEW — this is the urgent dashboard alert
    await createNotification({
      type: "payment",
      priority: "urgent",
      message: `Manual ${method} payment receipt uploaded by ${booking.fullName} for verification.`,
      link: "/admin/payments",
    });

    res.status(201).json({ success: true, message: "Payment submitted. We'll verify it shortly.", data: transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/payments — admin, list all transactions
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate("booking", "bookingId eventDate totalAmount status")
      .populate("client", "clientId fullName email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.verifyTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ success: false, message: "Transaction not found" });
    if (transaction.status !== "Pending") {
      return res.status(400).json({ success: false, message: "Only pending payments can be verified." });
    }

    transaction.status = "Success";
    transaction.reviewedAt = new Date();
    await transaction.save();

    const booking = await Booking.findById(transaction.booking);
    const statusField = transaction.paymentStage === "Advance" ? "advanceStatus" : "finalStatus";
    booking.paymentSummary[statusField] = "Paid";

    let message;

    if (transaction.paymentStage === "Advance") {
      // Only auto-advance the booking if it hasn't already been moved
      // (e.g. re-verifying after some edge case) — Pending is the only
      // state advance verification is expected to fire from.
      if (booking.status === "Pending") {
        booking.status = "ReadyForApproval";
      }
      message = "Advance payment verified successfully. The booking is now ready for approval — please review it in the Bookings section.";
    } else {
      message = "Balance payment verified successfully. The booking is now fully paid and ready to be closed.";
    }

    await booking.save();

    res.status(200).json({ success: true, message, data: transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.rejectTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ success: false, message: "Transaction not found" });
    if (transaction.status !== "Pending") {
      return res.status(400).json({ success: false, message: "Only pending payments can be rejected." });
    }

    transaction.status = "Failed";
    transaction.reviewedAt = new Date();
    await transaction.save();

    const booking = await Booking.findById(transaction.booking);
    const statusField = transaction.paymentStage === "Advance" ? "advanceStatus" : "finalStatus";
    booking.paymentSummary[statusField] = "Failed";
    // Booking status itself is untouched — it stays Pending / Completed
    // so the client can simply re-upload a receipt and retry.
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Payment verification failed. The customer must upload a new payment receipt.",
      data: transaction,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// GET /api/payments/client/:clientId — client-side payment history
exports.getClientTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ client: req.params.clientId })
      .populate("booking", "bookingId eventDate totalAmount")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.refundTransaction = async (req, res) => {
  try {
    const { reason, refundAmount } = req.body;

    if (!reason || !reason.trim()) {
      return res.status(400).json({ success: false, message: "A reason is required to process a refund." });
    }

    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ success: false, message: "Transaction not found" });
    if (transaction.status !== "Success") {
      return res.status(400).json({ success: false, message: "Only successful payments can be refunded." });
    }

    const amount = Number(refundAmount);
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Enter a valid refund amount." });
    }
    if (amount > transaction.amount) {
      return res.status(400).json({
        success: false,
        message: `Refund amount can't exceed the paid amount (₹${transaction.amount.toLocaleString()}).`,
      });
    }

    const booking = await Booking.findById(transaction.booking);
    if (!booking) return res.status(404).json({ success: false, message: "Associated booking not found" });

    // Once a booking is Closed, it's a fully reconciled, archived record.
    // Refunds after that point should be a deliberate manual correction,
    // not something that happens through the standard refund flow.
    if (booking.status === "Closed") {
      return res.status(400).json({
        success: false,
        message: "This booking is already closed and archived. Refunds are not permitted on closed bookings.",
      });
    }

    const isFullRefund = amount === transaction.amount;

    transaction.status = "Refunded";
    transaction.refundedAmount = amount;
    transaction.refundReason = reason.trim();
    await transaction.save();

    const statusField = transaction.paymentStage === "Advance" ? "advanceStatus" : "finalStatus";
    booking.paymentSummary[statusField] = isFullRefund ? "Refunded" : "Partially Refunded";

    // Only a FULL advance refund cancels the booking — the event hasn't
    // happened yet, so cancelling is correct. A partial advance refund is
    // just a price correction and shouldn't cancel anything. A final/balance
    // refund (full or partial) happens after the event already took place,
    // so the booking's lifecycle status stays untouched either way.
    let message;

    if (transaction.paymentStage === "Advance") {
      if (isFullRefund) {
        booking.status = "Cancelled";
        booking.cancellationReason = reason.trim();
        message = "Refund processed successfully. The booking has been cancelled.";
      } else {
        message = `Partial refund of ₹${amount.toLocaleString()} processed successfully.`;
      }
    } else {
      message = isFullRefund
        ? "Refund processed successfully. The event record remains unchanged since it already took place."
        : `Partial refund of ₹${amount.toLocaleString()} processed successfully. The event record remains unchanged.`;
    }

    await booking.save();

    res.status(200).json({ success: true, message, data: transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};