import React, { useState } from "react";
import "./CategoryEvents.css";
import AdminLayout from "../../Pages/Admin/Layout/AdminLayout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddCategoryEvents = () => {
  const navigate = useNavigate();

  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Active");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ---------- validation ----------
  const validate = () => {
    const newErrors = {};
    if (!categoryName.trim())
      newErrors.categoryName = "Category name is required.";
    else if (categoryName.trim().length < 3)
      newErrors.categoryName = "Category name must be at least 3 characters.";

    if (!description.trim())
      newErrors.description = "Description is required.";
    else if (description.trim().length < 10)
      newErrors.description = "Description must be at least 10 characters.";

    if (!image) newErrors.image = "Category image is required.";

    return newErrors;
  };

  // ---------- image pick ----------
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        image: "Only JPG, PNG or WEBP images are allowed.",
      }));
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: "Image must be under 2 MB." }));
      return;
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, image: null }));
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
              {/* Row */}
              <div className="addCategory-formRow">
                {/* Category Name */}
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

                {/* Status */}
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

                {/* Image */}
                <div className="addCategory-formGroup">
                  <label>
                    Category Image <span className="required">*</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className={errors.image ? "input-error" : ""}
                  />
                  {errors.image && (
                    <span className="error-msg">{errors.image}</span>
                  )}
                  {/* Preview */}
                  {imagePreview && (
                    <div className="image-preview-wrapper">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="image-preview-thumb"
                        onClick={() => setLightboxOpen(true)}
                        title="Click to enlarge"
                      />
                      <span className="image-preview-hint">
                        Click image to enlarge
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="addCategory-formGroup">
                <label>
                  Short Description <span className="required">*</span>
                </label>
                <textarea
                  rows="4"
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