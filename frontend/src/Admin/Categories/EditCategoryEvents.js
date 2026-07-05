import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./CategoryEvents.css";
import AdminLayout from "../../Pages/Admin/Layout/AdminLayout";

const EditCategoryEvents = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [category, setCategory] = useState({
    categoryName: "",
    description: "",
    status: "Active",
    image: "",
  });
  const [newImage, setNewImage] = useState(null);       // new file picked by user
  const [imagePreview, setImagePreview] = useState(""); // what to show in <img>
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ---------- fetch existing data ----------
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/category/view-category/${id}`
        );
        const data = res.data.data;
        setCategory(data);
        setImagePreview(
          data.image
            ? `http://localhost:5000/uploads/${data.image}`
            : ""
        );
      } catch (error) {
        console.error(error);
        toast.error("Failed to load category details.");
      }
    };
    fetchCategory();
  }, [id]);

  // ---------- field change ----------
  const handleChange = (e) => {
    setCategory({ ...category, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: null }));
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

    setNewImage(file);
    setImagePreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, image: null }));
  };

  // ---------- validation ----------
  const validate = () => {
    const newErrors = {};
    if (!category.categoryName.trim())
      newErrors.categoryName = "Category name is required.";
    else if (category.categoryName.trim().length < 3)
      newErrors.categoryName = "Category name must be at least 3 characters.";

    if (!category.description.trim())
      newErrors.description = "Description is required.";
    else if (category.description.trim().length < 10)
      newErrors.description = "Description must be at least 10 characters.";

    // image: existing image or new image must be present
    if (!imagePreview && !newImage)
      newErrors.image = "Category image is required.";

    return newErrors;
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
      const formdata = new FormData();
      formdata.append("categoryName", category.categoryName.trim());
      formdata.append("description", category.description.trim());
      formdata.append("status", category.status);

      if (newImage) {
        formdata.append("image", newImage);        // new file uploaded
      } else {
        formdata.append("image", category.image);  // keep old filename
      }

      await axios.put(
        `http://localhost:5000/api/category/edit-category/${id}`,
        formdata
      );

      toast.success("Category updated successfully!");
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
        <div className="editCategory">
          {/* Header */}
          <div className="editCategory-header">
            <h2>Edit Category</h2>
            <p>Update category details</p>
          </div>

          <div className="editCategory-card">
            <form onSubmit={handleSubmit} noValidate>
              <div className="editCategory-formRow">
                {/* Category Name */}
                <div className="editCategory-formGroup">
                  <label>
                    Category Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="categoryName"
                    value={category.categoryName}
                    onChange={handleChange}
                    className={errors.categoryName ? "input-error" : ""}
                  />
                  {errors.categoryName && (
                    <span className="error-msg">{errors.categoryName}</span>
                  )}
                </div>

                {/* Status */}
                <div className="editCategory-formGroup">
                  <label>Status</label>
                  <select
                    name="status"
                    value={category.status}
                    onChange={handleChange}
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>

                {/* Image */}
                <div className="editCategory-formGroup">
                  <label>Category Image</label>

                  {/* show existing / new preview */}
                  {imagePreview ? (
                    <div className="image-preview-wrapper">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="image-preview-thumb"
                        onClick={() => setLightboxOpen(true)}
                        title="Click to enlarge"
                        onError={(e) => {
                          e.target.style.display = "none";
                          setImagePreview("");
                        }}
                      />
                      <span className="image-preview-hint">
                        Click image to enlarge
                      </span>
                    </div>
                  ) : (
                    <div className="no-image-placeholder">No image selected</div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className={errors.image ? "input-error" : ""}
                    style={{ marginTop: "10px" }}
                  />
                  {errors.image && (
                    <span className="error-msg">{errors.image}</span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="editCategory-formGroup">
                <label>
                  Description <span className="required">*</span>
                </label>
                <textarea
                  rows="5"
                  name="description"
                  value={category.description}
                  onChange={handleChange}
                  className={errors.description ? "input-error" : ""}
                />
                {errors.description && (
                  <span className="error-msg">{errors.description}</span>
                )}
              </div>

              {/* Actions */}
              <div className="editCategory-actions">
                <button
                  type="button"
                  className="editCategory-cancelBtn"
                  onClick={() => navigate(-1)}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="editCategory-submitBtn"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Category"}
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

export default EditCategoryEvents;