import React from "react";
import "./CategoryEvents.css";
import AdminLayout from "../../Pages/Admin/Layout/AdminLayout";
import { useNavigate } from "react-router-dom";

const AddCategoryEvents = () => {
  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Category Submitted");
  };

  const navigate = useNavigate();

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
            <form onSubmit={handleSubmit}>
              {/* Single Row */}

              <div className="addCategory-formRow">
                <div className="addCategory-formGroup">
                  <label>Category Name</label>

                  <input type="text" placeholder="Enter Category Name" />
                </div>

                <div className="addCategory-formGroup">
                  <label>Status</label>

                  <select>
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>

                <div className="addCategory-formGroup">
                  <label>Category Image</label>

                  <input type="file" />
                </div>
              </div>

              {/* Description */}

              <div className="addCategory-formGroup">
                <label>Short Description</label>

                <textarea rows="4" placeholder="Enter Category Description" />
              </div>

              <div className="addCategory-actions">
                <button
                  type="button"
                  className="addCategory-cancelBtn"
                  onClick={() => navigate("/adminCategoryEvent")}
                >
                  Cancel
                </button>

                <button type="submit" className="addCategory-submitBtn">
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default AddCategoryEvents;
