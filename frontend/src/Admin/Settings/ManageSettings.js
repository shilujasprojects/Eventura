import React, { useState } from 'react';
import { 
  User, 
  Building, 
  Sliders, 
  Save, 
  Lock, 
  Check, 
  AlertCircle,
  FileText
} from 'lucide-react';
import AdminLayout from '../../Pages/Admin/Layout/AdminLayout';
import './Settings.css';

// Initial Mock System State (Simulating values fetched from config tables)
const INITIAL_ACCOUNT = {
  adminName: "Eventura Administrator",
  email: "admin@eventura.com",
  currentPassword: "",
  newPassword: "",
  confirmPassword: ""
};

const INITIAL_BUSINESS = {
  companyName: "Eventura Events & Heritage Celebrations",
  contactPhone: "+91 98470 54321",
  supportEmail: "support@eventura.com",
  officeAddress: "First Floor, Heritage Building, Fort Kochi, Kerala - 682001",
  gstNumber: "32AAAAE1234F1Z1" // Kerala State Code Prefix GSTIN
};

const INITIAL_SYSTEM = {
  advanceDepositPercentage: 50, // Standard 50% booking deposit
  serviceTaxPercentage: 18, // 18% GST (9% CGST + 9% SGST)
  minimumBookingMarginDays: 7, // Minimum gap days between booking date and event date
  autoApproveBookings: false // Toggle between manual review vs automatic approval
};

const ManageSettings = () => {
  const [activeTab, setActiveTab] = useState("Account"); // Options: Account, Business, System
  
  // Settings Form States
  const [accountForm, setAccountForm] = useState(INITIAL_ACCOUNT);
  const [businessForm, setBusinessForm] = useState(INITIAL_BUSINESS);
  const [systemForm, setSystemForm] = useState(INITIAL_SYSTEM);

  // Non-blocking Professional UI Toast Feedback
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const triggerToast = (msg, type = "success") => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3500);
  };

  // Form input change handlers
  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    setAccountForm(prev => ({ ...prev, [name]: value }));
  };

  const handleBusinessChange = (e) => {
    const { name, value } = e.target;
    setBusinessForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSystemChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSystemForm(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : Number(value) 
    }));
  };

  // Save Handlers (Simulating Database Write/API dispatch)
  const saveAccountSettings = (e) => {
    e.preventDefault();
    if (accountForm.newPassword) {
      if (accountForm.newPassword !== accountForm.confirmPassword) {
        triggerToast("Passwords do not match. Please try again.", "error");
        return;
      }
      if (!accountForm.currentPassword) {
        triggerToast("Please enter your current password to proceed.", "error");
        return;
      }
    }
    triggerToast("Admin profile credentials updated successfully!");
    setAccountForm(prev => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
  };

  const saveBusinessProfile = (e) => {
    e.preventDefault();
    triggerToast("Global corporate invoicing files updated successfully!");
  };

  const saveSystemConfigs = (e) => {
    e.preventDefault();
    triggerToast("System calculation engine thresholds saved!");
  };

  return (
    <AdminLayout>
      <div className="settingsPage">
        {/* Module Feedback Toast Alert */}
        {toast.show && (
          <div className={`settings-toast ${toast.type}`}>
            <AlertCircle size={16} />
            <span>{toast.message}</span>
          </div>
        )}

        {/* Page Title Module Header */}
        <div className="settingsPage-header">
          <div>
            <h2>Dashboard Settings & Controls</h2>
            <p>Admin Profile configuration, tax parameters, business registries, and system transaction policies.</p>
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

        {/* Dynamic Inner Configurations Frame wrapper */}
        <div className="settingsPage-contentWrapper">
          
          {/* TAB 1: ADMIN SECURITY ACCOUNT PROFILE */}
          {activeTab === "Account" && (
            <div className="settings-card">
              <div className="settings-cardHeader">
                <Lock className="gold-icon" size={20} />
                <h3>Admin Credentials & Security</h3>
              </div>
              
              <form onSubmit={saveAccountSettings} className="settings-form">
                <div className="settings-formRow split-2">
                  <div className="settings-formGroup">
                    <label>Administrator User Handle</label>
                    <input 
                      type="text" 
                      name="adminName"
                      value={accountForm.adminName}
                      onChange={handleAccountChange}
                      required
                    />
                  </div>
                  <div className="settings-formGroup">
                    <label>Inbound Admin Mail Account</label>
                    <input 
                      type="email" 
                      name="email"
                      value={accountForm.email}
                      onChange={handleAccountChange}
                      required
                    />
                  </div>
                </div>

                <div className="settings-sectionDivider">
                  <span>Alter Security Password</span>
                </div>

                <div className="settings-formRow">
                  <div className="settings-formGroup">
                    <label>Current Security Password</label>
                    <input 
                      type="password" 
                      name="currentPassword"
                      placeholder="••••••••"
                      value={accountForm.currentPassword}
                      onChange={handleAccountChange}
                    />
                  </div>
                </div>

                <div className="settings-formRow split-2">
                  <div className="settings-formGroup">
                    <label>New Security Password</label>
                    <input 
                      type="password" 
                      name="newPassword"
                      placeholder="Minimum 8 characters"
                      value={accountForm.newPassword}
                      onChange={handleAccountChange}
                    />
                  </div>
                  <div className="settings-formGroup">
                    <label>Confirm Password Verification</label>
                    <input 
                      type="password" 
                      name="confirmPassword"
                      placeholder="Repeat your password"
                      value={accountForm.confirmPassword}
                      onChange={handleAccountChange}
                    />
                  </div>
                </div>

                <div className="settings-btnGroup">
                  <button type="submit" className="settings-btn save">
                    <Save size={16} />
                    <span>Save Security Profile</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: BUSINESS PROFILE INFORMATION */}
          {activeTab === "Business" && (
            <div className="settings-card">
              <div className="settings-cardHeader">
                <Building className="gold-icon" size={20} />
                <h3>Business Ledger Settings</h3>
              </div>

              <form onSubmit={saveBusinessProfile} className="settings-form">
                <div className="settings-formRow split-2">
                  <div className="settings-formGroup">
                    <label>Official Registered Business Name</label>
                    <input 
                      type="text" 
                      name="companyName"
                      value={businessForm.companyName}
                      onChange={handleBusinessChange}
                      required
                    />
                  </div>
                  <div className="settings-formGroup">
                    <label>GSTIN Tax Registry Number *</label>
                    <input 
                      type="text" 
                      name="gstNumber"
                      value={businessForm.gstNumber}
                      onChange={handleBusinessChange}
                      placeholder="Format: 32AAAAE1234F1Z1"
                      required
                    />
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
                      required
                    />
                  </div>
                  <div className="settings-formGroup">
                    <label>Corporate Support Mail ID</label>
                    <input 
                      type="email" 
                      name="supportEmail"
                      value={businessForm.supportEmail}
                      onChange={handleBusinessChange}
                      required
                    />
                  </div>
                </div>

                <div className="settings-formRow">
                  <div className="settings-formGroup">
                    <label>Headquarters Postal Office Address</label>
                    <textarea 
                      name="officeAddress"
                      rows={3}
                      value={businessForm.officeAddress}
                      onChange={handleBusinessChange}
                      required
                    />
                  </div>
                </div>

                <div className="settings-btnGroup">
                  <button type="submit" className="settings-btn save">
                    <Save size={16} />
                    <span>Save Corporate Metadata</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: OPERATIONAL SYSTEM PREFERENCES */}
          {activeTab === "System" && (
            <div className="settings-card">
              <div className="settings-cardHeader">
                <Sliders className="gold-icon" size={20} />
                <h3>Booking & Financial Policies</h3>
              </div>

              <form onSubmit={saveSystemConfigs} className="settings-form">
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
                      required
                    />
                    <small className="settings-field-hint">Current client pre-payment required to lock dynamic slots.</small>
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
                      required
                    />
                    <small className="settings-field-hint">Applicable service tax calculation rate added to reservation sums.</small>
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
                      required
                    />
                    <small className="settings-field-hint">Minimum required days between reservation booking date and scheduled event launch date.</small>
                  </div>
                </div>

                <div className="settings-formRow">
                  <div className="settings-formGroup checkbox-group">
                    <div className="checkbox-wrapper">
                      <input 
                        type="checkbox" 
                        id="autoApproveBookings"
                        name="autoApproveBookings"
                        checked={systemForm.autoApproveBookings}
                        onChange={handleSystemChange}
                      />
                      <label htmlFor="autoApproveBookings">
                        Enable Automatic Booking Invoice Approvals
                      </label>
                    </div>
                    <small className="settings-field-hint checkbox-hint">
                      If checked, bookings with successful online deposits auto-approve. Otherwise, admins manually verify slot status from the desk.
                    </small>
                  </div>
                </div>

                <div className="settings-btnGroup">
                  <button type="submit" className="settings-btn save">
                    <Save size={16} />
                    <span>Save Preferences</span>
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageSettings;