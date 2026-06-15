import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./CategoryEvents.css";
import AdminLayout from "../../Pages/Admin/Layout/AdminLayout";

const EditCategoryEvents = () => {
  const navigate = useNavigate();

  const [category, setCategory] = useState({
    name: "Wedding",
    status: "Active",
    description:
      "Wedding events including traditional, destination and luxury weddings.",
  });

  const handleChange = (e) => {
    setCategory({
      ...category,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(category);
  };

  return (
   <>
    <AdminLayout>
         <div className="editCategory">

      <div className="editCategory-header">
        <h2>Edit Category</h2>
        <p>Update category details</p>
      </div>

      <div className="editCategory-card">

        <form onSubmit={handleSubmit}>

          <div className="editCategory-formRow">

            <div className="editCategory-formGroup">
              <label>Category Name</label>

              <input
                type="text"
                name="name"
                value={category.name}
                onChange={handleChange}
              />
            </div>

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

            <div className="editCategory-formGroup">
              <label>Category Image</label>

              <input type="file" />
            </div>

          </div>

          <div className="editCategory-formGroup">
            <label>Description</label>

            <textarea
              rows="5"
              name="description"
              value={category.description}
              onChange={handleChange}
            />
          </div>

          <div className="editCategory-actions">

            <button
              type="button"
              className="editCategory-cancelBtn"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="editCategory-submitBtn"
            >
              Update Category
            </button>

          </div>

        </form>

      </div>

    </div>
    </AdminLayout>
   </>
  );
};

export default EditCategoryEvents;