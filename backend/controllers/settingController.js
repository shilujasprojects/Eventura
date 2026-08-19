const bcrypt = require("bcryptjs");
const Settings = require("../models/Settings");
// no Admin import — account now lives inside Settings, no login/auth for now

const DEFAULT_SETTINGS = {
  account: { adminName: "", email: "", password: "" },
  business: {
    companyName: "",
    contactPhone: "",
    supportEmail: "",
    officeAddress: "",
    description: "",
    gstNumber: "",
  },
  system: {
    advanceDepositPercentage: 50,
    serviceTaxPercentage: 18,
    minimumBookingMarginDays: 7,
    autoApproveBookings: false,
    configured: false,
  },
};

// These limits should match the ones in the frontend's ManageSettings.jsx —
// keeping both in sync means a request that passes the UI also passes here.
const ADMIN_NAME_MIN = 3;
const ADMIN_NAME_MAX = 50;
const COMPANY_NAME_MIN = 2;
const COMPANY_NAME_MAX = 100;
const OFFICE_ADDRESS_MIN = 10;
const OFFICE_ADDRESS_MAX = 300;
const DESCRIPTION_MIN = 20;
const DESCRIPTION_MAX = 500;

const GST_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[0-9]{10,15}$/;

// Helper: there should only ever be ONE settings document.
// This fetches it, creating it with defaults if it doesn't exist yet.
const getOrCreateSettingsDoc = async () => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create(DEFAULT_SETTINGS);
  }
  return settings;
};

// GET /api/settings
const getSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettingsDoc();

    res.status(200).json({
      success: true,
      data: {
        account: {
          adminName: settings.account.adminName,
          email: settings.account.email,
          hasPassword: Boolean(settings.account.password),
        },
        business: settings.business,
        system: settings.system,
        organizer: settings.organizer,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load settings",
      error: error.message,
    });
  }
};

// GET /api/settings/booking-config — public, used by the client-facing
// booking flow (BookNow page). Only exposes the three numbers that flow
// actually needs — never the admin email, password hash, GST number, etc.
const getBookingConfig = async (req, res) => {
  try {
    const settings = await getOrCreateSettingsDoc();
    const { minimumBookingMarginDays, advanceDepositPercentage, serviceTaxPercentage } = settings.system;

    res.status(200).json({
      success: true,
      data: { minimumBookingMarginDays, advanceDepositPercentage, serviceTaxPercentage },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load booking configuration",
      error: error.message,
    });
  }
};

// PUT /api/settings/business
const updateBusinessSettings = async (req, res) => {
  try {
    const { companyName, contactPhone, supportEmail, officeAddress, description, gstNumber } = req.body;

    const trimmedCompany = (companyName || "").trim();
    const trimmedAddress = (officeAddress || "").trim();
    const trimmedDescription = (description || "").trim();

    if (!trimmedCompany) {
      return res.status(400).json({ success: false, message: "Company name is required" });
    }
    if (trimmedCompany.length < COMPANY_NAME_MIN || trimmedCompany.length > COMPANY_NAME_MAX) {
      return res.status(400).json({
        success: false,
        message: `Company name must be between ${COMPANY_NAME_MIN} and ${COMPANY_NAME_MAX} characters`,
      });
    }
    if (!EMAIL_REGEX.test(supportEmail || "")) {
      return res.status(400).json({ success: false, message: "Please enter a valid support email" });
    }
    if (!PHONE_REGEX.test(contactPhone || "")) {
      return res.status(400).json({ success: false, message: "Please enter a valid contact phone number" });
    }
    if (!GST_REGEX.test((gstNumber || "").toUpperCase())) {
      return res.status(400).json({ success: false, message: "GSTIN format is invalid (e.g. 32AAAAE1234F1Z1)" });
    }
    if (!trimmedAddress) {
      return res.status(400).json({ success: false, message: "Office address is required" });
    }
    if (trimmedAddress.length < OFFICE_ADDRESS_MIN || trimmedAddress.length > OFFICE_ADDRESS_MAX) {
      return res.status(400).json({
        success: false,
        message: `Office address must be between ${OFFICE_ADDRESS_MIN} and ${OFFICE_ADDRESS_MAX} characters`,
      });
    }
    if (!trimmedDescription) {
      return res.status(400).json({ success: false, message: "A short business description is required" });
    }
    if (trimmedDescription.length < DESCRIPTION_MIN || trimmedDescription.length > DESCRIPTION_MAX) {
      return res.status(400).json({
        success: false,
        message: `Description must be between ${DESCRIPTION_MIN} and ${DESCRIPTION_MAX} characters`,
      });
    }

    const settings = await getOrCreateSettingsDoc();
    const isFirstTime = !settings.business.companyName?.trim();

    settings.business = {
      companyName: trimmedCompany,
      contactPhone: contactPhone.trim(),
      supportEmail: supportEmail.trim(),
      officeAddress: trimmedAddress,
      description: trimmedDescription,
      gstNumber: gstNumber.toUpperCase(),
    };
    await settings.save();

    res.status(200).json({
      success: true,
      message: isFirstTime ? "Business profile created successfully" : "Business profile updated successfully",
      data: settings.business,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update business settings", error: error.message });
  }
};

// PUT /api/settings/system
const updateSystemSettings = async (req, res) => {
  try {
    const { advanceDepositPercentage, serviceTaxPercentage, minimumBookingMarginDays, autoApproveBookings } = req.body;

    const deposit = Number(advanceDepositPercentage);
    const tax = Number(serviceTaxPercentage);
    const marginDays = Number(minimumBookingMarginDays);

    if (Number.isNaN(deposit) || !Number.isInteger(deposit)) {
      return res.status(400).json({ success: false, message: "Advance deposit must be a whole number" });
    }
    if (deposit < 10 || deposit > 100) {
      return res.status(400).json({ success: false, message: "Advance deposit must be between 10% and 100%" });
    }
    if (Number.isNaN(tax) || tax < 0 || tax > 28) {
      return res.status(400).json({ success: false, message: "Service GST rate must be between 0% and 28%" });
    }
    if (Number.isNaN(marginDays) || !Number.isInteger(marginDays)) {
      return res.status(400).json({ success: false, message: "Minimum booking margin must be a whole number of days" });
    }
    if (marginDays < 1) {
      return res.status(400).json({ success: false, message: "Minimum booking margin must be at least 1 day" });
    }

    const settings = await getOrCreateSettingsDoc();
    const isFirstTime = !settings.system.configured;

    settings.system = {
      advanceDepositPercentage: deposit,
      serviceTaxPercentage: tax,
      minimumBookingMarginDays: marginDays,
      autoApproveBookings: Boolean(autoApproveBookings),
      configured: true,
    };
    await settings.save();

    res.status(200).json({
      success: true,
      message: isFirstTime ? "System preferences created successfully" : "System preferences updated successfully",
      data: settings.system,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to save system settings", error: error.message });
  }
};

// PUT /api/settings/account
const updateAccountProfile = async (req, res) => {
  try {
    const { adminName, email } = req.body;
    const trimmedName = (adminName || "").trim();

    if (!trimmedName) {
      return res.status(400).json({ success: false, message: "Admin name is required" });
    }
    if (trimmedName.length < ADMIN_NAME_MIN || trimmedName.length > ADMIN_NAME_MAX) {
      return res.status(400).json({
        success: false,
        message: `Admin name must be between ${ADMIN_NAME_MIN} and ${ADMIN_NAME_MAX} characters`,
      });
    }
    if (!EMAIL_REGEX.test(email || "")) {
      return res.status(400).json({ success: false, message: "Please enter a valid email address" });
    }

    const settings = await getOrCreateSettingsDoc();
    const isFirstTime = !settings.account.adminName?.trim();

    settings.account.adminName = trimmedName;
    settings.account.email = email.trim().toLowerCase();
    await settings.save();

    res.status(200).json({
      success: true,
      message: isFirstTime ? "Admin profile created successfully" : "Admin profile updated successfully",
      data: { adminName: settings.account.adminName, email: settings.account.email },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update admin profile", error: error.message });
  }
};

// PUT /api/settings/account/password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ success: false, message: "New password is required" });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: "New password must be at least 8 characters long" });
    }
    if (!/[A-Za-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message: "New password must include at least one letter and one number",
      });
    }

    const settings = await getOrCreateSettingsDoc();

    // If a password already exists, verify it before allowing a change.
    // If none exists yet (first-ever save), skip the check and just set it.
    if (settings.account.password) {
      if (!currentPassword) {
        return res.status(400).json({ success: false, message: "Current password is required" });
      }
      const isMatch = await bcrypt.compare(currentPassword, settings.account.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: "Current password is incorrect" });
      }

      const isSamePassword = await bcrypt.compare(newPassword, settings.account.password);
      if (isSamePassword) {
        return res.status(400).json({
          success: false,
          message: "New password must be different from the current password",
        });
      }
    }

    const salt = await bcrypt.genSalt(10);
    settings.account.password = await bcrypt.hash(newPassword, salt);
    await settings.save();

    res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to change password", error: error.message });
  }
};

//  this new function to handle Organizer updates
const updateOrganizerProfile = async (req, res) => {
  try {
    const { name, title, phone, website } = req.body;

    // Validation
    if (!name?.trim()) return res.status(400).json({ success: false, message: "Organizer name is required" });
    if (!title?.trim()) return res.status(400).json({ success: false, message: "Professional title is required" });
    if (!PHONE_REGEX.test(phone || "")) return res.status(400).json({ success: false, message: "Enter a valid phone number" });

    const settings = await getOrCreateSettingsDoc();

    settings.organizer.name = name.trim();
    settings.organizer.title = title.trim();
    settings.organizer.phone = phone.trim();
    settings.organizer.website = website?.trim() || "";

    // If a file was uploaded via Multer, save the path
    if (req.file) {
      // Assuming you serve the uploads folder statically in server.js
      settings.organizer.profileImage = `/uploads/${req.file.filename}`;
    }

    await settings.save();

    res.status(200).json({
      success: true,
      message: "Organizer profile updated successfully",
      data: settings.organizer,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update organizer profile", error: error.message });
  }
};

// Don't forget to export it!
module.exports = {
  getSettings,
  getBookingConfig, // NEW
  updateBusinessSettings,
  updateSystemSettings,
  updateAccountProfile,
  changePassword,
  updateOrganizerProfile,
};