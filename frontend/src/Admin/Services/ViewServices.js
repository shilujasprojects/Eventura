import React, { useState, useEffect } from "react";
import { ArrowLeft, Pencil, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import "./Services.css";
import AdminLayout from "../../Pages/Admin/Layout/AdminLayout";
import axios from "axios";
import { toast } from "react-toastify";

const ViewServices = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightboxSrc, setLightboxSrc] = useState(null);

  useEffect(() => {
    getService();
  }, []);

  const getService = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/services/${id}`);
      setService(response.data.data);
    } catch (error) {
      toast.error("Failed to load service details.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="page-loading">Loading service details...</div>
      </AdminLayout>
    );
  }

  if (!service) {
    return (
      <AdminLayout>
        <div className="page-loading">
          <p>Service not found.</p>
          <button className="backBtn" onClick={() => navigate("/adminServices")}>
            <ArrowLeft size={18} /> Back to Services
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* ── Lightbox ── */}
      {lightboxSrc && (
        <div className="lightbox-overlay" onClick={() => setLightboxSrc(null)}>
          <button className="lightbox-close" onClick={() => setLightboxSrc(null)}>
            <X size={24} />
          </button>
          <img
            src={lightboxSrc}
            alt="Preview"
            className="lightbox-img"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <div className="viewService">

        {/* ── Header ── */}
        <div className="viewService-header">
          <div>
            <h2>Service Details</h2>
            <p>View complete service information</p>
          </div>
          <div className="viewService-actions">
            <button className="backBtn" onClick={() => navigate(-1)}>
              <ArrowLeft size={18} />
              Back
            </button>
            <button
              className="editBtn"
              onClick={() => navigate(`/editService/${service._id}`)}
            >
              <Pencil size={18} />
              Edit Service
            </button>
          </div>
        </div>

        {/* ── Main Card ── */}
        <div className="viewService-card">

          {/* Banner — clickable */}
          <div className="viewService-banner-wrap">
            <img
              src={`http://localhost:5000/uploads/${service.bannerImage}`}
              alt={service.serviceName}
              className="viewService-banner"
              onClick={() =>
                setLightboxSrc(`http://localhost:5000/uploads/${service.bannerImage}`)
              }
              onError={(e) => {
                e.target.src =
                  "https://placehold.co/1200x380/0d2131/f1d49b?text=No+Banner+Image";
                e.target.style.cursor = "default";
                e.target.onclick = null;
              }}
            />
            <span className="banner-zoom-hint">Click to enlarge</span>
          </div>

          {/* Info Grid */}
          <div className="viewService-infoGrid">
            <div className="infoBox">
              <span>Service Name</span>
              <h4>{service.serviceName}</h4>
            </div>
            <div className="infoBox">
              <span>Price</span>
              <h4>₹{Number(service.servicePrice).toLocaleString("en-IN")}</h4>
            </div>
            <div className="infoBox">
              <span>Status</span>
              <div
                className={`statusBadge ${
                  service.status === "Active" ? "active" : "inactive"
                }`}
              >
                {service.status}
              </div>
            </div>
            <div className="infoBox">
              <span>Gallery Images</span>
              <h4>
                {service.galleryImages?.length || 0} Image
                {service.galleryImages?.length !== 1 ? "s" : ""}
              </h4>
            </div>
            <div className="infoBox">
              <span>Created At</span>
              <h4>
                {new Date(service.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </h4>
            </div>
            <div className="infoBox">
              <span>Last Updated</span>
              <h4>
                {new Date(service.updatedAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </h4>
            </div>
          </div>

          {/* Description */}
          <div className="viewService-description">
            <h3>Description</h3>
            <p>{service.description}</p>
          </div>

          {/* Gallery — each image clickable */}
          {service.galleryImages?.length > 0 ? (
            <div className="viewService-gallery">
              <h3>Gallery Images</h3>
              <div className="galleryGrid">
                {service.galleryImages.map((image, index) => (
                  <img
                    key={index}
                    src={`http://localhost:5000/uploads/${image}`}
                    alt={`Gallery ${index + 1}`}
                    className="gallery-zoomable"
                    onClick={() =>
                      setLightboxSrc(`http://localhost:5000/uploads/${image}`)
                    }
                    onError={(e) => {
                      e.target.src =
                        "https://placehold.co/300x220/0d2131/f1d49b?text=Not+Found";
                      e.target.style.cursor = "default";
                      e.target.onclick = null;
                    }}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="viewService-gallery">
              <h3>Gallery Images</h3>
              <p className="no-gallery-text">
                No gallery images added for this service.
              </p>
            </div>
          )}

        </div>
      </div>
    </AdminLayout>
  );
};

export default ViewServices;