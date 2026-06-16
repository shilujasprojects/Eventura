import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Upload, 
  CheckCircle, 
  Briefcase, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Trash2 
} from 'lucide-react';
import './Vendors.css';
import AdminLayout from '../../Pages/Admin/Layout/AdminLayout';

const EditVendor = ({ vendorId = "EV-VEN-2026-001", onCancel }) => {
  const SERVICE_CATEGORIES = [
    "Catering", 
    "Photography", 
    "Decoration", 
    "DJ & Music", 
    "Makeup", 
    "Transportation", 
    "Cake Service"
  ];

  const [formData, setFormData] = useState({
    name: '',
    serviceCategory: '',
    contactPerson: '',
    email: '',
    phone: '',
    location: '',
    status: 'Active',
    about: '',
    image: null
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (vendorId) {
      // Simulation: Fetching the active database entry to populate edit states
      const mockFetchedVendor = {
        name: "Malabar Catering Co.",
        serviceCategory: "Catering",
        contactPerson: "Faisal Rahman",
        email: "malabar.catering@example.com",
        phone: "+91 98460 12345",
        location: "Kochi, Kerala",
        status: "Active",
        about: "Premier traditional Malabar food service solutions for grand weddings and events.",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400"
      };

      setFormData(mockFetchedVendor);
      setImagePreview(mockFetchedVendor.image);
    }
  }, [vendorId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setImagePreview(null);
  };

  const validateForm = () => {
    let tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = "Company name is required";
    if (!formData.serviceCategory) tempErrors.serviceCategory = "Please select a service category";
    if (!formData.contactPerson.trim()) tempErrors.contactPerson = "Contact person name is required";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = "Valid email is required";
    if (!formData.phone.trim()) tempErrors.phone = "Phone number is required";
    if (!formData.location.trim()) tempErrors.location = "Base location is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    console.log("Submitting Modified Vendor Registry Payload:", formData);
    // Integration Hook: Fire API update request using vendorId and payload

    if (onCancel) onCancel();
  };

  return (
    <AdminLayout>
      <div className="addVendor-page">
        {/* Navigation Action Header */}
        <div className="addVendor-header">
          <button className="back-btn" onClick={onCancel}>
            <ArrowLeft size={16} />
            <span>Back to Directory</span>
          </button>
          <h2>Modify Partner Profile</h2>
          <p>Update internal agency files, locations, and assignment controls.</p>
        </div>

        {/* Form Container Card Structure */}
        <div className="addVendor-card">
          <form onSubmit={handleSubmit}>
            
            <div className="form-section-title">
              <Briefcase size={18} className="gold-icon" />
              <h3>Business Profile Details</h3>
            </div>

            {/* Grid Row 1: Core Details */}
            <div className="addVendor-formGrid">
              <div className="addVendor-formGroup">
                <label>Company / Vendor Name *</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Malabar Catering Co."
                  className={errors.name ? "error" : ""}
                />
                {errors.name && <span className="error-lbl">{errors.name}</span>}
              </div>

              <div className="addVendor-formGroup">
                <label>Service Category *</label>
                <select 
                  name="serviceCategory"
                  value={formData.serviceCategory}
                  onChange={handleInputChange}
                  className={errors.serviceCategory ? "error" : ""}
                >
                  <option value="">-- Choose Speciality --</option>
                  {SERVICE_CATEGORIES.map((cat, idx) => (
                    <option key={idx} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.serviceCategory && <span className="error-lbl">{errors.serviceCategory}</span>}
              </div>

              <div className="addVendor-formGroup">
                <label>Primary Contact Person *</label>
                <div className="input-with-icon">
                  <User size={16} className="input-inner-icon" />
                  <input 
                    type="text" 
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleInputChange}
                    placeholder="e.g. Faisal Rahman"
                    className={errors.contactPerson ? "error" : ""}
                  />
                </div>
                {errors.contactPerson && <span className="error-lbl">{errors.contactPerson}</span>}
              </div>

              <div className="addVendor-formGroup">
                <label>Account Status</label>
                <select 
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="Active">Active / Available</option>
                  <option value="Suspended">Suspended / On Hold</option>
                </select>
              </div>
            </div>

            {/* Grid Row 2: Location and Contacts */}
            <div className="addVendor-formGrid">
              <div className="addVendor-formGroup">
                <label>Official Email Address *</label>
                <div className="input-with-icon">
                  <Mail size={16} className="input-inner-icon" />
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="partner@example.com"
                    className={errors.email ? "error" : ""}
                  />
                </div>
                {errors.email && <span className="error-lbl">{errors.email}</span>}
              </div>

              <div className="addVendor-formGroup">
                <label>Contact Phone Number *</label>
                <div className="input-with-icon">
                  <Phone size={16} className="input-inner-icon" />
                  <input 
                    type="text" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 XXXXX XXXXX"
                    className={errors.phone ? "error" : ""}
                  />
                </div>
                {errors.phone && <span className="error-lbl">{errors.phone}</span>}
              </div>

              <div className="addVendor-formGroup">
                <label>Operational Base / Location *</label>
                <div className="input-with-icon">
                  <MapPin size={16} className="input-inner-icon" />
                  <input 
                    type="text" 
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g. Kochi, Kerala"
                    className={errors.location ? "error" : ""}
                  />
                </div>
                {errors.location && <span className="error-lbl">{errors.location}</span>}
              </div>
            </div>

            {/* Row 3: Description Bio and File Upload */}
            <div className="addVendor-descriptionRow">
              <div className="addVendor-formGroup bio-group">
                <label>Partner Bio / Descriptions</label>
                <textarea 
                  name="about"
                  value={formData.about}
                  onChange={handleInputChange}
                  placeholder="Provide details about their specialties, menu sizes, decorations types, equipment, etc."
                  rows={6}
                />
              </div>

              <div className="addVendor-formGroup file-upload-group">
                <label>Company Logo / Business Banner</label>
                {imagePreview ? (
                  <div className="addVendor-imagePreviewContainer">
                    <img src={imagePreview} alt="Vendor Upload Visual Preview" />
                    <button type="button" className="remove-preview-btn" onClick={handleRemoveImage}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="addVendor-uploadPlaceholder">
                    <Upload size={32} className="upload-cloud-icon" />
                    <p>Select vendor assets or drag drop files</p>
                    <span>Formats accepted: JPEG, PNG</span>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageChange}
                      id="vendor-file-input"
                    />
                    <label htmlFor="vendor-file-input" className="file-browse-btn">Browse Local Files</label>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons Group */}
            <div className="addVendor-actionsRow">
              <button type="button" className="btn-cancel" onClick={onCancel}>
                Cancel Changes
              </button>
              <button type="submit" className="btn-submit">
                <CheckCircle size={16} />
                <span>Update Changes</span>
              </button>
            </div>

          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EditVendor;