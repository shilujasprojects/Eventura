// controllers/authController.js
const jwt = require("jsonwebtoken");
const Client = require("../models/Client");
const Settings = require("../models/Settings");
const bcrypt = require("bcryptjs");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[6-9]\d{9}$/;

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const register = async (req, res) => {
  try {
    let { name, email, phone, password } = req.body;
    name = (name || "").trim();
    email = (email || "").trim().toLowerCase();
    phone = (phone || "").trim();

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email address" });
    }
    if (!PHONE_REGEX.test(phone)) {
      return res.status(400).json({ success: false, message: "Please enter a valid 10-digit phone number" });
    }
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
    }

    let client = await Client.findOne({ email });
    if (client) {
      return res.status(400).json({ success: false, message: "An account with this email already exists" });
    }

    client = await Client.create({ fullName: name, email, phone, password });
    client.password = undefined;

    const token = generateToken(client._id, "client");

    res.status(201).json({ success: true, role: "client", user: client, token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    email = (email || "").trim().toLowerCase();

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    // 1. Check if user is Admin
    const settings = await Settings.findOne();
    if (settings?.account?.email && settings.account.email.toLowerCase() === email) {
      
      // FIXED: Use bcrypt to compare the hashed admin password
      let isAdminMatch = false;
      if (settings.account.password === password) {
         // Fallback just in case the password in DB isn't hashed yet
         isAdminMatch = true; 
      } else {
         isAdminMatch = await bcrypt.compare(password, settings.account.password);
      }

      if (isAdminMatch) {
        const token = generateToken(settings._id, "admin");
        return res.status(200).json({
          success: true,
          role: "admin",
          user: { name: settings.account.adminName, email: settings.account.email },
          token,
        });
      }
    }

    // 2. Check if user is Client
    const client = await Client.findOne({ email });
    if (client) {
      const isMatch = await bcrypt.compare(password, client.password);
      if (isMatch) {
        client.password = undefined;
        const token = generateToken(client._id, "client");
        return res.status(200).json({ success: true, role: "client", user: client, token });
      }
    }

    // 3. Invalid credentials
    return res.status(400).json({ success: false, message: "Invalid email or password" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { register, login };