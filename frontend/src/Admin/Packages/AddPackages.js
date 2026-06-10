import React, { useState } from "react";

import "./AddPackages.css";

const AddPackages = () => {
  const [selectedServices, setSelectedServices] =
    useState([]);

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

  const handleServiceChange = (service) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((item) => item !== service)
        : [...prev, service]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log({
      services: selectedServices,
    });
  };

  return (
    <div className="addPackage">

      {/* Header */}

      <div className="addPackage-header">

        <h2>Add Package</h2>

        <p>Create a new package for Eventura</p>

      </div>

      {/* Card */}

      <div className="addPackage-card">

        <form onSubmit={handleSubmit}>

          <div className="addPackage-grid">

            <div className="addPackage-formGroup">
              <label>Package Name</label>

              <input
                type="text"
                placeholder="Enter Package Name"
              />
            </div>

            <div className="addPackage-formGroup">
              <label>Event Category</label>

              <select>
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

            <div className="addPackage-formGroup">
              <label>Package Price</label>

              <input
                type="number"
                placeholder="Enter Price"
              />
            </div>

            <div className="addPackage-formGroup">
              <label>Status</label>

              <select>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>

          </div>

          <div className="addPackage-formGroup">
            <label>Package Image</label>

            <input type="file" />
          </div>

          <div className="addPackage-formGroup">
            <label>Description</label>

            <textarea
              rows="4"
              placeholder="Enter Package Description"
            />
          </div>

          <div className="addPackage-formGroup">

            <label>Services Included</label>

            <div className="addPackage-servicesGrid">

              {services.map((service) => (
                <label
                  key={service}
                  className="addPackage-serviceItem"
                >
                  <input
                    type="checkbox"
                    onChange={() =>
                      handleServiceChange(service)
                    }
                  />

                  {service}
                </label>
              ))}

            </div>

          </div>

          <button
            type="submit"
            className="addPackage-submitBtn"
          >
            Save Package
          </button>

        </form>

      </div>

    </div>
  );
};

export default AddPackages;