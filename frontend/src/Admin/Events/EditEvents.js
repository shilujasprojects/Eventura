import React, { useState, useEffect } from "react";
import { Save, ArrowLeft, Upload, Trash2, X, ZoomIn } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import "./Events.css";
import AdminLayout from "../../Pages/Admin/Layout/AdminLayout";

const BASE = "http://localhost:5000";
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/jpg"];
const MAX_MB = 5;

const EditEvent = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [categories, setCategories] = useState([]);
  const [packages, setPackages] = useState([]);
  const [formData, setFormData] = useState({
    eventName: "", category: "", shortDescription: "", longDescription: "", status: "Active",
  });

  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [coverRemoved, setCoverRemoved] = useState(false);
  const [existingGallery, setExistingGallery] = useState([]);
  const [newGalleryFiles, setNewGalleryFiles] = useState([]);
  const [galleryPreview, setGalleryPreview] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [lightboxSrc, setLightboxSrc] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchEvent();
  }, [id]);

  // Fetch packages when category changes
  useEffect(() => {
    if (!formData.category) { setPackages([]); return; }
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

  const fetchEvent = async () => {
    try {
      setFetching(true);
      const res = await axios.get(`${BASE}/api/events/${id}`);
      const event = res.data.data;

      setFormData({
        eventName: event.eventName || "",
        category: event.category?._id || "",
        shortDescription: event.shortDescription || "",
        longDescription: event.longDescription || "",
        status: event.status || "Active",
      });

      setCoverPreview(event.coverImage ? `${BASE}/uploads/${event.coverImage}` : "");
      setExistingGallery(event.galleryImages || []);
      setGalleryPreview(
        (event.galleryImages || []).map((img) => ({
          type: "existing",
          src: `${BASE}/uploads/${img}`,
          filename: img,
        }))
      );
    } catch {
      toast.error("Failed to load event.");
      navigate("/adminEvents");
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const isValidImage = (file) => {
    if (!ACCEPTED_TYPES.includes(file.type)) { toast.error("Only JPEG and PNG images are accepted."); return false; }
    if (file.size > MAX_MB * 1024 * 1024) { toast.error(`Image must be under ${MAX_MB}MB.`); return false; }
    return true;
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (!file || !isValidImage(file)) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
    setCoverRemoved(false);
    setErrors((prev) => ({ ...prev, coverImage: "" }));
  };

  const removeCover = () => {
    setCoverFile(null);
    setCoverPreview("");
    setCoverRemoved(true);
  };

  const handleGalleryChange = (e) => {
    const selected = Array.from(e.target.files).filter(isValidImage);
    e.target.value = "";
    if (!selected.length) return;
    const existingNames = existingGallery.map((f) => f.replace(/^\d+-/, ""));
    const newNames = newGalleryFiles.map((f) => f.name);
    const allNames = [...existingNames, ...newNames];
    const unique = [];
    let dupes = 0;
    selected.forEach((f) => { if (allNames.includes(f.name)) dupes++; else unique.push(f); });
    if (dupes) toast.info(`${dupes} image(s) already added.`);
    if (!unique.length) return;
    setNewGalleryFiles((prev) => [...prev, ...unique]);
    setGalleryPreview((prev) => [...prev, ...unique.map((f) => ({ type: "new", src: URL.createObjectURL(f), name: f.name }))]);
  };

  const removeGalleryImage = (index) => {
    const item = galleryPreview[index];
    if (item.type === "existing") setExistingGallery((prev) => prev.filter((f) => f !== item.filename));
    else setNewGalleryFiles((prev) => prev.filter((f) => f.name !== item.name));
    setGalleryPreview((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    const e = {};
    if (!formData.eventName.trim()) e.eventName = "Event name is required.";
    if (!formData.category) e.category = "Select a category.";
    if (!formData.shortDescription.trim()) e.shortDescription = "Short description is required.";
    else if (formData.shortDescription.trim().length < 10) e.shortDescription = "At least 10 characters.";
    if (!formData.longDescription.trim()) e.longDescription = "Long description is required.";
    else if (formData.longDescription.trim().length < 20) e.longDescription = "At least 20 characters.";
    if (!coverPreview && !coverFile) e.coverImage = "Cover image is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) { toast.error("Please fix the highlighted fields."); return; }

    try {
      setLoading(true);
      const data = new FormData();
      data.append("eventName", formData.eventName.trim());
      data.append("category", formData.category);
      data.append("shortDescription", formData.shortDescription.trim());
      data.append("longDescription", formData.longDescription.trim());
      data.append("status", formData.status);

      if (coverFile) data.append("coverImage", coverFile);
      else if (coverRemoved) data.append("removeCover", "true");

      existingGallery.forEach((filename) => data.append("keepGalleryImages", filename));
      newGalleryFiles.forEach((file) => data.append("galleryImages", file));

      await axios.put(`${BASE}/api/events/edit-event/${id}`, data);
      toast.success("Event updated successfully!");
      navigate("/adminEvents");
    } catch (err) {
      // Cascade block comes back as 400 with reason field
      Swal.fire({
        icon: "warning",
        title: "Cannot Update",
        text: err.response?.data?.message || "Update failed.",
        confirmButtonColor: "#f1d49b",
        background: "#0d2131",
        color: "#fff7ee",
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <AdminLayout><div style={{ color: "#fff7ee", padding: "20px" }}>Loading event...</div></AdminLayout>;

  return (
    <AdminLayout>
      {lightboxSrc && (
        <div className="lightbox-overlay" onClick={() => setLightboxSrc(null)}>
          <button className="lightbox-close"><X size={24} /></button>
          <img src={lightboxSrc} alt="Preview" className="lightbox-img" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      <div className="editEvent">
        <div className="editEvent-header">
          <div>
            <h2>Edit Event</h2>
            <p>Update event information</p>
          </div>
          <button className="editEvent-backBtn" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} /> Back
          </button>
        </div>

        <div className="editEvent-card">
          <form onSubmit={handleSubmit}>
            <div className="editEvent-formRow">
              <div className="editEvent-formGroup">
                <label>Event Name</label>
                <input type="text" name="eventName" value={formData.eventName} onChange={handleChange} />
                {errors.eventName && <small className="field-error">{errors.eventName}</small>}
              </div>
              <div className="editEvent-formGroup">
                <label>Category</label>
                <select name="category" value={formData.category} onChange={handleChange}>
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.categoryName}</option>
                  ))}
                </select>
                {errors.category && <small className="field-error">{errors.category}</small>}
              </div>
              <div className="editEvent-formGroup">
                <label>Status</label>
                <select name="status" value={formData.status} onChange={handleChange}>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
            </div>

            {/* Descriptions — side by side */}
<div className="editEvent-descRow">
  <div className="editEvent-formGroup">
    <label>Short Description</label>
    <textarea
      rows="4"
      name="shortDescription"
      value={formData.shortDescription}
      onChange={handleChange}
    />
    {errors.shortDescription && <small className="field-error">{errors.shortDescription}</small>}
  </div>

  <div className="editEvent-formGroup">
    <label>Long Description</label>
    <textarea
      rows="4"
      name="longDescription"
      value={formData.longDescription}
      onChange={handleChange}
    />
    {errors.longDescription && <small className="field-error">{errors.longDescription}</small>}
  </div>
</div>

{/* Packages under selected category — with services */}
{formData.category && (
  <div className="editEvent-packages">
    <h4>Available Packages</h4>
    {packages.length === 0 ? (
      <p className="pkg-empty">No active packages found under this category.</p>
    ) : (
      <div className="editEvent-packagesGrid">
        {packages.map((pkg) => (
          <div key={pkg._id} className="editEvent-packageCard">
            <div className="pkg-card-header">
              <span className="pkg-name">{pkg.packageName}</span>
              <span className="pkg-price">₹{pkg.basePrice?.toLocaleString("en-IN")}</span>
            </div>
            {pkg.services?.length > 0 && (
              <div className="pkg-services">
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


            <h4 className="eventUpload-title">Media</h4>
            <div className="eventUpload-row">
              <div className="editEvent-formGroup">
                <label>Cover Image</label>
                {coverPreview ? (
                  <div className="eventImagePreviewContainer">
                    <img src={coverPreview} alt="Cover" onClick={() => setLightboxSrc(coverPreview)} />
                    <button type="button" className="zoomPreviewBtn" onClick={() => setLightboxSrc(coverPreview)}><ZoomIn size={18} /></button>
                    <button type="button" className="removePreviewBtn" onClick={removeCover}><Trash2 size={18} /></button>
                  </div>
                ) : (
                  <div className={`eventUploadPlaceholder ${errors.coverImage ? "upload-error" : ""}`}>
                    <Upload size={32} className="upload-cloud-icon" />
                    <p>Select cover image or drag & drop</p>
                    <span>JPEG, PNG — max {MAX_MB}MB</span>
                    <input type="file" id="edit-cover" accept="image/jpeg,image/png" onChange={handleCoverChange} />
                    <label htmlFor="edit-cover" className="file-browse-btn">Browse Files</label>
                  </div>
                )}
                {errors.coverImage && <small className="field-error">{errors.coverImage}</small>}
              </div>

              <div className="editEvent-formGroup">
                <label>
                  Gallery Images
                  <span className="gallery-count-label"> ({galleryPreview.length} image{galleryPreview.length !== 1 ? "s" : ""})</span>
                </label>
                <div className="eventUploadPlaceholder">
                  <Upload size={32} className="upload-cloud-icon" />
                  <p>Add more gallery images</p>
                  <span>JPEG, PNG — max {MAX_MB}MB each</span>
                  <input type="file" id="edit-gallery" multiple accept="image/jpeg,image/png" onChange={handleGalleryChange} />
                  <label htmlFor="edit-gallery" className="file-browse-btn">Browse Files</label>
                </div>
                {galleryPreview.length > 0 && (
                  <div className="galleryPreviewGrid">
                    {galleryPreview.map((item, i) => (
                      <div key={i} className="galleryPreviewItem">
                        <img src={item.src} alt={`Gallery ${i + 1}`} onClick={() => setLightboxSrc(item.src)} />
                        {item.type === "new" && <span className="gallery-new-badge">New</span>}
                        <button type="button" onClick={() => removeGalleryImage(i)}><Trash2 size={16} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="editEvent-btnGroup">
              <button type="button" className="editEvent-cancelBtn" onClick={() => navigate(-1)}>Cancel</button>
              <button type="submit" className="editEvent-submitBtn" disabled={loading}>
                <Save size={18} />
                {loading ? "Saving..." : "Update Event"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </AdminLayout>
  );
};

export default EditEvent;