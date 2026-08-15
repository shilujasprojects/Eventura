import React, { useState, useRef } from "react";
import "./CategoryEvents.css";
import AdminLayout from "../../Pages/Admin/Layout/AdminLayout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Small inline icons so we don't need an extra icon package
const UploadIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 16V4M12 4L7 9M12 4l5 5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0-1 14a2 2 0 01-2 2H7a2 2 0 01-2-2L4 6h16z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_MB = 5;

const AddCategoryEvents = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Active");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ---------- validation ----------
  const validate = () => {
    const newErrors = {};
    const trimmedName = categoryName.trim();
    const trimmedDesc = description.trim();

    if (!trimmedName) newErrors.categoryName = "Category name is required.";
    else if (trimmedName.length < 3)
      newErrors.categoryName = "Category name must be at least 3 characters.";
    else if (trimmedName.length > 50)
      newErrors.categoryName = "Category name must be under 50 characters.";

    if (!trimmedDesc) newErrors.description = "Description is required.";
    else if (trimmedDesc.length < 10)
      newErrors.description = "Description must be at least 10 characters.";
    else if (trimmedDesc.length > 500)
      newErrors.description = "Description must be under 500 characters.";

    if (!image) newErrors.image = "Category cover image is required.";

    return newErrors;
  };

  // ---------- image handling (shared by browse + drag/drop) ----------
  const processFile = (file) => {
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        image: "Only JPG, PNG or WEBP images are allowed.",
      }));
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        image: `Image must be under ${MAX_SIZE_MB} MB.`,
      }));
      return;
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, image: null }));
  };

  const handleImageChange = (e) => {
    processFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    processFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ---------- submit ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the errors before submitting.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("categoryName", categoryName.trim());
      formData.append("description", description.trim());
      formData.append("status", status);
      formData.append("image", image);

      await axios.post(
        "http://localhost:5000/api/category/create-category",
        formData
      );

      toast.success("Category created successfully!");
      setTimeout(() => navigate("/adminCategoryEvent"), 1500);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AdminLayout>
        <div className="addCategory">
          {/* Header */}
          <div className="addCategory-header">
            <h2>Add Category</h2>
            <p>Create a new event category</p>
          </div>

          {/* Card */}
          <div className="addCategory-card">
            <form onSubmit={handleSubmit} noValidate>
              {/* Row 1: Name + Status */}
              <div className="addCategory-formRow name-status">
                <div className="addCategory-formGroup">
                  <label>
                    Category Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Category Name"
                    value={categoryName}
                    onChange={(e) => {
                      setCategoryName(e.target.value);
                      setErrors((prev) => ({ ...prev, categoryName: null }));
                    }}
                    className={errors.categoryName ? "input-error" : ""}
                  />
                  {errors.categoryName && (
                    <span className="error-msg">{errors.categoryName}</span>
                  )}
                </div>

                <div className="addCategory-formGroup">
                  <label>Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Cover Image + Description */}
              <div className="addCategory-formRow media-description">
                <div className="addCategory-formGroup">
                  <label>
                    Category Cover Image <span className="required">*</span>
                  </label>

                  {!imagePreview ? (
                    <div
                      className={`imageUpload-dropzone ${isDragging ? "dragging" : ""} ${
                        errors.image ? "input-error" : ""
                      }`}
                      onClick={() => fileInputRef.current.click()}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <UploadIcon />
                      <p className="imageUpload-text">
                        Drag & drop your image here
                      </p>
                      <span className="imageUpload-orText">or</span>
                      <button
                        type="button"
                        className="imageUpload-browseBtn"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current.click();
                        }}
                      >
                        Browse Local Files
                      </button>
                      <p className="imageUpload-formats">
                        Supported formats: JPEG, PNG (Max {MAX_SIZE_MB}MB)
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg, image/png, image/webp"
                        onChange={handleImageChange}
                        hidden
                      />
                    </div>
                  ) : (
                    <div className="imageUpload-previewBox">
                      <img
                        src={imagePreview}
                        alt="Category Preview"
                        className="imageUpload-previewImg"
                        onClick={() => setLightboxOpen(true)}
                        title="Click to enlarge"
                      />
                      <button
                        type="button"
                        className="imageUpload-removeBtn"
                        onClick={handleRemoveImage}
                        title="Remove image"
                      >
                        <TrashIcon />
                      </button>
                      <span className="image-preview-hint">
                        Click image to enlarge
                      </span>
                    </div>
                  )}

                  {errors.image && (
                    <span className="error-msg">{errors.image}</span>
                  )}
                </div>

                <div className="addCategory-formGroup">
                  <label>
                    Short Description <span className="required">*</span>
                  </label>
                  <textarea
                    placeholder="Enter Category Description (min 10 characters)"
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      setErrors((prev) => ({ ...prev, description: null }));
                    }}
                    className={errors.description ? "input-error" : ""}
                  />
                  {errors.description && (
                    <span className="error-msg">{errors.description}</span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="addCategory-actions">
                <button
                  type="button"
                  className="addCategory-cancelBtn"
                  onClick={() => navigate("/adminCategoryEvent")}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="addCategory-submitBtn"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Lightbox */}
        {lightboxOpen && imagePreview && (
          <div
            className="lightbox-overlay"
            onClick={() => setLightboxOpen(false)}
          >
            <div className="lightbox-box" onClick={(e) => e.stopPropagation()}>
              <button
                className="lightbox-close"
                onClick={() => setLightboxOpen(false)}
              >
                ✕
              </button>
              <img src={imagePreview} alt="Full Preview" />
            </div>
          </div>
        )}

        <ToastContainer position="top-right" autoClose={3000} />
      </AdminLayout>
    </>
  );
};

export default AddCategoryEvents;