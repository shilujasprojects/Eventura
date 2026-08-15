const Booking = require("../models/Booking");
const Client = require("../models/Client");
const Testimonial = require("../models/Testimonial");
const Notification = require("../models/Notification");
const Inquiry = require("../models/Inquiry");
const Transaction = require("../models/Transaction");

function calcChange(current, previous) {
  if (previous === 0) {
    return { text: current > 0 ? "+100% vs last month" : "No change vs last month", isUp: current >= 0 };
  }
  const percent = ((current - previous) / previous) * 100;
  return {
    text: `${percent >= 0 ? "+" : ""}${percent.toFixed(1)}% vs last month`,
    isUp: percent >= 0,
  };
}

// GET /api/dashboard/stats — everything the admin dashboard cards need, in one call
exports.getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const nonCancelled = { status: { $ne: "Cancelled" } };

    const thisMonthBookings = await Booking.find({
      ...nonCancelled,
      createdAt: { $gte: startOfThisMonth, $lt: startOfNextMonth },
    });
    const lastMonthBookings = await Booking.find({
      ...nonCancelled,
      createdAt: { $gte: startOfLastMonth, $lt: startOfThisMonth },
    });

    const totalBookings = await Booking.countDocuments(nonCancelled);
    const revenueThisMonth = thisMonthBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const revenueLastMonth = lastMonthBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const revenueChange = calcChange(revenueThisMonth, revenueLastMonth);
    const bookingsChange = calcChange(thisMonthBookings.length, lastMonthBookings.length);

    const activeClients = await Client.countDocuments({ status: "Active" });
    const newClientsThisWeek = await Client.countDocuments({
      createdAt: { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) },
    });

    const testimonials = await Testimonial.find().select("rating");
    const avgRating = testimonials.length
      ? testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length
      : 0;

    const upcomingEvents = await Booking.find({
      eventDate: { $gte: now },
      status: { $in: ["Pending", "ReadyForApproval", "Confirmed"] },
    })
      .populate("event", "eventName")
      .populate("client", "fullName")
      .sort({ eventDate: 1 })
      .limit(5)
      .select("bookingId event client eventDate city status");

    // Only urgent + not-yet-dismissed notifications show up as dashboard alerts
    const alerts = await Notification.find({ priority: "urgent", isDismissed: false })
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalBookings,
          bookingsChange: bookingsChange.text,
          bookingsUp: bookingsChange.isUp,
          revenueThisMonth,
          revenueChange: revenueChange.text,
          revenueUp: revenueChange.isUp,
          activeClients,
          newClientsThisWeek,
          clientRating: Number(avgRating.toFixed(1)),
        },
        upcomingEvents: upcomingEvents.map((b) => ({
          id: b.bookingId,
          client: b.client?.fullName || "—",
          event: b.event?.eventName || "Event",
          date: new Date(b.eventDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
          location: b.city,
          status: b.status,
        })),
        alerts,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// sidebar badge counter 


// GET /api/dashboard/badge-counts
// Single lightweight endpoint the sidebar polls to show live counts.
// Each number represents "items needing admin attention" — not just
// a raw total — so the badges stay meaningful instead of always-on.
exports.getBadgeCounts = async (req, res) => {
  try {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
 
    const [bookingsNeedingApproval, newClients, newInquiries, pendingPayments] =
      await Promise.all([
        Booking.countDocuments({ status: "ReadyForApproval" }),
        Client.countDocuments({ createdAt: { $gte: oneDayAgo } }),
        Inquiry.countDocuments({ status: "New" }),
        Transaction.countDocuments({ status: "Pending" }),
      ]);
 
    res.status(200).json({
      success: true,
      data: {
        bookings: bookingsNeedingApproval,
        clients: newClients,
        inquiries: newInquiries,
        payments: pendingPayments,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
 
// GET /api/dashboard/search?q=keyword
// Grouped Global Search for the Admin Navbar
exports.globalSearch = async (req, res) => {
  try {
    const { q } = req.query;

    // Return empty arrays if the search query is too short or empty
    if (!q || q.trim().length < 2) {
      return res.status(200).json({
        success: true,
        data: { clients: [], bookings: [], transactions: [], inquiries: [] },
      });
    }

    // Create a case-insensitive regex for the search term
    const searchRegex = new RegExp(q.trim(), "i");

    // Run all database queries concurrently for maximum speed
    const [clients, bookings, transactions, inquiries] = await Promise.all([
      // 1. Search Clients by ID, Name, Email, or Phone
      Client.find({
        $or: [
          { clientId: searchRegex },
          { fullName: searchRegex },
          { email: searchRegex },
          { phone: searchRegex },
        ],
      })
        .select("clientId fullName email phone status")
        .limit(5),

      // 2. Search Bookings by ID, Client Name, Email, Phone, or City
      Booking.find({
        $or: [
          { bookingId: searchRegex },
          { fullName: searchRegex },
          { email: searchRegex },
          { phone: searchRegex },
          { city: searchRegex },
        ],
      })
        .select("bookingId fullName eventDate city status totalAmount")
        .limit(5),

      // 3. Search Transactions by ID or Bank Reference Number
      Transaction.find({
        $or: [{ transactionId: searchRegex }, { referenceNumber: searchRegex }],
      })
        .select("transactionId amount method paymentStage status referenceNumber")
        .limit(5),

      // 4. Search Inquiries by Ticket ID, Name, Email, or Subject
      Inquiry.find({
        $or: [
          { ticketId: searchRegex },
          { clientName: searchRegex },
          { email: searchRegex },
          { subject: searchRegex },
        ],
      })
        .select("ticketId clientName subject status")
        .limit(5),
    ]);

    // Return categorized results
    res.status(200).json({
      success: true,
      data: {
        clients,
        bookings,
        transactions,
        inquiries,
      },
    });
  } catch (error) {
    console.error("Global Search Error:", error);
    res.status(500).json({ success: false, message: "Search failed" });
  }
};