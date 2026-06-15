import React from "react";
import {
  ArrowLeft,
  Pencil,
  CalendarDays,
  FolderOpen,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import "./CategoryEvents.css";
import AdminLayout from "../../Pages/Admin/Layout/AdminLayout";

const ViewCategoryEvents = () => {
  const navigate = useNavigate();

  const category = {
    id: 1,
    name: "Wedding",
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552",
    description:
      "Wedding events including traditional, destination weddings, luxury wedding ceremonies, reception arrangements and premium event management services.",
    totalEvents: 12,
    createdDate: "15 May 2026",
  };

  return (
    <AdminLayout>
      <div className="viewCategory">

        {/* Header */}

        <div className="viewCategory-header">

          <div>
            <h2>{category.name}</h2>
            <p>Category Details</p>
          </div>

          <div className="viewCategory-headerActions">

            <span
              className={`viewCategory-status ${
                category.status === "Active"
                  ? "active"
                  : "inactive"
              }`}
            >
              {category.status}
            </span>

            <button
              className="viewCategory-backBtn"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={18} />
              Back
            </button>

            <button
              className="viewCategory-editBtn"
              onClick={() =>
                navigate(`/editCategoryEvent/${category.id}`)
              }
            >
              <Pencil size={18} />
              Edit
            </button>

          </div>

        </div>

        {/* Banner Image */}

        <div className="viewCategory-bannerCard">

          <img
            src={category.image}
            alt={category.name}
          />

        </div>

        {/* Information */}

        <div className="viewCategory-infoCard">

          <h3>Category Information</h3>

          <div className="viewCategory-infoGrid">

            <div className="infoBox">
              <FolderOpen size={20} />

              <span>Category Name</span>

              <strong>{category.name}</strong>
            </div>

            <div className="infoBox">
              <CheckCircle size={20} />

              <span>Status</span>

              <strong>{category.status}</strong>
            </div>

            <div className="infoBox">
              <FolderOpen size={20} />

              <span>Total Events</span>

              <strong>{category.totalEvents}</strong>
            </div>

            <div className="infoBox">
              <CalendarDays size={20} />

              <span>Created Date</span>

              <strong>{category.createdDate}</strong>
            </div>

          </div>

        </div>

        {/* Description */}

        <div className="viewCategory-descriptionCard">

          <h3>Description</h3>

          <p>{category.description}</p>

        </div>

      </div>
    </AdminLayout>
  );
};

export default ViewCategoryEvents;