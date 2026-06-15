import React from "react";
import {
  CalendarDays,
  Tag,
  IndianRupee,
  Package,
  ArrowLeft,
  Pencil,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import "./Events.css";
import AdminLayout from "../../Pages/Admin/Layout/AdminLayout";

const ViewEvents = () => {
  const navigate = useNavigate();

  const eventData = {
    id: 1,
    name: "Royal Beach Wedding",
    category: "Wedding",
    price: "₹1,50,000",
    status: "Active",

    coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552",

    shortDescription:
      "Luxury destination wedding package with premium services.",

    longDescription:
      "A complete wedding experience including catering, decoration, photography, videography, DJ, makeup and transportation services.",

    packages: ["Basic Package", "Premium Package", "Luxury Package"],

    gallery: [
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc",
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486",
      "https://images.unsplash.com/photo-1469371670807-013ccf25f16a",
    ],
  };

  return (
    <>
      <AdminLayout>
        <div className="viewEvent">
          <div className="viewEvent-header">
            <div>
              <h2>{eventData.name}</h2>
              <p>Event Details & Information</p>
            </div>

            <div className="viewEvent-headerActions">
              <button
                className="viewEvent-backBtn"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft size={18} />
                Back
              </button>

              <button
                className="viewEvent-editBtn"
                onClick={() => navigate(`/editEvents/${eventData.id}`)}
              >
                <Pencil size={18} />
                Edit Event
              </button>
            </div>
          </div>

          <div className="viewEvent-topGrid">
            <div className="viewEvent-imageCard">
              <img src={eventData.coverImage} alt={eventData.name} />
            </div>

            <div className="viewEvent-detailsCard">
              <div className="viewEvent-titleRow">
                <h3>Event Information</h3>

                <span
                  className={`viewEvent-status ${
                    eventData.status === "Active" ? "active" : "inactive"
                  }`}
                >
                  {eventData.status}
                </span>
              </div>

              <div className="viewEvent-info">
                <div className="viewEvent-infoItem">
                  <CalendarDays size={18} />
                  <span>{eventData.name}</span>
                </div>

                <div className="viewEvent-infoItem">
                  <Tag size={18} />
                  <span>{eventData.category}</span>
                </div>

                <div className="viewEvent-infoItem">
                  <IndianRupee size={18} />
                  <span>{eventData.price}</span>
                </div>

                <div className="viewEvent-infoItem">
                  <Package size={18} />
                  <span>{eventData.packages.length} Packages</span>
                </div>
              </div>
            </div>
          </div>

          <div className="viewEvent-card">
            <h3>Short Description</h3>

            <p>{eventData.shortDescription}</p>
          </div>

          <div className="viewEvent-card">
            <h3>Full Description</h3>

            <p>{eventData.longDescription}</p>
          </div>

          <div className="viewEvent-card">
            <h3>Available Packages</h3>

            <div className="viewEvent-packages">
              {eventData.packages.map((pkg, index) => (
                <span key={index} className="viewEvent-package">
                  {pkg}
                </span>
              ))}
            </div>
          </div>

          <div className="viewEvent-card">
            <h3>Gallery Images</h3>

            <div className="viewEvent-gallery">
              {eventData.gallery.map((image, index) => (
                <img key={index} src={image} alt="Gallery" />
              ))}
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default ViewEvents;
