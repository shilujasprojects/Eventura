import React, { useState, useEffect } from "react";
import { Save, ArrowLeft, Upload, Trash2, X, ZoomIn } from "lucide-react";
import "./Services.css";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../Pages/Admin/Layout/AdminLayout";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/jpg"];
const MAX_FILE_SIZE_MB = 5;

const EditServices = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    serviceName: "",
    servicePrice: "",
    description: "",
    status: "Active",
  });

  // Tracks whether banner is a new File or an existing server URL string
  const [bannerFile, setBannerFile] = useState(null);       // new File object
  const [bannerPreview, setBannerPreview] = useState("");    // preview URL
  const [bannerRemoved, setBannerRemoved] = useState(false); // flag for backend

  // Gallery: existing = server filenames, newFiles = File objects
  const [existingGallery, setExistingGallery] = useState([]); // string filenames still kept
  const [newGalleryFiles, setNewGalleryFiles] = useState([]); // new File objects added
  const [galleryPreview, setGalleryPreview] = useState([]);   // preview URLs for display

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [lightboxSrc, setLightboxSrc] = useState(null);

  useEffect(() => {
    getService();
  }, []);

  const getService = async () => {
    try {
      setFetching(true);
      const response = await axios.get(`http://localhost:5000/api/services/${id}`);
      const service = response.data.data;

      setFormData({
        serviceName: service.serviceName,
        servicePrice: service.servicePrice,
        description: service.description,
        status: service.status,
      });

      setBannerPreview(`http://localhost:5000/uploads/${service.bannerImage}`);
      setExistingGallery(service.galleryImages || []);
      setGalleryPreview(
        (service.galleryImages || []).map(
          (img) => ({ type: "existing", src: `http://localhost:5000/uploads/${img}`, filename: img })
        )
      );
    } catch (error) {
      toast.error("Failed to load service details.");
    } finally {
      setFetching(false);
    }
  };

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

    // Banner is mandatory — must have either an existing preview or a new file
    if (!bannerPreview && !bannerFile) {
      newErrors.bannerImage = "Banner image is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
    setBannerRemoved(false);
  };

  const removeBanner = () => {
    setBannerFile(null);
    setBannerPreview("");
    setBannerRemoved(true); // tell backend to clear the banner
  };

  // ── Gallery ───────────────────────────────────────────────

  const handleGalleryChange = (e) => {
    const selectedFiles = Array.from(e.target.files).filter(isValidImage);

    // Reset input so the same file can be re-selected after removing it
    e.target.value = "";

    if (selectedFiles.length === 0) return;

    // Collect names already in the gallery to detect duplicates
    // existingGallery has multer filenames like "1734567890-photo.jpg"
    // file.name from browser is just "photo.jpg"
    // So we strip the timestamp prefix before comparing
    const existingNames  = existingGallery.map((filename) => filename.replace(/^\d+-/, ""));
    const newFileNames   = newGalleryFiles.map((file) => file.name);
    const allCurrentNames = [...existingNames, ...newFileNames];

    // Separate unique files from duplicates
    const uniqueFiles    = [];
    const duplicateFiles = [];

    selectedFiles.forEach((file) => {
      if (allCurrentNames.includes(file.name)) {
        duplicateFiles.push(file.name);
      } else {
        uniqueFiles.push(file);
      }
    });

    // Notify user about any duplicates
    if (duplicateFiles.length > 0) {
      toast.info(
        duplicateFiles.length === 1
          ? `"${duplicateFiles[0]}" is already added.`
          : `${duplicateFiles.length} images are already added.`
      );
    }

    if (uniqueFiles.length === 0) return;

    // Add unique new files to state
    setNewGalleryFiles((prev) => [...prev, ...uniqueFiles]);

    // Add preview entries for the new files
    const newPreviews = uniqueFiles.map((file) => ({
      type: "new",
      src: URL.createObjectURL(file),
      name: file.name, // store name so we can match it during removal
    }));

    setGalleryPreview((prev) => [...prev, ...newPreviews]);
  };

  const removeGalleryImage = (index) => {
    const item = galleryPreview[index];

    if (item.type === "existing") {
      // Remove this filename from the existing list so it won't be sent as keepGalleryImages
      setExistingGallery((prev) => prev.filter((f) => f !== item.filename));
    } else {
      // Remove the matching File object from newGalleryFiles using the stored name
      setNewGalleryFiles((prev) => prev.filter((file) => file.name !== item.name));
    }

    // Remove from preview list using index — always correct regardless of type
    setGalleryPreview((prev) => prev.filter((_, i) => i !== index));
  };

  // ── Submit ────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validate()) {
      toast.error("Please fix the errors before saving.");
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();

      data.append("serviceName", formData.serviceName.trim());
      data.append("servicePrice", formData.servicePrice);
      data.append("description", formData.description.trim());
      data.append("status", formData.status);

      // Banner: send new file OR tell backend to remove
      if (bannerFile) {
        data.append("bannerImage", bannerFile);
      } else if (bannerRemoved) {
        data.append("removeBanner", "true");
      }

      // Gallery: send list of existing filenames to keep
      existingGallery.forEach((filename) => {
        data.append("keepGalleryImages", filename);
      });

      // Gallery: send new files
      newGalleryFiles.forEach((file) => {
        data.append("galleryImages", file);
      });

      await axios.put(`http://localhost:5000/api/services/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Service updated successfully!");
      navigate("/adminServices");
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <AdminLayout>
        <div className="page-loading">Loading service details...</div>
      </AdminLayout>
    );
  }

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
      <div className="editServices">

        {/* ── Header ── */}
        <div className="editServices-header">
          <div>
            <h2>Edit Service</h2>
            <p>Update and manage service details</p>
          </div>
        </div>

        {/* ── Form Card ── */}
        <div className="editServices-card">
          <h3>Basic Information</h3>

          <div className="editServices-grid">

            <div className="formGroup">
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

            <div className="formGroup">
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

            <div className="formGroup">
              <label>Status</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

          </div>

          <div className="formGroup">
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
              <span className="char-count">{formData.description.length}/1000</span>
            </div>
          </div>

          {/* ── Media ── */}
          <h3>Media</h3>
          <div className="service-upload-row">

            {/* Banner */}
            <div className="addService-formGroup">
              <label>Banner Image *</label>
              {bannerPreview ? (
                <div className="service-imagePreviewContainer">
                  <img src={bannerPreview} alt="Banner" />
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
                <div className={`service-uploadPlaceholder ${errors.bannerImage ? "upload-error" : ""}`}>
                  <Upload size={32} className="upload-cloud-icon" />
                  <p>Select banner image or drag & drop</p>
                  <span>JPEG, PNG — max {MAX_FILE_SIZE_MB}MB</span>
                  <input
                    type="file"
                    id="edit-banner"
                    accept="image/jpeg,image/png"
                    onChange={handleBannerChange}
                  />
                  <label htmlFor="edit-banner" className="file-browse-btn">
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
              <label>
                Gallery Images
                <span className="gallery-count-label">
                  {" "}({galleryPreview.length} image{galleryPreview.length !== 1 ? "s" : ""})
                </span>
              </label>
              <div className="service-uploadPlaceholder">
                <Upload size={32} className="upload-cloud-icon" />
                <p>Add more gallery images</p>
                <span>JPEG, PNG — max {MAX_FILE_SIZE_MB}MB each</span>
                <input
                  type="file"
                  id="edit-gallery"
                  multiple
                  accept="image/jpeg,image/png"
                  onChange={handleGalleryChange}
                />
                <label htmlFor="edit-gallery" className="file-browse-btn">
                  Browse Files
                </label>
              </div>
              {galleryPreview.length > 0 && (
                <div className="gallery-preview-grid">
                  {galleryPreview.map((item, index) => (
                    <div className="gallery-preview-item" key={index}>
                      <img
                        src={item.src}
                        alt={`Gallery ${index + 1}`}
                        onClick={() => setLightboxSrc(item.src)}
                        className="gallery-zoomable"
                      />
                      {item.type === "new" && (
                        <span className="gallery-new-badge">New</span>
                      )}
                      <button type="button" onClick={() => removeGalleryImage(index)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* ── Actions ── */}
          <div className="editServices-actions">
            <button
              className="cancelBtn"
              onClick={() => navigate("/adminServices")}
              disabled={loading}
            >
              <ArrowLeft size={18} />
              Cancel
            </button>
            <button
              className="saveBtn"
              onClick={handleSubmit}
              disabled={loading}
            >
              <Save size={18} />
              {loading ? "Saving..." : "Update Service"}
            </button>
          </div>

        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </AdminLayout>
  );
};

export default EditServices;