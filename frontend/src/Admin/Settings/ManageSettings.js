import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import {
  User,
  Building,
  Sliders,
  Save,
  Lock,
  Loader,
  Pencil,
  X,
  Eye,
  EyeOff,
} from "lucide-react";
import AdminLayout from "../../Pages/Admin/Layout/AdminLayout";
import "./Settings.css";

const API_BASE = "http://localhost:5000/api/settings";

const EMPTY_ACCOUNT = {
  adminName: "",
  email: "",
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};
const EMPTY_BUSINESS = {
  companyName: "",
  contactPhone: "",
  supportEmail: "",
  officeAddress: "",
  description: "", // NEW — "about our business", shown next to the address
  gstNumber: "",
};
// NOTE: numeric fields are empty strings, not 50/18/7 — those defaults only exist in the DB
// as a fallback. Until an admin has actually saved this tab, the UI shows it blank.
const EMPTY_SYSTEM = {
  advanceDepositPercentage: "",
  serviceTaxPercentage: "",
  minimumBookingMarginDays: "",
  autoApproveBookings: false,
  configured: false,
};

// Regex patterns used across the form validators below
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[0-9]{10,15}$/;
const GST_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

// Field length limits used by the validators below.
// Keep these in sync with the matching limits in settingController.js on the backend.
const ADMIN_NAME_MIN = 3;
const ADMIN_NAME_MAX = 50;
const COMPANY_NAME_MIN = 2;
const COMPANY_NAME_MAX = 100;
const OFFICE_ADDRESS_MIN = 10;
const OFFICE_ADDRESS_MAX = 300;
const DESCRIPTION_MIN = 20;
const DESCRIPTION_MAX = 500;

const ManageSettings = () => {
  const [activeTab, setActiveTab] = useState("Account");
  const [loading, setLoading] = useState(true);
  const [savingAccount, setSavingAccount] = useState(false);
  const [savingBusiness, setSavingBusiness] = useState(false);
  const [savingSystem, setSavingSystem] = useState(false);

  // Whether each card is unlocked for editing. All three follow the same rule:
  // start unlocked, then the fetch below locks a card if it already has saved data.
  const [isEditingAccount, setIsEditingAccount] = useState(true);
  const [isEditingBusiness, setIsEditingBusiness] = useState(true);
  const [isEditingSystem, setIsEditingSystem] = useState(true);

  const [accountForm, setAccountForm] = useState(EMPTY_ACCOUNT);
  const [businessForm, setBusinessForm] = useState(EMPTY_BUSINESS);
  const [systemForm, setSystemForm] = useState(EMPTY_SYSTEM);

  // Last-saved values, used to restore each form if the user cancels an edit
  const [savedAccount, setSavedAccount] = useState({
    adminName: "",
    email: "",
    hasPassword: false,
  });
  const [savedBusiness, setSavedBusiness] = useState(EMPTY_BUSINESS);
  const [savedSystem, setSavedSystem] = useState(EMPTY_SYSTEM);

  // Per-field error messages, keyed by field name, for each tab
  const [accountErrors, setAccountErrors] = useState({});
  const [businessErrors, setBusinessErrors] = useState({});
  const [systemErrors, setSystemErrors] = useState({});

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // Fetch current settings once when the page loads
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(API_BASE);
        const { account, business, system } = res.data.data;

        // Account: if the admin already has a saved name/email, lock the card
        // read-only. Otherwise leave it unlocked so it can be filled in directly.
        const hasSavedAccountData = Boolean(account?.adminName?.trim());
        setAccountForm((prev) => ({
          ...prev,
          adminName: account.adminName,
          email: account.email,
        }));
        setSavedAccount({
          adminName: account.adminName,
          email: account.email,
          hasPassword: account.hasPassword,
        });
        setIsEditingAccount(!hasSavedAccountData);

        // Business: same pattern, keyed off companyName. Fall back to "" for
        // description in case an older settings document doesn't have it yet.
        const hasSavedBusinessData = Boolean(business?.companyName?.trim());
        const normalizedBusiness = { ...business, description: business?.description || "" };
        setBusinessForm(normalizedBusiness);
        setSavedBusiness(normalizedBusiness);
        setIsEditingBusiness(!hasSavedBusinessData);

        // System: keyed off the explicit `configured` flag rather than the numeric
        // values themselves, since those always hold defaults (50/18/7) even before
        // an admin has manually saved anything.
        const hasSavedSystemData = Boolean(system?.configured);
        setSystemForm(hasSavedSystemData ? system : EMPTY_SYSTEM);
        setSavedSystem(hasSavedSystemData ? system : EMPTY_SYSTEM);
        setIsEditingSystem(!hasSavedSystemData);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load settings");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // ---------- Change handlers (update state immediately as the user types) ----------
  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    setAccountForm((prev) => ({ ...prev, [name]: value }));
    setAccountErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleBusinessChange = (e) => {
    const { name, value } = e.target;
    setBusinessForm((prev) => ({ ...prev, [name]: value }));
    setBusinessErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Numeric fields are kept as raw strings in state (not Number(value)) so the
  // input can actually be cleared/emptied by the user instead of snapping to 0.
  // Conversion to Number happens in validateSystem/saveSystemConfigs instead.
  const handleSystemChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSystemForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setSystemErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ---------- Validators (return an errors object; empty object = valid) ----------
  const validateAccount = () => {
    const errors = {};

    const trimmedName = accountForm.adminName.trim();
    if (!trimmedName) {
      errors.adminName = "Admin name is required";
    } else if (trimmedName.length < ADMIN_NAME_MIN || trimmedName.length > ADMIN_NAME_MAX) {
      errors.adminName = `Admin name must be between ${ADMIN_NAME_MIN} and ${ADMIN_NAME_MAX} characters`;
    }

    if (!accountForm.email.trim()) {
      errors.email = "Email is required";
    } else if (!EMAIL_REGEX.test(accountForm.email.trim())) {
      errors.email = "Enter a valid email address";
    }

    // Password fields are optional, but if the user touches any of them, all rules apply
    const wantsPasswordChange =
      accountForm.currentPassword ||
      accountForm.newPassword ||
      accountForm.confirmPassword;
    if (wantsPasswordChange) {
      if (savedAccount.hasPassword && !accountForm.currentPassword) {
        errors.currentPassword = "Current password is required";
      }
      if (!accountForm.newPassword) {
        errors.newPassword = "New password is required";
      } else if (accountForm.newPassword.length < 8) {
        errors.newPassword = "New password must be at least 8 characters";
      } else if (
        !/[A-Za-z]/.test(accountForm.newPassword) ||
        !/[0-9]/.test(accountForm.newPassword)
      ) {
        errors.newPassword = "New password must include at least one letter and one number";
      }
      if (
        accountForm.currentPassword &&
        accountForm.newPassword &&
        accountForm.currentPassword === accountForm.newPassword
      ) {
        errors.newPassword =
          "New password must be different from current password";
      }
      if (!accountForm.confirmPassword) {
        errors.confirmPassword = "Please confirm your new password";
      } else if (accountForm.newPassword !== accountForm.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }
    }
    return errors;
  };

  const validateBusiness = () => {
    const errors = {};

    const trimmedCompany = businessForm.companyName.trim();
    if (!trimmedCompany) {
      errors.companyName = "Company name is required";
    } else if (trimmedCompany.length < COMPANY_NAME_MIN || trimmedCompany.length > COMPANY_NAME_MAX) {
      errors.companyName = `Company name must be between ${COMPANY_NAME_MIN} and ${COMPANY_NAME_MAX} characters`;
    }

    if (!businessForm.contactPhone.trim()) {
      errors.contactPhone = "Contact phone is required";
    } else if (!PHONE_REGEX.test(businessForm.contactPhone.trim())) {
      errors.contactPhone = "Enter a valid phone number (10-15 digits)";
    }

    if (!businessForm.supportEmail.trim()) {
      errors.supportEmail = "Support email is required";
    } else if (!EMAIL_REGEX.test(businessForm.supportEmail.trim())) {
      errors.supportEmail = "Enter a valid support email";
    }

    const trimmedAddress = businessForm.officeAddress.trim();
    if (!trimmedAddress) {
      errors.officeAddress = "Office address is required";
    } else if (trimmedAddress.length < OFFICE_ADDRESS_MIN || trimmedAddress.length > OFFICE_ADDRESS_MAX) {
      errors.officeAddress = `Address must be between ${OFFICE_ADDRESS_MIN} and ${OFFICE_ADDRESS_MAX} characters`;
    }

    const trimmedDescription = (businessForm.description || "").trim();
    if (!trimmedDescription) {
      errors.description = "A short business description is required";
    } else if (trimmedDescription.length < DESCRIPTION_MIN || trimmedDescription.length > DESCRIPTION_MAX) {
      errors.description = `Description must be between ${DESCRIPTION_MIN} and ${DESCRIPTION_MAX} characters`;
    }

    if (!businessForm.gstNumber.trim()) {
      errors.gstNumber = "GST number is required";
    } else if (!GST_REGEX.test(businessForm.gstNumber.toUpperCase())) {
      errors.gstNumber = "Format must match 32AAAAE1234F1Z1";
    }

    return errors;
  };

  const validateSystem = () => {
    const errors = {};
    const {
      advanceDepositPercentage,
      serviceTaxPercentage,
      minimumBookingMarginDays,
    } = systemForm;
    const deposit = Number(advanceDepositPercentage);
    const tax = Number(serviceTaxPercentage);
    const marginDays = Number(minimumBookingMarginDays);

    if (advanceDepositPercentage === "" || Number.isNaN(deposit)) {
      errors.advanceDepositPercentage = "This field is required";
    } else if (!Number.isInteger(deposit)) {
      errors.advanceDepositPercentage = "Enter a whole number, no decimals";
    } else if (deposit < 10 || deposit > 100) {
      errors.advanceDepositPercentage = "Must be between 10 and 100";
    }

    if (serviceTaxPercentage === "" || Number.isNaN(tax)) {
      errors.serviceTaxPercentage = "This field is required";
    } else if (tax < 0 || tax > 28) {
      errors.serviceTaxPercentage = "Must be between 0 and 28";
    }

    if (minimumBookingMarginDays === "" || Number.isNaN(marginDays)) {
      errors.minimumBookingMarginDays = "This field is required";
    } else if (!Number.isInteger(marginDays)) {
      errors.minimumBookingMarginDays = "Enter a whole number of days";
    } else if (marginDays < 1) {
      errors.minimumBookingMarginDays = "Must be at least 1 day";
    }

    return errors;
  };

  // ---------- Account edit-mode controls ----------
  const startEditingAccount = () => {
    setIsEditingAccount(true);
  };

  const cancelEditingAccount = () => {
    // Throw away any unsaved changes and go back to read-only view
    setAccountForm({
      ...savedAccount,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setAccountErrors({});
    setShowPassword({ current: false, new: false, confirm: false });
    setIsEditingAccount(false);
  };

  // ---------- Business edit-mode controls ----------
  const startEditingBusiness = () => {
    setIsEditingBusiness(true);
  };

  const cancelEditingBusiness = () => {
    // Throw away any unsaved changes and go back to read-only view
    setBusinessForm(savedBusiness);
    setBusinessErrors({});
    setIsEditingBusiness(false);
  };

  // ---------- System edit-mode controls ----------
  const startEditingSystem = () => {
    setIsEditingSystem(true);
  };

  const cancelEditingSystem = () => {
    // Throw away any unsaved changes and go back to read-only view
    setSystemForm(savedSystem);
    setSystemErrors({});
    setIsEditingSystem(false);
  };

  // ---------- Submit handlers ----------
  const saveAccountSettings = async (e) => {
    e.preventDefault();
    const errors = validateAccount();
    setAccountErrors(errors);
    if (Object.keys(errors).length > 0) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    setSavingAccount(true);
    try {
      // 1. Update name/email
      await axios.put(`${API_BASE}/account`, {
        adminName: accountForm.adminName,
        email: accountForm.email,
      });

      // 2. Change password only if the user filled that section in
      if (accountForm.newPassword) {
        await axios.put(`${API_BASE}/account/password`, {
          currentPassword: accountForm.currentPassword,
          newPassword: accountForm.newPassword,
        });
      }

      toast.success("Admin profile updated successfully!");
      setSavedAccount({
        adminName: accountForm.adminName,
        email: accountForm.email,
        hasPassword:
          savedAccount.hasPassword || Boolean(accountForm.newPassword),
      });
      setAccountForm((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      setShowPassword({ current: false, new: false, confirm: false });
      setIsEditingAccount(false); // lock the card back to read-only after a successful save
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update profile";
      toast.error(message);

      if (message.toLowerCase().includes("current password")) {
        setAccountErrors((prev) => ({ ...prev, currentPassword: message }));
      } else if (message.toLowerCase().includes("new password")) {
        setAccountErrors((prev) => ({ ...prev, newPassword: message }));
      } else if (message.toLowerCase().includes("email")) {
        setAccountErrors((prev) => ({ ...prev, email: message }));
      }
    } finally {
      setSavingAccount(false);
    }
  };

  const saveBusinessProfile = async (e) => {
    e.preventDefault();
    const errors = validateBusiness();
    setBusinessErrors(errors);
    if (Object.keys(errors).length > 0) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    setSavingBusiness(true);
    try {
      const res = await axios.put(`${API_BASE}/business`, businessForm);
      setBusinessForm(res.data.data);
      setSavedBusiness(res.data.data);
      setIsEditingBusiness(false);
      toast.success(res.data.message || "Business profile saved successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update business profile");
    } finally {
      setSavingBusiness(false);
    }
  };

  const saveSystemConfigs = async (e) => {
    e.preventDefault();
    const errors = validateSystem();
    setSystemErrors(errors);
    if (Object.keys(errors).length > 0) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    setSavingSystem(true);
    try {
      // Convert the string-held inputs back to numbers before sending
      const payload = {
        advanceDepositPercentage: Number(systemForm.advanceDepositPercentage),
        serviceTaxPercentage: Number(systemForm.serviceTaxPercentage),
        minimumBookingMarginDays: Number(systemForm.minimumBookingMarginDays),
        autoApproveBookings: systemForm.autoApproveBookings,
      };
      const res = await axios.put(`${API_BASE}/system`, payload);
      setSystemForm(res.data.data);
      setSavedSystem(res.data.data);
      setIsEditingSystem(false); // lock the card back to read-only after a successful save
      toast.success(res.data.message || "System preferences saved!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to save system preferences",
      );
    } finally {
      setSavingSystem(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="settingsPage-loading">
          <Loader className="spin" size={28} />
          <p>Loading settings...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="settingsPage">
        {/* Page Title Module Header */}
        <div className="settingsPage-header">
          <div>
            <h2>Dashboard Settings & Controls</h2>
            <p>
              Admin Profile configuration, tax parameters, business registries,
              and system transaction policies.
            </p>
          </div>
        </div>

        {/* Module Action Navigation Tabs */}
        <div className="settingsPage-tabs">
          <button
            className={activeTab === "Account" ? "tab-btn active" : "tab-btn"}
            onClick={() => setActiveTab("Account")}
          >
            <User size={16} />
            <span>Account Security</span>
          </button>
          <button
            className={activeTab === "Business" ? "tab-btn active" : "tab-btn"}
            onClick={() => setActiveTab("Business")}
          >
            <Building size={16} />
            <span>Business Profile</span>
          </button>
          <button
            className={activeTab === "System" ? "tab-btn active" : "tab-btn"}
            onClick={() => setActiveTab("System")}
          >
            <Sliders size={16} />
            <span>System Preferences</span>
          </button>
        </div>

        <div className="settingsPage-contentWrapper">
          {/* TAB 1: ADMIN SECURITY ACCOUNT PROFILE */}
          {activeTab === "Account" && (
            <div className="settings-card">
              <div className="settings-cardHeader">
                <Lock className="gold-icon" size={20} />
                <h3>Admin Credentials & Security</h3>
                {!isEditingAccount && (
                  <button
                    type="button"
                    className="settings-btn edit settings-cardHeader-action"
                    onClick={startEditingAccount}
                  >
                    <Pencil size={14} />
                    <span>Edit</span>
                  </button>
                )}
              </div>

              <form
                onSubmit={saveAccountSettings}
                className="settings-form"
                noValidate
              >
                <div className="settings-formRow split-2">
                  <div className="settings-formGroup">
                    <label>Administrator User Handle</label>
                    <input
                      type="text"
                      name="adminName"
                      value={accountForm.adminName}
                      onChange={handleAccountChange}
                      maxLength={ADMIN_NAME_MAX}
                      disabled={!isEditingAccount}
                      readOnly={!isEditingAccount}
                    />
                    {accountErrors.adminName && (
                      <small className="settings-field-error">
                        {accountErrors.adminName}
                      </small>
                    )}
                  </div>
                  <div className="settings-formGroup">
                    <label>Inbound Admin Mail Account</label>
                    <input
                      type="email"
                      name="email"
                      value={accountForm.email}
                      onChange={handleAccountChange}
                      disabled={!isEditingAccount}
                      readOnly={!isEditingAccount}
                    />
                    {accountErrors.email && (
                      <small className="settings-field-error">
                        {accountErrors.email}
                      </small>
                    )}
                  </div>
                </div>

                {isEditingAccount && (
                  <>
                    <div className="settings-sectionDivider">
                      <span>Alter Security Password</span>
                    </div>
                    {savedAccount.hasPassword && (
                      <div className="settings-formRow">
                        <div className="settings-formGroup">
                          <label>Current Security Password</label>
                          <div className="password-inputWrapper">
                            <input
                              type={showPassword.current ? "text" : "password"}
                              name="currentPassword"
                              placeholder="••••••••"
                              value={accountForm.currentPassword}
                              onChange={handleAccountChange}
                            />
                            <button
                              type="button"
                              className="password-toggleBtn"
                              onClick={() =>
                                togglePasswordVisibility("current")
                              }
                              tabIndex={-1}
                            >
                              {showPassword.current ? (
                                <EyeOff size={16} />
                              ) : (
                                <Eye size={16} />
                              )}
                            </button>
                          </div>
                          {accountErrors.currentPassword && (
                            <small className="settings-field-error">
                              {accountErrors.currentPassword}
                            </small>
                          )}
                        </div>
                      </div>
                    )}
                    <div className="settings-formRow split-2">
                      <div className="settings-formGroup">
                        <label>New Security Password</label>
                        <div className="password-inputWrapper">
                          <input
                            type={showPassword.new ? "text" : "password"}
                            name="newPassword"
                            placeholder="Minimum 8 characters"
                            value={accountForm.newPassword}
                            onChange={handleAccountChange}
                          />
                          <button
                            type="button"
                            className="password-toggleBtn"
                            onClick={() => togglePasswordVisibility("new")}
                            tabIndex={-1}
                          >
                            {showPassword.new ? (
                              <EyeOff size={16} />
                            ) : (
                              <Eye size={16} />
                            )}
                          </button>
                        </div>
                        {accountErrors.newPassword && (
                          <small className="settings-field-error">
                            {accountErrors.newPassword}
                          </small>
                        )}
                      </div>
                      <div className="settings-formGroup">
                        <label>Confirm Password Verification</label>
                        <div className="password-inputWrapper">
                          <input
                            type={showPassword.confirm ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Repeat your password"
                            value={accountForm.confirmPassword}
                            onChange={handleAccountChange}
                          />
                          <button
                            type="button"
                            className="password-toggleBtn"
                            onClick={() => togglePasswordVisibility("confirm")}
                            tabIndex={-1}
                          >
                            {showPassword.confirm ? (
                              <EyeOff size={16} />
                            ) : (
                              <Eye size={16} />
                            )}
                          </button>
                        </div>
                        {accountErrors.confirmPassword && (
                          <small className="settings-field-error">
                            {accountErrors.confirmPassword}
                          </small>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {isEditingAccount && (
                  <div className="settings-btnGroup">
                    {/* Only offer Cancel if there's actually saved data to fall back to */}
                    {Boolean(savedAccount.adminName?.trim()) && (
                      <button
                        type="button"
                        className="settings-btn cancel"
                        onClick={cancelEditingAccount}
                        disabled={savingAccount}
                      >
                        <X size={16} />
                        <span>Cancel</span>
                      </button>
                    )}
                    <button
                      type="submit"
                      className="settings-btn save"
                      disabled={savingAccount}
                    >
                      <Save size={16} />
                      <span>
                        {savingAccount ? "Saving..." : "Save Security Profile"}
                      </span>
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* TAB 2: BUSINESS PROFILE INFORMATION */}
          {activeTab === "Business" && (
            <div className="settings-card">
              <div className="settings-cardHeader">
                <Building className="gold-icon" size={20} />
                <h3>Business Ledger Settings</h3>
                {!isEditingBusiness && (
                  <button
                    type="button"
                    className="settings-btn edit settings-cardHeader-action"
                    onClick={startEditingBusiness}
                  >
                    <Pencil size={14} />
                    <span>Edit</span>
                  </button>
                )}
              </div>

              <form
                onSubmit={saveBusinessProfile}
                className="settings-form"
                noValidate
              >
                <div className="settings-formRow split-2">
                  <div className="settings-formGroup">
                    <label>Official Registered Business Name</label>
                    <input
                      type="text"
                      name="companyName"
                      value={businessForm.companyName}
                      onChange={handleBusinessChange}
                      maxLength={COMPANY_NAME_MAX}
                      disabled={!isEditingBusiness}
                      readOnly={!isEditingBusiness}
                    />
                    {businessErrors.companyName && (
                      <small className="settings-field-error">
                        {businessErrors.companyName}
                      </small>
                    )}
                  </div>
                  <div className="settings-formGroup">
                    <label>GSTIN Tax Registry Number *</label>
                    <input
                      type="text"
                      name="gstNumber"
                      value={businessForm.gstNumber}
                      onChange={handleBusinessChange}
                      placeholder="Format: 32AAAAE1234F1Z1"
                      maxLength={15}
                      disabled={!isEditingBusiness}
                      readOnly={!isEditingBusiness}
                    />
                    {businessErrors.gstNumber && (
                      <small className="settings-field-error">
                        {businessErrors.gstNumber}
                      </small>
                    )}
                  </div>
                </div>

                <div className="settings-formRow split-2">
                  <div className="settings-formGroup">
                    <label>Official Support Phone Number</label>
                    <input
                      type="text"
                      name="contactPhone"
                      value={businessForm.contactPhone}
                      onChange={handleBusinessChange}
                      disabled={!isEditingBusiness}
                      readOnly={!isEditingBusiness}
                    />
                    {businessErrors.contactPhone && (
                      <small className="settings-field-error">
                        {businessErrors.contactPhone}
                      </small>
                    )}
                  </div>
                  <div className="settings-formGroup">
                    <label>Corporate Support Mail ID</label>
                    <input
                      type="email"
                      name="supportEmail"
                      value={businessForm.supportEmail}
                      onChange={handleBusinessChange}
                      disabled={!isEditingBusiness}
                      readOnly={!isEditingBusiness}
                    />
                    {businessErrors.supportEmail && (
                      <small className="settings-field-error">
                        {businessErrors.supportEmail}
                      </small>
                    )}
                  </div>
                </div>

                {/* Office address and business description sit side by side */}
                <div className="settings-formRow split-2">
                  <div className="settings-formGroup">
                    <label>Headquarters Postal Office Address</label>
                    <textarea
                      name="officeAddress"
                      rows={3}
                      value={businessForm.officeAddress}
                      onChange={handleBusinessChange}
                      maxLength={OFFICE_ADDRESS_MAX}
                      disabled={!isEditingBusiness}
                      readOnly={!isEditingBusiness}
                    />
                    {businessErrors.officeAddress && (
                      <small className="settings-field-error">
                        {businessErrors.officeAddress}
                      </small>
                    )}
                  </div>
                  <div className="settings-formGroup">
                    <label>About Our Business</label>
                    <textarea
                      name="description"
                      rows={3}
                      value={businessForm.description}
                      onChange={handleBusinessChange}
                      maxLength={DESCRIPTION_MAX}
                      placeholder="A short description clients will see, e.g. what kind of events you host"
                      disabled={!isEditingBusiness}
                      readOnly={!isEditingBusiness}
                    />
                    {businessErrors.description && (
                      <small className="settings-field-error">
                        {businessErrors.description}
                      </small>
                    )}
                  </div>
                </div>

                {isEditingBusiness && (
                  <div className="settings-btnGroup">
                    {/* Only offer Cancel if there's actually saved data to fall back to */}
                    {Boolean(savedBusiness.companyName?.trim()) && (
                      <button
                        type="button"
                        className="settings-btn cancel"
                        onClick={cancelEditingBusiness}
                        disabled={savingBusiness}
                      >
                        <X size={16} />
                        <span>Cancel</span>
                      </button>
                    )}
                    <button
                      type="submit"
                      className="settings-btn save"
                      disabled={savingBusiness}
                    >
                      <Save size={16} />
                      <span>
                        {savingBusiness
                          ? "Saving..."
                          : "Save Corporate Metadata"}
                      </span>
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* TAB 3: OPERATIONAL SYSTEM PREFERENCES */}
          {activeTab === "System" && (
            <div className="settings-card">
              <div className="settings-cardHeader">
                <Sliders className="gold-icon" size={20} />
                <h3>Booking & Financial Policies</h3>
                {!isEditingSystem && (
                  <button
                    type="button"
                    className="settings-btn edit settings-cardHeader-action"
                    onClick={startEditingSystem}
                  >
                    <Pencil size={14} />
                    <span>Edit</span>
                  </button>
                )}
              </div>

              <form
                onSubmit={saveSystemConfigs}
                className="settings-form"
                noValidate
              >
                <div className="settings-formRow split-2">
                  <div className="settings-formGroup">
                    <label>Required Booking Advance Deposit (%)</label>
                    <input
                      type="number"
                      name="advanceDepositPercentage"
                      value={systemForm.advanceDepositPercentage}
                      onChange={handleSystemChange}
                      min={10}
                      max={100}
                      disabled={!isEditingSystem}
                      readOnly={!isEditingSystem}
                    />
                    <small className="settings-field-hint">
                      Current client pre-payment required to lock dynamic slots.
                    </small>
                    {systemErrors.advanceDepositPercentage && (
                      <small className="settings-field-error">
                        {systemErrors.advanceDepositPercentage}
                      </small>
                    )}
                  </div>
                  <div className="settings-formGroup">
                    <label>Standard Service GST Rate (%)</label>
                    <input
                      type="number"
                      name="serviceTaxPercentage"
                      value={systemForm.serviceTaxPercentage}
                      onChange={handleSystemChange}
                      min={0}
                      max={28}
                      disabled={!isEditingSystem}
                      readOnly={!isEditingSystem}
                    />
                    <small className="settings-field-hint">
                      Applicable service tax calculation rate added to
                      reservation sums.
                    </small>
                    {systemErrors.serviceTaxPercentage && (
                      <small className="settings-field-error">
                        {systemErrors.serviceTaxPercentage}
                      </small>
                    )}
                  </div>
                </div>

                <div className="settings-formRow">
                  <div className="settings-formGroup">
                    <label>Minimum Advance Notice Gap (Days)</label>
                    <input
                      type="number"
                      name="minimumBookingMarginDays"
                      value={systemForm.minimumBookingMarginDays}
                      onChange={handleSystemChange}
                      min={1}
                      disabled={!isEditingSystem}
                      readOnly={!isEditingSystem}
                    />
                    <small className="settings-field-hint">
                      Minimum required days between reservation booking date and
                      scheduled event launch date.
                    </small>
                    {systemErrors.minimumBookingMarginDays && (
                      <small className="settings-field-error">
                        {systemErrors.minimumBookingMarginDays}
                      </small>
                    )}
                  </div>
                </div>

                {isEditingSystem && (
                  <div className="settings-btnGroup">
                    {/* Only offer Cancel if there's actually saved data to fall back to */}
                    {Boolean(savedSystem.configured) && (
                      <button
                        type="button"
                        className="settings-btn cancel"
                        onClick={cancelEditingSystem}
                        disabled={savingSystem}
                      >
                        <X size={16} />
                        <span>Cancel</span>
                      </button>
                    )}
                    <button
                      type="submit"
                      className="settings-btn save"
                      disabled={savingSystem}
                    >
                      <Save size={16} />
                      <span>
                        {savingSystem ? "Saving..." : "Save Preferences"}
                      </span>
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </AdminLayout>
  );
};

export default ManageSettings;