import React, { useState } from "react";
import { Upload, Trash2, CheckCircle, X, ZoomIn } from "lucide-react";
import "./Services.css";
import AdminLayout from "../../Pages/Admin/Layout/AdminLayout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/jpg"];
const MAX_FILE_SIZE_MB = 5;

const AddServices = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    serviceName: "",
    servicePrice: "",
    description: "",
    status: "Active",
    bannerImage: null,
    galleryImages: [],
  });

  const [bannerPreview, setBannerPreview] = useState(null);
  const [galleryPreview, setGalleryPreview] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState(null);

  // ── Validation ────────────────────────────────────────────
  const validate = () => {
    const newErrors = {};

    if (!formData.serviceName.trim()) {
      newErrors.serviceName = "Service name is required.";
    } else if (formData.serviceName.trim().length < 3) {
      newErrors.serviceName = "Name must be at least 3 characters.";
    }

    if (!formData.servicePrice) {
      newErrors.servicePrice = "Price is required.";
    } else if (Number(formData.servicePrice) <= 0) {
      newErrors.servicePrice = "Price must be greater than 0.";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required.";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters.";
    }

    if (!formData.bannerImage) {
      newErrors.bannerImage = "Banner image is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Field Change ──────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ── File Helpers ──────────────────────────────────────────
  const isValidImage = (file) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Only JPEG and PNG images are accepted.");
      return false;
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast.error(`Image must be under ${MAX_FILE_SIZE_MB}MB.`);
      return false;
    }
    return true;
  };

  // ── Banner ────────────────────────────────────────────────
  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!isValidImage(file)) return;

    setFormData((prev) => ({ ...prev, bannerImage: file }));
    setBannerPreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, bannerImage: "" }));
  };

  const removeBanner = () => {
    setBannerPreview(null);
    setFormData((prev) => ({ ...prev, bannerImage: null }));
  };

  // ── Gallery ───────────────────────────────────────────────
  const handleGalleryChange = (e) => {
  const files = Array.from(e.target.files).filter(isValidImage);

  if (files.length === 0) return;

  setFormData((prev) => {
    const existingNames = prev.galleryImages.map((f) => f.name);

    const uniqueFiles = files.filter(
      (file) => !existingNames.includes(file.name)
    );

    if (uniqueFiles.length === 0) {
      toast.info("Selected images are already added.");
      return prev;
    }

    setGalleryPreview((prevPreview) => [
      ...prevPreview,
      ...uniqueFiles.map((file) => URL.createObjectURL(file)),
    ]);

    return {
      ...prev,
      galleryImages: [...prev.galleryImages, ...uniqueFiles],
    };
  });

  e.target.value = "";
};

  const removeGalleryImage = (index) => {
    const updatedImages = [...formData.galleryImages];
    const updatedPreview = [...galleryPreview];
    updatedImages.splice(index, 1);
    updatedPreview.splice(index, 1);
    setFormData((prev) => ({ ...prev, galleryImages: updatedImages }));
    setGalleryPreview(updatedPreview);
  };

  // ── Submit ────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();
      data.append("serviceName", formData.serviceName.trim());
      data.append("servicePrice", formData.servicePrice);
      data.append("description", formData.description.trim());
      data.append("status", formData.status);
      data.append("bannerImage", formData.bannerImage);
      formData.galleryImages.forEach((img) => data.append("galleryImages", img));

      await axios.post("http://localhost:5000/api/services", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Service added successfully!");

      // Reset
      setFormData({
        serviceName: "",
        servicePrice: "",
        description: "",
        status: "Active",
        bannerImage: null,
        galleryImages: [],
      });
      setBannerPreview(null);
      setGalleryPreview([]);
      setErrors({});

      navigate("/adminServices");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      {/* ── Lightbox ── */}
      {lightboxSrc && (
        <div className="lightbox-overlay" onClick={() => setLightboxSrc(null)}>
          <button className="lightbox-close" onClick={() => setLightboxSrc(null)}>
            <X size={24} />
          </button>
          <img
            src={lightboxSrc}
            alt="Preview"
            className="lightbox-img"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <div className="addService">
        <div className="addService-header">
          <h2>Add Service</h2>
          <p>Create a new service for Eventura</p>
        </div>

        <div className="addService-card">
          <form onSubmit={handleSubmit} noValidate>

            {/* ── Top Fields ── */}
            <div className="addService-grid">

              <div className="addService-formGroup">
                <label>Service Name *</label>
                <input
                  type="text"
                  name="serviceName"
                  value={formData.serviceName}
                  onChange={handleChange}
                  placeholder="Enter service name"
                  maxLength={100}
                />
                {errors.serviceName && (
                  <span className="field-error">{errors.serviceName}</span>
                )}
              </div>

              <div className="addService-formGroup">
                <label>Price (₹) *</label>
                <input
                  type="number"
                  name="servicePrice"
                  value={formData.servicePrice}
                  onChange={handleChange}
                  placeholder="Enter price"
                  min="1"
                />
                {errors.servicePrice && (
                  <span className="field-error">{errors.servicePrice}</span>
                )}
              </div>

              <div className="addService-formGroup">
                <label>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

            </div>

            {/* ── Description ── */}
            <div className="addService-formGroup">
              <label>Description *</label>
              <textarea
                rows="4"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter service description (min 10 characters)"
                maxLength={1000}
              />
              <div className="textarea-meta">
                <span className="field-error">{errors.description || ""}</span>
                <span className="char-count">
                  {formData.description.length}/1000
                </span>
              </div>
            </div>

            {/* ── Image Uploads ── */}
            <div className="service-upload-row">

              {/* Banner */}
              <div className="addService-formGroup">
                <label>Banner Image *</label>
                {bannerPreview ? (
                  <div className="service-imagePreviewContainer">
                    <img src={bannerPreview} alt="Banner Preview" />
                    <button
                      type="button"
                      className="remove-preview-btn"
                      onClick={removeBanner}
                    >
                      <Trash2 size={18} />
                    </button>
                    <button
                      type="button"
                      className="zoom-preview-btn"
                      onClick={() => setLightboxSrc(bannerPreview)}
                    >
                      <ZoomIn size={18} />
                    </button>
                  </div>
                ) : (
                  <div
                    className={`service-uploadPlaceholder ${
                      errors.bannerImage ? "upload-error" : ""
                    }`}
                  >
                    <Upload size={32} className="upload-cloud-icon" />
                    <p>Select banner image or drag & drop</p>
                    <span>JPEG, PNG — max {MAX_FILE_SIZE_MB}MB</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={handleBannerChange}
                      id="banner-upload"
                    />
                    <label htmlFor="banner-upload" className="file-browse-btn">
                      Browse Files
                    </label>
                  </div>
                )}
                {errors.bannerImage && (
                  <span className="field-error">{errors.bannerImage}</span>
                )}
              </div>

              {/* Gallery */}
              <div className="addService-formGroup">
                <label>Gallery Images</label>
                <div className="service-uploadPlaceholder">
                  <Upload size={32} className="upload-cloud-icon" />
                  <p>Select gallery images or drag & drop</p>
                  <span>JPEG, PNG — max {MAX_FILE_SIZE_MB}MB each</span>
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/png"
                    onChange={handleGalleryChange}
                    id="gallery-upload"
                  />
                  <label htmlFor="gallery-upload" className="file-browse-btn">
                    Browse Files
                  </label>
                </div>
                {galleryPreview.length > 0 && (
                  <div className="gallery-preview-grid">
                    {galleryPreview.map((image, index) => (
                      <div className="gallery-preview-item" key={index}>
                        <img
                          src={image}
                          alt={`Gallery ${index + 1}`}
                          onClick={() => setLightboxSrc(image)}
                          className="gallery-zoomable"
                        />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(index)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* ── Buttons ── */}
            <div className="addService-btnGroup">
              <button
                type="button"
                className="addService-cancelBtn"
                onClick={() => navigate("/adminServices")}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="addService-submitBtn"
                disabled={loading}
              >
                <CheckCircle size={18} />
                {loading ? "Creating..." : "Create Service"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AddServices;