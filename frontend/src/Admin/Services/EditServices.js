import React from "react";
import {  Save, ArrowLeft } from "lucide-react";
import "./Services.css";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../Pages/Admin/Layout/AdminLayout";

const EditServices = () => {
    const navigate = useNavigate();
  return (
    <>
    <AdminLayout>
      <div className="editServices">

      {/* Header */}

      <div className="editServices-header">

        <div>
          <h2>Edit Service</h2>
          <p>Update and manage service details</p>
        </div>

      </div>

      {/* Top Card */}

      <div className="editServices-overview">

        <div className="editServices-bannerCard">

          <img
            src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc"
            alt="service"
          />

        </div>

        <div className="editServices-statusCard">

          <h4>Service Status</h4>

          <span className="service-active">
            ● Active
          </span>

          <p>Created : 12 Jun 2026</p>
          <p>Updated : Today</p>

        </div>

      </div>

      {/* Form */}

      <div className="editServices-card">

        <h3>Basic Information</h3>

        <div className="editServices-grid">

          <div className="formGroup">
            <label>Service Name</label>
            <input
              type="text"
              defaultValue="Photography"
            />
          </div>

          <div className="formGroup">
            <label>Price</label>
            <input
              type="number"
              defaultValue="10000"
            />
          </div>

        </div>

        <div className="formGroup">
          <label>Short Description</label>

          <textarea
            rows="4"
            defaultValue="Professional photography service for events."
          />
        </div>

        <h3>Media</h3>

        <div className="editServices-grid">

          <div className="formGroup">
            <label>Banner Image</label>
            <input type="file" />
          </div>

          <div className="formGroup">
            <label>Gallery Images</label>
            <input
              type="file"
              multiple
            />
          </div>

        </div>

        <div className="editServices-actions">

          <button className="cancelBtn" onClick={() => navigate('/adminServices')}>
            <ArrowLeft size={18} />
            Cancel
          </button>

          <button className="saveBtn">
            <Save size={18} />
            Update Service
          </button>

        </div>

      </div>

    </div>
    </AdminLayout>
    
    </>
  );
};

export default EditServices;