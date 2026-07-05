const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();  // creates the Express server

app.use(cors());
app.use(express.json());   // This middleware allows Express to read JSON data from request bodies.

mongoose
  .connect("mongodb://localhost:27017/eventura")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error : ", err));

app.use('/api/category', require('./routers/categoryRoute'));
app.use("/api/vendors", require('./routers/vendorRoutes'));
app.use('/api/services', require('./routers/serviceRoutes'));
app.use('/api/packages', require('./routers/packageRoute'));

app.use("/uploads", express.static("uploads"));   // Used to serve static files like images; makes the uploads folder publicly accessible

app.listen(5000, () => console.log('Server is running on Port : 5000 '));