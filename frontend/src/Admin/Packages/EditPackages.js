import React, { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";

import "./Packages.css";
import AdminLayout from "../../Pages/Admin/Layout/AdminLayout";

const EditPackages = () => {
  const navigate = useNavigate();

  const services = [
    "Catering",
    "Photography",
    "Videography",
    "Decoration",
    "Makeup",
    "DJ & Music",
    "Transportation",
    "Cake Service",
  ];

  const [formData, setFormData] = useState({
    packageName: "Royal Wedding Package",
    category: "Wedding",
    price: "150000",
    status: "Active",
    description:
      "Luxury wedding package including catering, photography and decoration.",
    services: [
      "Catering",
      "Photography",
      "Decoration",
    ],
  });

  const handleServiceChange = (service) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(
            (item) => item !== service
          )
        : [...prev.services, service],
    }));
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);

    // Update API Call
  };

  return (
    <>
    <AdminLayout>
        <div className="editPackage">

      <div className="editPackage-header">

        <div>
          <h2>Edit Package</h2>
          <p>
            Update package details and services
          </p>
        </div>

        <button
          className="editPackage-backBtn"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} />
          Back
        </button>

      </div>

      <div className="editPackage-card">

        <form onSubmit={handleSubmit}>

          <div className="editPackage-grid">

            <div className="editPackage-formGroup">
              <label>Package Name</label>

              <input
                type="text"
                name="packageName"
                value={formData.packageName}
                onChange={handleChange}
              />
            </div>

            <div className="editPackage-formGroup">
              <label>Event Category</label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option>Wedding</option>
                <option>Birthday</option>
                <option>Engagement</option>
                <option>Baby Shower</option>
                <option>Anniversary</option>
                <option>Housewarming</option>
                <option>Corporate</option>
                <option>Funeral</option>
              </select>
            </div>

            <div className="editPackage-formGroup">
              <label>Package Price</label>

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
              />
            </div>

            <div className="editPackage-formGroup">
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

          <div className="editPackage-formGroup">
            <label>Description</label>

            <textarea
              rows="5"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="editPackage-services">

            <h4>Included Services</h4>

            <div className="editPackage-servicesGrid">

              {services.map((service) => (
                <label
                  key={service}
                  className="editPackage-serviceItem"
                >
                  <input
                    type="checkbox"
                    checked={formData.services.includes(
                      service
                    )}
                    onChange={() =>
                      handleServiceChange(service)
                    }
                  />

                  {service}
                </label>
              ))}

            </div>

          </div>

          <div className="editPackage-actions">

            <button
              type="button"
              className="editPackage-cancelBtn"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="editPackage-submitBtn"
            >
              <Save size={18} />
              Update Package
            </button>

          </div>

        </form>

      </div>

    </div>
    </AdminLayout>
    </>
  );
};

export default EditPackages;