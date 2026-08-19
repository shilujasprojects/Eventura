import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Upload,
  CheckCircle,
  Briefcase,
  User,
  Mail,
  Phone,
  MapPin,
  Trash2,
  Loader2,
} from "lucide-react";
import "./Vendors.css";
import AdminLayout from "../../Pages/Admin/Layout/AdminLayout";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";

const AddVendors = () => {
  const navigate = useNavigate();

  const [serviceCategories, setServiceCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    serviceCategory: "",
    contactPerson: "",
    email: "",
    phone: "",
    location: "",
    rate: "",
    status: "Active",
    about: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch service categories from the backend
  useEffect(() => {
    fetchServiceCategories();
  }, []);

  const fetchServiceCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/services");
      // Only show Active services in the dropdown
      const activeServices = response.data.data.filter(
        (s) => s.status === "Active"
      );
      setServiceCategories(activeServices);
    } catch (error) {
      console.error("Failed to fetch service categories:", error);
      toast.error("Could not load service categories");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field as soon as user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      toast.error("Only JPEG and PNG images are allowed");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setFormData((prev) => ({ ...prev, image: file }));
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setImagePreview(null);
    // Reset the file input so the same file can be re-selected if needed
    const fileInput = document.getElementById("vendor-file-input");
    if (fileInput) fileInput.value = "";
  };

  const validateForm = () => {
    let tempErrors = {};

    if (!formData.name.trim())
      tempErrors.name = "Company name is required";

    if (!formData.serviceCategory)
      tempErrors.serviceCategory = "Please select a service category";

    if (!formData.contactPerson.trim())
      tempErrors.contactPerson = "Contact person name is required";

    if (!formData.email.trim())
      tempErrors.email = "Email address is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      tempErrors.email = "Please enter a valid email address";

    if (!formData.phone.trim())
      tempErrors.phone = "Phone number is required";
    else if (!/^[+]?[\d\s\-()]{7,15}$/.test(formData.phone))
      tempErrors.phone = "Please enter a valid phone number";

    if (!formData.location.trim())
      tempErrors.location = "Base location is required";

    if (formData.rate && isNaN(Number(formData.rate)))
      tempErrors.rate = "Rate must be a valid number";

    if (formData.rate && Number(formData.rate) < 0)
      tempErrors.rate = "Rate cannot be negative";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    setIsSubmitting(true);

    try {
      const vendorData = new FormData();
      vendorData.append("name", formData.name.trim());
      vendorData.append("serviceCategory", formData.serviceCategory);
      vendorData.append("contactPerson", formData.contactPerson.trim());
      vendorData.append("email", formData.email.trim().toLowerCase());
      vendorData.append("phone", formData.phone.trim());
      vendorData.append("location", formData.location.trim());
      vendorData.append("rate", formData.rate || 0);
      vendorData.append("status", formData.status);
      vendorData.append("about", formData.about.trim());

      if (formData.image) {
        vendorData.append("image", formData.image);
      }

      await axios.post("http://localhost:5000/api/vendors", vendorData);

      toast.success("Vendor registered successfully!");
      navigate("/vendors");
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to add vendor. Try again.";
      toast.error(message);
      console.error("Add vendor error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="addVendor-page">

        {/* Page Header */}
        <div className="addVendor-header">
          <div>
            <h2>Register New Service Vendor</h2>
            <p>Add a trusted external partner agency to Eventura's network directory.</p>
          </div>
          <button className="back-btn" onClick={() => navigate("/vendors")}>
            <ArrowLeft size={16} />
            <span>Back to Vendors</span>
          </button>
        </div>

        {/* Form Card */}
        <div className="addVendor-card">
          <form onSubmit={handleSubmit}>

            <div className="form-section-title">
              <Briefcase size={18} className="gold-icon" />
              <h3>Business Profile Details</h3>
            </div>

            {/* Grid Row 1: Core Details */}
            <div className="addVendor-formGrid">

              <div className="addVendor-formGroup">
                <label>Company / Vendor Name <span className="required-star">*</span></label>
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
                <label>Service Category <span className="required-star">*</span></label>
                <div className="custom-select-wrapper">
                  <select
                    name="serviceCategory"
                    value={formData.serviceCategory}
                    onChange={handleInputChange}
                    className={errors.serviceCategory ? "error" : ""}
                  >
                    <option value="">— Select Category —</option>
                    {serviceCategories.length === 0 ? (
                      <option disabled>Loading categories...</option>
                    ) : (
                      serviceCategories.map((service) => (
                        <option key={service._id} value={service._id}>
                          {service.serviceName}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                {errors.serviceCategory && (
                  <span className="error-lbl">{errors.serviceCategory}</span>
                )}
              </div>

              <div className="addVendor-formGroup">
                <label>Primary Contact Person <span className="required-star">*</span></label>
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
                {errors.contactPerson && (
                  <span className="error-lbl">{errors.contactPerson}</span>
                )}
              </div>

              <div className="addVendor-formGroup">
                <label>Account Status</label>
                <div className="custom-select-wrapper">
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

            </div>

            {/* Grid Row 2: Contact & Location */}
            <div className="addVendor-formGrid">

              <div className="addVendor-formGroup">
                <label>Official Email Address <span className="required-star">*</span></label>
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
                <label>Contact Phone Number <span className="required-star">*</span></label>
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
                <label>Operational Base / Location <span className="required-star">*</span></label>
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
                {errors.location && (
                  <span className="error-lbl">{errors.location}</span>
                )}
              </div>

              <div className="addVendor-formGroup">
                <label>Starting Rate (₹)</label>
                <input
                  type="number"
                  name="rate"
                  value={formData.rate}
                  onChange={handleInputChange}
                  placeholder="Enter starting rate"
                  min="0"
                  className={errors.rate ? "error" : ""}
                />
                {errors.rate && <span className="error-lbl">{errors.rate}</span>}
              </div>

            </div>

            {/* Row 3: Bio + Image Upload */}
            <div className="addVendor-descriptionRow">

              <div className="addVendor-formGroup">
                <label>Partner Bio / Description</label>
                <textarea
                  name="about"
                  value={formData.about}
                  onChange={handleInputChange}
                  placeholder="Describe their specialties, equipment, service capacity, etc."
                  rows={6}
                />
              </div>

              <div className="addVendor-formGroup">
                <label>Company Logo / Business Banner</label>
                {imagePreview ? (
                  <div className="addVendor-imagePreviewContainer">
                    {/* Click image to open lightbox */}
                    <img
                      src={imagePreview}
                      alt="Vendor Preview"
                      onClick={() => setLightboxOpen(true)}
                      className="preview-img-clickable"
                      title="Click to enlarge"
                    />
                    <div className="image-preview-hint">Click image to enlarge</div>
                    <button
                      type="button"
                      className="remove-preview-btn"
                      onClick={handleRemoveImage}
                      title="Remove image"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="addVendor-uploadPlaceholder">
                    <Upload size={32} className="upload-cloud-icon" />
                    <p>Select vendor assets or drag & drop files</p>
                    <span>Formats accepted: JPEG, PNG (max 5MB)</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/jpg"
                      onChange={handleImageChange}
                      id="vendor-file-input"
                    />
                    <label htmlFor="vendor-file-input" className="file-browse-btn">
                      Browse Local Files
                    </label>
                  </div>
                )}
              </div>

            </div>

            {/* Action Buttons */}
            <div className="addVendor-actionsRow">
              <button
                type="button"
                className="vendor-cancel"
                onClick={() => navigate("/vendors")}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button type="submit" className="vendor-submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="spin-icon" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} />
                    <span className="p-1">Create Vendor</span>
                  </>
                )}
              </button>
            </div>

            

          </form>
        </div>
      </div>

      {/* Image Lightbox Modal */}
      {lightboxOpen && imagePreview && (
        <div
          className="lightbox-overlay"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="lightbox-close-btn"
              onClick={() => setLightboxOpen(false)}
            >
              &times;
            </button>
            <img src={imagePreview} alt="Full Preview" className="lightbox-img" />
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </AdminLayout>
  );
};

export default AddVendors;