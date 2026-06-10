import React from "react";

import "./AddServices.css";

const AddServices = () => {
  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Service Saved");
  };

  return (
    <div className="addService">

      <div className="addService-header">
        <h2>Add Service</h2>
        <p>Create a new service for Eventura</p>
      </div>

      <div className="addService-card">

        <form onSubmit={handleSubmit}>

          <div className="addService-grid">

            <div className="addService-formGroup">
              <label>Service Name</label>

              <input
                type="text"
                placeholder="Enter Service Name"
              />
            </div>

            <div className="addService-formGroup">
              <label>Price</label>

              <input
                type="number"
                placeholder="Enter Service Price"
              />
            </div>

          </div>

          <div className="addService-formGroup">
            <label>Short Description</label>

            <textarea
              rows="4"
              placeholder="Enter Service Description"
            />
          </div>

          <div className="addService-grid">

            <div className="addService-formGroup">
              <label>Banner Image</label>

              <input type="file" />
            </div>

            <div className="addService-formGroup">
              <label>Service Status</label>

              <select>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>

          </div>

          <div className="addService-formGroup">
            <label>Gallery Images (Optional)</label>

            <input
              type="file"
              multiple
            />
          </div>

          <button
            type="submit"
            className="addService-submitBtn"
          >
            Save Service
          </button>

        </form>

      </div>

    </div>
  );
};

export default AddServices;