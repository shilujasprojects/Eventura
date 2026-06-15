import React, { useState } from "react";

import "./Events.css";

import { useNavigate } from "react-router-dom";
import AdminLayout from "../../Pages/Admin/Layout/AdminLayout";

const EditEvent = () => {
  const navigate = useNavigate();

  const [selectedPackages, setSelectedPackages] = useState([
    "Basic Package",
    "Luxury Package",
  ]);

  const packages = [
    "Basic Package",
    "Premium Package",
    "Luxury Package",
    "Royal Package",
  ];

  const handlePackageChange = (pkg) => {
    setSelectedPackages((prev) =>
      prev.includes(pkg) ? prev.filter((item) => item !== pkg) : [...prev, pkg],
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Event Updated");
  };

  return (
    <>
      <AdminLayout>
        <div className="editEvent">
          <div className="editEvent-header">
            <h2>Edit Event</h2>

            <p>Update event information</p>
          </div>

          <div className="editEvent-card">
            <form onSubmit={handleSubmit}>
              <div className="editEvent-formRow">
                <div className="editEvent-formGroup">
                  <label>Event Name</label>

                  <input type="text" defaultValue="Royal Beach Wedding" />
                </div>

                <div className="editEvent-formGroup">
                  <label>Category</label>

                  <select defaultValue="Wedding">
                    <option>Wedding</option>
                    <option>Birthday</option>
                    <option>Corporate</option>
                  </select>
                </div>

                <div className="editEvent-formGroup">
                  <label>Price</label>

                  <input type="number" defaultValue="150000" />
                </div>

                <div className="editEvent-formGroup">
                  <label>Status</label>

                  <select defaultValue="Active">
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
              </div>

              <div className="editEvent-formRow">
                <div className="editEvent-formGroup">
                  <label>Cover Image</label>

                  <input type="file" />
                </div>

                <div className="editEvent-formGroup">
                  <label>Gallery Images</label>

                  <input type="file" multiple />
                </div>
              </div>

              <div className="editEvent-descriptionRow">
                <div className="editEvent-formGroup">
                  <label>Short Description</label>

                  <textarea
                    rows="5"
                    defaultValue="Luxury destination wedding package."
                  />
                </div>

                <div className="editEvent-formGroup">
                  <label>Long Description</label>

                  <textarea
                    rows="5"
                    defaultValue="Complete wedding package with catering, photography and decoration."
                  />
                </div>
              </div>

              <div className="editEvent-packages">
                <h4>Available Packages</h4>

                <div className="editEvent-packagesGrid">
                  {packages.map((pkg) => (
                    <label key={pkg} className="editEvent-packageItem">
                      <input
                        type="checkbox"
                        checked={selectedPackages.includes(pkg)}
                        onChange={() => handlePackageChange(pkg)}
                      />

                      {pkg}
                    </label>
                  ))}
                </div>
              </div>

              <div className="editEvent-btnGroup">
                <button
                  type="button"
                  className="editEvent-cancelBtn"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </button>

                <button type="submit" className="editEvent-submitBtn">
                  Update Event
                </button>
              </div>
            </form>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default EditEvent;
