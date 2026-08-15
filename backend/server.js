const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv")

const app = express();  // creates the Express server

dotenv.config();
app.use(cors());
app.use(express.json());   // This middleware allows Express to read JSON data from request bodies.



mongoose
  .connect("mongodb://localhost:27017/eventura")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error : ", err));

app.use("/api/auth", require("./routers/authRoutes"));
app.use('/api/category', require('./routers/categoryRoute'));
app.use("/api/vendors", require('./routers/vendorRoutes'));
app.use('/api/services', require('./routers/serviceRoutes'));
app.use('/api/packages', require('./routers/packageRoute'));
app.use('/api/events', require('./routers/eventRoute'));
app.use("/api/bookings", require("./routers/bookingRoutes"));
app.use("/api/inquiries", require("./routers/inquiryRoutes") );
app.use("/api/clients", require('./routers/clientRoute'));
app.use("/api/settings", require('./routers/settingRoutes'));
app.use('/api/banner', require('./routers/bannerRoutes'));
app.use('/api/faqs', require('./routers/faqRoutes'));
app.use('/api/testimonials', require('./routers/testimonialRoutes'));
app.use("/api/admin/clients", require("./routers/adminClientRoutes"));
app.use("/api/public/clients", require("./routers/publicClientRoutes"));
app.use("/api/payments", require("./routers/paymentRoutes"));
app.use("/api/reports", require("./routers/reportRoutes"));
app.use("/api/notifications", require("./routers/notificationRoutes"));
app.use("/api/dashboard", require("./routers/dashboardRoutes"));

app.use("/uploads", express.static("uploads"));   // Used to serve static files like images; makes the uploads folder publicly accessible

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on Port : ${PORT}`));