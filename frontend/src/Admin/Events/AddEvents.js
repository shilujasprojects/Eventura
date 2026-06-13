import React, { useState } from "react";
import "./AddEvents.css";

const AddEvent = () => {
  const [selectedPackages, setSelectedPackages] = useState([]);

  const packages = [
    "Basic Package",
    "Premium Package",
    "Luxury Package",
    "Royal Package",
  ];

  const handlePackageChange = (pkg) => {
    setSelectedPackages((prev) =>
      prev.includes(pkg)
        ? prev.filter((item) => item !== pkg)
        : [...prev, pkg]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log({
      packages: selectedPackages,
    });
  };

  return (
    <div className="addEvent">
      {/* Header */}

      <div className="addEvent-header">
        <h2>Add Event</h2>
        <p>Create a new event for Eventura</p>
      </div>

      {/* Card */}

      <div className="addEvent-card">
        <form onSubmit={handleSubmit}>
          {/* Row 1 */}

          <div className="addEvent-formRow">
            <div className="addEvent-formGroup">
              <label>Event Name</label>

              <input
                type="text"
                placeholder="Enter Event Name"
              />
            </div>

            <div className="addEvent-formGroup">
              <label>Event Category</label>

              <select>
                <option>Wedding</option>
                <option>Birthday</option>
                <option>Engagement</option>
                <option>Baby Shower</option>
                <option>Anniversary</option>
                <option>Housewarming</option>
                <option>Corporate Event</option>
                <option>Funeral Service</option>
              </select>
            </div>

            <div className="addEvent-formGroup">
              <label>Starting Price</label>

              <input
                type="number"
                placeholder="Enter Price"
              />
            </div>

            <div className="addEvent-formGroup">
              <label>Status</label>

              <select>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>

          {/* Row 2 */}

          <div className="addEvent-formRow">
            <div className="addEvent-formGroup">
              <label>Cover Image</label>

              <input type="file" />
            </div>

            <div className="addEvent-formGroup">
              <label>Gallery Images (Optional)</label>

              <input type="file" multiple />
            </div>
          </div>

          {/* Short Description */}

          <div className="addEvent-formGroup">
            <label>Short Description</label>

            <textarea
              rows="3"
              placeholder="Enter Short Description"
            />
          </div>

          {/* Long Description */}

          <div className="addEvent-formGroup">
            <label>Long Description</label>

            <textarea
              rows="6"
              placeholder="Enter Full Event Description"
            />
          </div>

          {/* Packages */}

          <div className="addEvent-packages">
            <h4>Available Packages</h4>

            <div className="addEvent-packagesGrid">
              {packages.map((pkg) => (
                <label
                  key={pkg}
                  className="addEvent-packageItem"
                >
                  <input
                    type="checkbox"
                    onChange={() =>
                      handlePackageChange(pkg)
                    }
                  />

                  {pkg}
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="addEvent-submitBtn"
          >
            Create Event
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEvent;