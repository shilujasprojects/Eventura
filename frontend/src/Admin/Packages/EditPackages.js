import React, { useState, useEffect } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import "./Packages.css";
import AdminLayout from "../../Pages/Admin/Layout/AdminLayout";


const TAG_OPTIONS = ["Recommended", "Featured", "Popular", "Best Seller", "Trending", "Luxury", "New"];

const EditPackages = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    packageName: "",
    category: "",
    description: "",
    discountType: "Percentage",
    discountValue: "",
    status: "Active",
    tags: [],
  });

  useEffect(() => {
    fetchCategories();
    fetchServices();
    fetchPackage();
  }, [id]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/category");
      setCategories(res.data || []);
    } catch {
      toast.error("Failed to load categories.");
    }
  };

  const fetchServices = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/services");
      setServices((res.data.data || []).filter((s) => s.status === "Active"));
    } catch {
      toast.error("Failed to load services.");
    }
  };

  const fetchPackage = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/packages/${id}`);
      const pkg = res.data.data;

      setFormData({
        packageName: pkg.packageName || "",
        category: pkg.category?._id || "",
        description: pkg.description || "",
        discountType: pkg.packageDiscount?.type || "Percentage",
        discountValue: pkg.packageDiscount?.value || "",
        status: pkg.status || "Active",
        tags: pkg.tags || [],
      });

      setSelectedServices(
        (pkg.services || []).map((s) => ({ service: s.service._id, isOptional: s.isOptional }))
      );
    } catch {
      toast.error("Failed to load package.");
      navigate("/adminPackages");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagToggle = (tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
    }));
  };

  const handleServiceToggle = (serviceId) => {
    setSelectedServices((prev) => {
      const exists = prev.find((s) => s.service === serviceId);
      if (exists) return prev.filter((s) => s.service !== serviceId);
      return [...prev, { service: serviceId, isOptional: false }];
    });
  };

  const handleOptionalToggle = (serviceId) => {
    setSelectedServices((prev) =>
      prev.map((s) => (s.service === serviceId ? { ...s, isOptional: !s.isOptional } : s))
    );
  };

  // Package price is derived from selected services, same as AddPackages
  const originalPrice = selectedServices.reduce((sum, s) => {
    const service = services.find((sv) => sv._id === s.service);
    return service ? sum + service.servicePrice : sum;
  }, 0);

  const discountValue = Number(formData.discountValue) || 0;

  let finalPrice = originalPrice;

  if (formData.discountType === "Percentage") {
    finalPrice = originalPrice - (originalPrice * discountValue) / 100;
  } else if (formData.discountType === "Flat") {
    finalPrice = originalPrice - discountValue;
  }

  finalPrice = Math.max(0, finalPrice);
  const amountSaved = Math.max(0, originalPrice - finalPrice);

  const validate = () => {
    const newErrors = {};
    if (!formData.packageName.trim()) newErrors.packageName = "Package name is required.";
    if (!formData.category) newErrors.category = "Select a category.";
    if (selectedServices.length === 0) newErrors.services = "Select at least one service.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    const payload = {
      packageName: formData.packageName,
      category: formData.category,
      description: formData.description,
      basePrice: originalPrice,
      packageDiscount: { type: formData.discountType, value: Number(formData.discountValue) || 0 },
      tags: formData.tags,
      status: formData.status,
      services: selectedServices,
    };

    try {
      await axios.put(`http://localhost:5000/api/packages/edit-package/${id}`, payload);
      toast.success("Package updated successfully!");
      navigate("/adminPackages");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update package.");
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="editPackage"><p style={{ color: "#fff7ee" }}>Loading package...</p></div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="editPackage">
        <div className="editPackage-header">
          <div>
            <h2>Edit Package</h2>
            <p>Update package details and services</p>
          </div>
          <button className="editPackage-backBtn" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} /> Back
          </button>
        </div>

        <div className="editPackage-card">
          <form onSubmit={handleSubmit}>
            <div className="editPackage-grid">
              <div className="editPackage-formGroup">
                <label>Package Name</label>
                <input type="text" name="packageName" value={formData.packageName} onChange={handleChange} />
                {errors.packageName && <small style={{ color: "#ef4444" }}>{errors.packageName}</small>}
              </div>

              <div className="editPackage-formGroup">
                <label>Event Category</label>
                <select name="category" value={formData.category} onChange={handleChange}>
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.categoryName}</option>
                  ))}
                </select>
                {errors.category && <small style={{ color: "#ef4444" }}>{errors.category}</small>}
              </div>

              <div className="editPackage-formGroup">
                <label>Package Price (auto)</label>
                <input
                  type="text"
                  value={`₹ ${originalPrice.toLocaleString()}`}
                  disabled
                />
              </div>

              <div className="editPackage-formGroup">
                <label>Status</label>
                <select name="status" value={formData.status} onChange={handleChange}>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
            </div>

            <div className="editPackage-discountRow">
              <div className="editPackage-formGroup">
                <label>Discount Type</label>
                <select name="discountType" value={formData.discountType} onChange={handleChange}>
                  <option value="Percentage">Percentage (%)</option>
                  <option value="Flat">Flat (₹)</option>
                </select>
              </div>

              <div className="editPackage-formGroup">
                <label>Discount Value</label>
                <input type="number" name="discountValue" value={formData.discountValue} onChange={handleChange} />
              </div>
            </div>

            <div className="editPackage-priceSummary">
              <h4>Pricing Summary</h4>

              <div className="priceSummaryRow">
                <span>Original Price</span>
                <strong>₹{originalPrice.toLocaleString()}</strong>
              </div>

              <div className="priceSummaryRow">
                <span>Discount</span>
                <strong>
                  {discountValue > 0
                    ? formData.discountType === "Percentage"
                      ? `${discountValue}%`
                      : `₹${discountValue.toLocaleString()}`
                    : "None"}
                </strong>
              </div>

              <div className="priceSummaryRow saved">
                <span>You Save</span>
                <strong>₹{amountSaved.toLocaleString()}</strong>
              </div>

              <div className="priceSummaryRow finalPrice">
                <span>Final Price</span>
                <strong>₹{finalPrice.toLocaleString()}</strong>
              </div>
            </div>

            <div className="editPackage-formGroup">
              <label>Description</label>
              <textarea rows="5" name="description" value={formData.description} onChange={handleChange} />
            </div>

            <div className="editPackage-services">
              <h4>Included Services</h4>
              {errors.services && <small style={{ color: "#ef4444" }}>{errors.services}</small>}

              <div className="editPackage-servicesGrid">
                {services.map((service) => {
                  const selected = selectedServices.find((s) => s.service === service._id);
                  return (
                    <div
                      key={service._id}
                      className={`pkg-serviceCard ${selected ? "selected" : ""}`}
                      onClick={() => handleServiceToggle(service._id)}
                    >
                      <div className="pkg-serviceCard-top">
                        <div className="pkg-serviceCard-name">{service.serviceName}</div>

                        <label className="pkg-checkbox" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={!!selected}
                            onChange={() => handleServiceToggle(service._id)}
                          />
                          <span className="box">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </span>
                        </label>
                      </div>

                      <div className="pkg-serviceCard-price">₹{service.servicePrice}</div>

                      {selected && (
                        <label
                          className="pkg-serviceCard-optional"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className="pkg-checkbox">
                            <input
                              type="checkbox"
                              checked={selected.isOptional}
                              onChange={() => handleOptionalToggle(service._id)}
                            />
                            <span className="box">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            </span>
                          </span>
                          Mark as optional
                        </label>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="editPackage-services">
              <h4>Tags</h4>
              <div className="editPackage-tagsGrid">
                {TAG_OPTIONS.map((tag) => (
                  <button
                    type="button"
                    key={tag}
                    className={`pkg-tagBtn ${formData.tags.includes(tag) ? "active" : ""}`}
                    onClick={() => handleTagToggle(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="editPackage-actions">
              <button type="button" className="editPackage-cancelBtn" onClick={() => navigate(-1)}>Cancel</button>
              <button type="submit" className="editPackage-submitBtn"><Save size={18} /> Update Package</button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EditPackages;