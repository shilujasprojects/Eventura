const Newsletter = require("../models/Newletter");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/newsletter/subscribe — public, no auth
exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !EMAIL_REGEX.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    let subscriber = await Newsletter.findOne({ email: normalizedEmail });

    if (subscriber) {
      if (subscriber.status === "Subscribed") {
        return res.status(409).json({
          success: false,
          message: "You're already subscribed to the Eventura Circle.",
        });
      }

      // Was Unsubscribed — reactivate the same document, never create a duplicate.
      subscriber.status = "Subscribed";
      subscriber.subscribedAt = new Date();
      await subscriber.save();

      return res.status(200).json({
        success: true,
        message: "Welcome back! You've been resubscribed to the Eventura Circle.",
        data: subscriber,
      });
    }

    subscriber = await Newsletter.create({ email: normalizedEmail });

    res.status(201).json({
      success: true,
      message: "You're subscribed to the Eventura Circle!",
      data: subscriber,
    });
  } catch (error) {
    // Guards against a race on the unique index if two requests land at once
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You're already subscribed to the Eventura Circle.",
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/newsletter — admin, supports ?search=&status=&page=&limit=
exports.getSubscribers = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (search) filter.email = { $regex: search.trim(), $options: "i" };
    if (status) filter.status = status;

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.max(parseInt(limit, 10) || 10, 1);

    const [subscribers, total, totalSubscribed] = await Promise.all([
      Newsletter.find(filter)
        .sort({ subscribedAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Newsletter.countDocuments(filter),
      Newsletter.countDocuments({ status: "Subscribed" }),
    ]);

    res.status(200).json({
      success: true,
      data: subscribers,
      total,
      totalSubscribed,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/newsletter/:id/status — admin
exports.updateSubscriberStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Subscribed", "Unsubscribed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be either Subscribed or Unsubscribed.",
      });
    }

    const subscriber = await Newsletter.findById(req.params.id);
    if (!subscriber) {
      return res.status(404).json({ success: false, message: "Subscriber not found." });
    }

    subscriber.status = status;
    await subscriber.save();

    res.status(200).json({
      success: true,
      message: "Subscriber status updated.",
      data: subscriber,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/newsletter/:id — admin
exports.deleteSubscriber = async (req, res) => {
  try {
    const subscriber = await Newsletter.findByIdAndDelete(req.params.id);
    if (!subscriber) {
      return res.status(404).json({ success: false, message: "Subscriber not found." });
    }
    res.status(200).json({ success: true, message: "Subscriber deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};