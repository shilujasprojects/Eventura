import React, { useState, useEffect } from "react";
import { Save, Upload, Trash2, X, ZoomIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "./Events.css";
import AdminLayout from "../../Pages/Admin/Layout/AdminLayout";

const BASE = "http://localhost:5000";
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/jpg"];
const MAX_MB = 5;

const AddEvent = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [packages, setPackages] = useState([]);

  const [formData, setFormData] = useState({
    eventName: "",
    category: "",
    shortDescription: "",
    longDescription: "",
    status: "Active",
  });

  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreview, setGalleryPreview] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  // When category changes, fetch packages under that category
  useEffect(() => {
    if (!formData.category) {
      setPackages([]);
      return;
    }
    const fetchPackages = async () => {
      try {
        const res = await axios.get(`${BASE}/api/packages`, {
          params: { category: formData.category, status: "Active" },
        });
        setPackages(res.data.data || res.data || []);
      } catch {
        setPackages([]);
      }
    };
    fetchPackages();
  }, [formData.category]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${BASE}/api/category`);
      const active = (res.data || []).filter((c) => c.status === "Active");
      setCategories(active);
    } catch {
      toast.error("Failed to load categories.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const isValidImage = (file) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Only JPEG and PNG images are accepted.");
      return false;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      toast.error(`Image must be under ${MAX_MB}MB.`);
      return false;
    }
    return true;
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (!file || !isValidImage(file)) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, coverImage: "" }));
  };

  const removeCover = () => {
    setCoverFile(null);
    setCoverPreview("");
  };

  const handleGalleryChange = (e) => {
    const selected = Array.from(e.target.files).filter(isValidImage);
    e.target.value = "";
    if (!selected.length) return;
    const existingNames = galleryFiles.map((f) => f.name);
    const unique = [];
    let dupes = 0;
    selected.forEach((f) => {
      if (existingNames.includes(f.name)) dupes++;
      else unique.push(f);
    });
    if (dupes) toast.info(`${dupes} image(s) already added.`);
    if (!unique.length) return;
    setGalleryFiles((prev) => [...prev, ...unique]);
    setGalleryPreview((prev) => [
      ...prev,
      ...unique.map((f) => ({ src: URL.createObjectURL(f), name: f.name })),
    ]);
  };

  const removeGalleryImage = (index) => {
    const item = galleryPreview[index];
    setGalleryFiles((prev) => prev.filter((f) => f.name !== item.name));
    setGalleryPreview((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    const e = {};
    if (!formData.eventName.trim()) e.eventName = "Event name is required.";
    if (!formData.category) e.category = "Select a category.";
    if (!formData.shortDescription.trim())
      e.shortDescription = "Short description is required.";
    else if (formData.shortDescription.trim().length < 10)
      e.shortDescription = "At least 10 characters.";
    if (!formData.longDescription.trim())
      e.longDescription = "Long description is required.";
    else if (formData.longDescription.trim().length < 20)
      e.longDescription = "At least 20 characters.";
    if (!coverFile) e.coverImage = "Cover image is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();
      data.append("eventName", formData.eventName.trim());
      data.append("category", formData.category);
      data.append("shortDescription", formData.shortDescription.trim());
      data.append("longDescription", formData.longDescription.trim());
      data.append("status", formData.status);
      data.append("coverImage", coverFile);
      galleryFiles.forEach((f) => data.append("galleryImages", f));

      await axios.post(`${BASE}/api/events/create-event`, data);
      toast.success("Event created successfully!");
      navigate("/adminEvents");
    } catch (err) {
      toast.error(err.response?.data?.message || "Create failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      {lightboxSrc && (
        <div className="lightbox-overlay" onClick={() => setLightboxSrc(null)}>
          <button className="lightbox-close">
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

      <div className="addEvent">
        <div className="addEvent-header">
          <h2>Add Event</h2>
          <p>Create a new event for Eventura</p>
        </div>

        <div className="addEvent-card">
          <form onSubmit={handleSubmit}>
            {/* Row 1: Name, Category, Status */}
            <div className="addEvent-formRow">
              <div className="addEvent-formGroup">
                <label>Event Name</label>
                <input
                  type="text"
                  name="eventName"
                  placeholder="Enter Event Name"
                  value={formData.eventName}
                  onChange={handleChange}
                />
                {errors.eventName && (
                  <small className="field-error">{errors.eventName}</small>
                )}
              </div>

              <div className="addEvent-formGroup">
                <label>Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <small className="field-error">{errors.category}</small>
                )}
              </div>

              <div className="addEvent-formGroup">
                <label>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
            </div>

            {/* Descriptions */}
            {/* Descriptions — side by side */}
            <div className="addEvent-descRow">
              <div className="addEvent-formGroup">
                <label>Short Description</label>
                <textarea
                  rows="4"
                  name="shortDescription"
                  placeholder="Brief summary (shown in listings)"
                  value={formData.shortDescription}
                  onChange={handleChange}
                />
                {errors.shortDescription && (
                  <small className="field-error">
                    {errors.shortDescription}
                  </small>
                )}
              </div>

              <div className="addEvent-formGroup">
                <label>Long Description</label>
                <textarea
                  rows="4"
                  name="longDescription"
                  placeholder="Full event description"
                  value={formData.longDescription}
                  onChange={handleChange}
                />
                {errors.longDescription && (
                  <small className="field-error">
                    {errors.longDescription}
                  </small>
                )}
              </div>
            </div>

            {/* Packages under selected category — with services */}
            {formData.category && (
              <div className="addEvent-packages">
                <h4>Available Packages</h4>
                {packages.length === 0 ? (
                  <p className="pkg-empty">
                    No active packages found under this category.
                  </p>
                ) : (
                  <div className="addEvent-packagesGrid">
                    {packages.map((pkg) => (
                      <div key={pkg._id} className="addEvent-packageCard">
                        <div className="pkg-card-header">
                          <span className="pkg-name">{pkg.packageName}</span>
                          <span className="pkg-price">
                            ₹{pkg.basePrice?.toLocaleString("en-IN")}
                          </span>
                        </div>
                        {pkg.services?.length > 0 && (
                          <div className="pkg-services">
                            <p className="mt-3">
                              Services included listed below :{" "}
                            </p>
                            {pkg.services.map((s, i) => (
                              <span key={i} className="pkg-service-tag">
                                {s.service?.serviceName || "Service"}
                                {s.isOptional && <em> (optional)</em>}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Media */}
            <h4 className="eventUpload-title">Media</h4>
            <div className="eventUpload-row">
              <div className="addEvent-formGroup">
                <label>Cover Image</label>
                {coverPreview ? (
                  <div className="eventImagePreviewContainer">
                    <img
                      src={coverPreview}
                      alt="Cover"
                      onClick={() => setLightboxSrc(coverPreview)}
                    />
                    <button
                      type="button"
                      className="zoomPreviewBtn"
                      onClick={() => setLightboxSrc(coverPreview)}
                    >
                      <ZoomIn size={18} />
                    </button>
                    <button
                      type="button"
                      className="removePreviewBtn"
                      onClick={removeCover}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ) : (
                  <div
                    className={`eventUploadPlaceholder ${errors.coverImage ? "upload-error" : ""}`}
                  >
                    <Upload size={32} className="upload-cloud-icon" />
                    <p>Select cover image or drag & drop</p>
                    <span>JPEG, PNG — max {MAX_MB}MB</span>
                    <input
                      type="file"
                      id="add-cover"
                      accept="image/jpeg,image/png"
                      onChange={handleCoverChange}
                    />
                    <label htmlFor="add-cover" className="file-browse-btn">
                      Browse Files
                    </label>
                  </div>
                )}
                {errors.coverImage && (
                  <small className="field-error">{errors.coverImage}</small>
                )}
              </div>

              <div className="addEvent-formGroup">
                <label>
                  Gallery Images
                  <span className="gallery-count-label">
                    {" "}
                    ({galleryPreview.length} image
                    {galleryPreview.length !== 1 ? "s" : ""})
                  </span>
                </label>
                <div className="eventUploadPlaceholder">
                  <Upload size={32} className="upload-cloud-icon" />
                  <p>Add gallery images</p>
                  <span>JPEG, PNG — max {MAX_MB}MB each</span>
                  <input
                    type="file"
                    id="add-gallery"
                    multiple
                    accept="image/jpeg,image/png"
                    onChange={handleGalleryChange}
                  />
                  <label htmlFor="add-gallery" className="file-browse-btn">
                    Browse Files
                  </label>
                </div>
                {galleryPreview.length > 0 && (
                  <div className="galleryPreviewGrid">
                    {galleryPreview.map((item, i) => (
                      <div key={i} className="galleryPreviewItem">
                        <img
                          src={item.src}
                          alt={`Gallery ${i + 1}`}
                          onClick={() => setLightboxSrc(item.src)}
                        />
                        <span className="gallery-new-badge">New</span>
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(i)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="addEvent-btnGroup">
              <button
                type="button"
                className="addEvent-cancelBtn"
                onClick={() => navigate("/adminEvents")}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="addEvent-submitBtn"
                disabled={loading}
              >
                <Save size={18} />
                {loading ? "Creating..." : "Create Event"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </AdminLayout>
  );
};

export default AddEvent;
