import React from "react";
import { ArrowLeft, Pencil } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import "./ViewServices.css";

const ViewServices = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const service = {
    id: id,
    name: "Photography",
    price: "₹10,000",
    status: "Active",
    description:
      "Professional photography services for weddings, birthdays, corporate events and celebrations.",
    bannerImage:
      "https://images.unsplash.com/photo-1519741497674-611481863552",
    galleryImages: [
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc",
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf",
      "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8",
      "https://images.unsplash.com/photo-1505236858219-8359eb29e329",
    ],
  };

  return (
    <div className="viewService">
      <div className="viewService-header">
        <div>
          <h2>Service Details</h2>
          <p>View complete service information</p>
        </div>

        <div className="viewService-actions">
          <button
            className="backBtn"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <button className="editBtn" onClick={() => navigate('/editService/:id')}>
            <Pencil size={18} />
            Edit Service
          </button>
        </div>
      </div>

      <div className="viewService-card">

        <img
          src={service.bannerImage}
          alt={service.name}
          className="viewService-banner"
        />

        <div className="viewService-infoGrid">

          <div className="infoBox">
            <span>Service Name</span>
            <h4>{service.name}</h4>
          </div>

          <div className="infoBox">
            <span>Price</span>
            <h4>{service.price}</h4>
          </div>

          <div className="infoBox">
            <span>Status</span>

            <div
              className={`statusBadge ${
                service.status === "Active"
                  ? "active"
                  : "inactive"
              }`}
            >
              {service.status}
            </div>
          </div>

        </div>

        <div className="viewService-description">

          <h3>Description</h3>

          <p>{service.description}</p>

        </div>

        <div className="viewService-gallery">

          <h3>Gallery Images</h3>

          <div className="galleryGrid">

            {service.galleryImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt="Gallery"
              />
            ))}

          </div>

        </div>

      </div>
    </div>
  );
};

export default ViewServices;