const ExcelJS = require("exceljs");
const Booking = require("../models/Booking");
const Client = require("../models/Client");
const Vendor = require("../models/Vendor");

// Works out { start, end } from the request. The frontend always sends
// startDate/endDate (computed from whichever preset or custom range the
// user picked) — this is what makes "Last Month", "Last Year", or any
// arbitrary custom window work without special-casing each one here.
// If nothing is sent, we fall back to "this month" so the endpoint still
// works on its own.
function resolveDateRange(query) {
  const now = new Date();

  if (query.startDate && query.endDate) {
    const start = new Date(query.startDate);
    const end = new Date(query.endDate);
    end.setHours(23, 59, 59, 999); // make the end date inclusive
    return { start, end };
  }

  return {
    start: new Date(now.getFullYear(), now.getMonth(), 1),
    end: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999),
  };
}

// The comparison period is simply the same number of days, immediately
// before the selected range. Works identically whether the range is a
// week, a month, a year, or a custom 47-day stretch.
function getPreviousRange(start, end) {
  const durationMs = end.getTime() - start.getTime();
  const previousEnd = new Date(start.getTime() - 1);
  const previousStart = new Date(previousEnd.getTime() - durationMs);
  return { previousStart, previousEnd };
}

function calcChange(current, previous) {
  if (previous === 0) {
    return { change: current > 0 ? "+100%" : "0%", isUp: current >= 0 };
  }
  const percent = ((current - previous) / previous) * 100;
  return {
    change: `${percent >= 0 ? "+" : ""}${percent.toFixed(1)}%`,
    isUp: percent >= 0,
  };
}

// Splits the range into chart buckets: weekly if the range is short
// (a month or less), monthly if it's longer (e.g. a full year).
function buildChartBuckets(start, end, bookings) {
  const diffDays = (end - start) / (1000 * 60 * 60 * 24);
  const buckets = [];

  if (diffDays <= 45) {
    let cursor = new Date(start);
    let weekNum = 1;
    while (cursor < end) {
      const bucketStart = new Date(cursor);
      const bucketEnd = new Date(cursor);
      bucketEnd.setDate(bucketEnd.getDate() + 7);
      const actualEnd = bucketEnd < end ? bucketEnd : end;

      const value = bookings
        .filter((b) => b.createdAt >= bucketStart && b.createdAt < actualEnd)
        .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

      buckets.push({ label: `Week ${weekNum}`, value });
      cursor = actualEnd;
      weekNum++;
    }
  } else {
    let cursor = new Date(start.getFullYear(), start.getMonth(), 1);
    while (cursor < end) {
      const bucketStart = new Date(cursor);
      const bucketEnd = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
      const actualEnd = bucketEnd < end ? bucketEnd : end;

      const value = bookings
        .filter((b) => b.createdAt >= bucketStart && b.createdAt < actualEnd)
        .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

      buckets.push({
        label: bucketStart.toLocaleString("default", { month: "short", year: "2-digit" }),
        value,
      });
      cursor = bucketEnd;
    }
  }

  return buckets;
}

// Shared: fetch bookings for the selected range + the comparison range,
// used by both the summary endpoint and the Excel export.
async function loadBookingsForRange(start, end, previousStart, previousEnd) {
  const allBookings = await Booking.find({ status: { $ne: "Cancelled" } })
    .populate({
      path: "event",
      select: "eventName category",
      populate: { path: "category", select: "categoryName" },
    })
    .populate("client", "fullName email")
    .select("totalAmount createdAt eventDate event client bookingId status");

  const currentBookings = allBookings.filter((b) => b.createdAt >= start && b.createdAt < end);
  const previousBookings = allBookings.filter(
    (b) => b.createdAt >= previousStart && b.createdAt < previousEnd
  );

  return { allBookings, currentBookings, previousBookings };
}

// GET /api/reports?startDate=2026-06-01&endDate=2026-06-30
exports.getReportsSummary = async (req, res) => {
  try {
    const { start, end } = resolveDateRange(req.query);
    const { previousStart, previousEnd } = getPreviousRange(start, end);

    const { allBookings, currentBookings, previousBookings } = await loadBookingsForRange(
      start, end, previousStart, previousEnd
    );

    // --- Revenue ---
    const currentRevenue = currentBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const previousRevenue = previousBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const revenueChange = calcChange(currentRevenue, previousRevenue);

    // --- Bookings count ---
    const bookingsChange = calcChange(currentBookings.length, previousBookings.length);

    // --- New clients registered in range ---
    const allClients = await Client.find().select("createdAt");
    const currentClients = allClients.filter((c) => c.createdAt >= start && c.createdAt < end).length;
    const previousClients = allClients.filter(
      (c) => c.createdAt >= previousStart && c.createdAt < previousEnd
    ).length;
    const clientsChange = calcChange(currentClients, previousClients);

    // --- Active vendors (snapshot, not range-based) ---
    const vendorsCount = await Vendor.countDocuments({ status: "Active" });

    // --- Chart ---
    const chartRevenue = buildChartBuckets(start, end, currentBookings);

    // --- Category split, current range ---
    const categoryMap = {};
    currentBookings.forEach((b) => {
      const name = b.event?.category?.categoryName || "Uncategorized";
      if (!categoryMap[name]) categoryMap[name] = { name, revenue: 0, count: 0 };
      categoryMap[name].revenue += b.totalAmount || 0;
      categoryMap[name].count += 1;
    });
    const categoryShare = Object.values(categoryMap)
      .map((cat) => ({
        ...cat,
        percentage: currentRevenue > 0 ? Math.round((cat.revenue / currentRevenue) * 100) : 0,
      }))
      .sort((a, b) => b.revenue - a.revenue);

    // --- Top categories, all-time ---
    const allTimeMap = {};
    allBookings.forEach((b) => {
      const name = b.event?.category?.categoryName || "Uncategorized";
      if (!allTimeMap[name]) allTimeMap[name] = { categoryName: name, totalBookings: 0, totalRevenue: 0 };
      allTimeMap[name].totalBookings += 1;
      allTimeMap[name].totalRevenue += b.totalAmount || 0;
    });
    const topCategories = Object.values(allTimeMap)
      .map((cat) => ({ ...cat, avgBookingValue: Math.round(cat.totalRevenue / cat.totalBookings) }))
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 5);

    res.status(200).json({
      success: true,
      data: {
        rangeLabel: `${start.toLocaleDateString()} – ${end.toLocaleDateString()}`,
        revenue: currentRevenue,
        revenueChange: revenueChange.change,
        revenueUp: revenueChange.isUp,
        bookings: currentBookings.length,
        bookingsChange: bookingsChange.change,
        bookingsUp: bookingsChange.isUp,
        clients: currentClients,
        clientsChange: clientsChange.change,
        clientsUp: clientsChange.isUp,
        vendors: vendorsCount,
        chartRevenue,
        categoryShare,
        topCategories,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/reports/export?startDate=...&endDate=...
// Generates a real .xlsx workbook: a Summary sheet + a Bookings detail sheet.
exports.exportReportsExcel = async (req, res) => {
  try {
    const { start, end } = resolveDateRange(req.query);
    const { previousStart, previousEnd } = getPreviousRange(start, end);
    const { currentBookings } = await loadBookingsForRange(start, end, previousStart, previousEnd);

    const totalRevenue = currentBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

    const categoryMap = {};
    currentBookings.forEach((b) => {
      const name = b.event?.category?.categoryName || "Uncategorized";
      if (!categoryMap[name]) categoryMap[name] = { name, revenue: 0, count: 0 };
      categoryMap[name].revenue += b.totalAmount || 0;
      categoryMap[name].count += 1;
    });

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Eventura";
    workbook.created = new Date();

    // ---------- Summary sheet ----------
    const summarySheet = workbook.addWorksheet("Summary");
    summarySheet.columns = [{ width: 28 }, { width: 22 }];

    summarySheet.addRow(["Eventura — Performance Report"]).font = { bold: true, size: 14 };
    summarySheet.addRow([`Period: ${start.toLocaleDateString()} – ${end.toLocaleDateString()}`]);
    summarySheet.addRow([]);

    const summaryHeaderRow = summarySheet.addRow(["Metric", "Value"]);
    summaryHeaderRow.font = { bold: true };
    summaryHeaderRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF1D49B" } };

    summarySheet.addRow(["Total Revenue", totalRevenue]);
    summarySheet.addRow(["Total Bookings", currentBookings.length]);
    summarySheet.addRow([]);

    const categoryHeaderRow = summarySheet.addRow(["Category", "Revenue", "Bookings"]);
    categoryHeaderRow.font = { bold: true };
    Object.values(categoryMap).forEach((cat) => {
      summarySheet.addRow([cat.name, cat.revenue, cat.count]);
    });

    // ---------- Bookings detail sheet ----------
    const detailSheet = workbook.addWorksheet("Bookings Detail");
    detailSheet.columns = [
      { header: "Booking ID", key: "bookingId", width: 18 },
      { header: "Client", key: "client", width: 22 },
      { header: "Event", key: "event", width: 22 },
      { header: "Category", key: "category", width: 18 },
      { header: "Event Date", key: "eventDate", width: 14 },
      { header: "Amount (₹)", key: "amount", width: 14 },
      { header: "Status", key: "status", width: 14 },
    ];
    detailSheet.getRow(1).font = { bold: true };
    detailSheet.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF1D49B" } };

    currentBookings.forEach((b) => {
      detailSheet.addRow({
        bookingId: b.bookingId,
        client: b.client?.fullName || b.fullName,
        event: b.event?.eventName || "",
        category: b.event?.category?.categoryName || "",
        eventDate: new Date(b.eventDate).toLocaleDateString(),
        amount: b.totalAmount,
        status: b.status,
      });
    });

    const totalRow = detailSheet.addRow({ eventDate: "Total", amount: totalRevenue });
    totalRow.font = { bold: true };

    // Build the whole file into a buffer first, then send it in one go.
    // (Piping workbook.xlsx.write(res) directly and then calling res.end()
    // afterwards double-closes the stream and corrupts the file — this
    // avoids that entirely.)
    const buffer = await workbook.xlsx.writeBuffer();

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", `attachment; filename="eventura-report.xlsx"`);
    res.send(Buffer.from(buffer));
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};