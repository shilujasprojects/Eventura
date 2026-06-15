import React from "react";
import {
  Package,
  Tag,
  IndianRupee,
  CheckCircle,
  ArrowLeft,
  Pencil,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import "./Packages.css";
import AdminLayout from "../../Pages/Admin/Layout/AdminLayout";

const ViewPackages = () => {
  const navigate = useNavigate();

  const packageData = {
    name: "Royal Wedding Package",
    category: "Wedding",
    price: "₹1,50,000",
    status: "Active",

    description:
      "A complete luxury wedding package including catering, decoration, photography, videography and entertainment services.",

    services: [
      "Catering",
      "Photography",
      "Videography",
      "Decoration",
      "DJ & Music",
    ],
  };

  return (
    <AdminLayout>
      <div className="viewPackage">

        {/* Header */}

        <div className="viewPackage-header">

          <div>
            <h2>{packageData.name}</h2>

            <p>
              Package Details & Included Services
            </p>
          </div>

          <div className="viewPackage-headerActions">

            <button
              className="viewPackage-backBtn"
              onClick={() =>
                navigate("/adminPackages")
              }
            >
              <ArrowLeft size={18} />
              Back
            </button>

            <button
              className="viewPackage-editBtn"
              onClick={() =>
                navigate("/editPackage/1")
              }
            >
              <Pencil size={18} />
              Edit Package
            </button>

           

          </div>

        </div>

        {/* Top Grid */}

        <div className="viewPackage-topGrid">

          <div className="viewPackage-imageCard">

            <img
              src="https://images.unsplash.com/photo-1519225421980-715cb0215aed"
              alt="Package"
            />

          </div>

          <div className="viewPackage-detailsCard">

            <div className="viewPackage-cardHeader">

  <h2>Package Information</h2>

  <span
    className={`viewPackage-status ${
      packageData.status === "Active"
        ? "active"
        : "inactive"
    }`}
  >
    {packageData.status}
  </span>

</div>

            <div className="viewPackage-info">

              <div className="viewPackage-infoItem">
                <Package size={18} />
                <span>{packageData.name}</span>
              </div>

              <div className="viewPackage-infoItem">
                <Tag size={18} />
                <span>{packageData.category}</span>
              </div>

              <div className="viewPackage-infoItem">
                <IndianRupee size={18} />
                <span>{packageData.price}</span>
              </div>

              <div className="viewPackage-infoItem">
                <CheckCircle size={18} />
                <span>{packageData.status}</span>
              </div>

            </div>

          </div>

        </div>

        {/* Description */}

        <div className="viewPackage-card">

          <h3>Description</h3>

          <p>{packageData.description}</p>

        </div>

        {/* Services */}

        <div className="viewPackage-card">

          <h3>Included Services</h3>

          <div className="viewPackage-services">

            {packageData.services.map(
              (service, index) => (
                <span
                  key={index}
                  className="viewPackage-service"
                >
                  {service}
                </span>
              )
            )}

          </div>

        </div>

      </div>
    </AdminLayout>
  );
};

export default ViewPackages;