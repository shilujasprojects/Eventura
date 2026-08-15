import React, { useEffect, useState } from "react";
import { CalendarDays, Tag, ArrowLeft, Pencil, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "./Events.css";
import AdminLayout from "../../Pages/Admin/Layout/AdminLayout";

const BASE = "http://localhost:5000";

const ViewEvents = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightboxSrc, setLightboxSrc] = useState(null);
  const [packages, setPackages] = useState([]);


  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${BASE}/api/events/${id}`);
        const eventData = res.data.data;
        setEvent(eventData);

        // Fetch packages under this event's category
        if (eventData?.category?._id) {
          const pkgRes = await axios.get(`${BASE}/api/packages`, {
            params: {
              category: eventData.category._id,
              status: "Active",
            },
          });

          setPackages(pkgRes.data.data || pkgRes.data || []);
        }
      } catch (err) {
        toast.error("Failed to load event.");
        navigate("/adminEvents");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [id, navigate]);

  if (loading)
    return (
      <AdminLayout>
        <div style={{ color: "#fff7ee", padding: "20px" }}>Loading...</div>
      </AdminLayout>
    );
  if (!event) return null;

  return (
    <AdminLayout>
      {lightboxSrc && (
        <div className="lightbox-overlay" onClick={() => setLightboxSrc(null)}>
          <button className="lightbox-close">
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

      <div className="viewEvent">
        <div className="viewEvent-header">
          <div>
            <h2>{event.eventName}</h2>
            <p>Event Details & Information</p>
          </div>
          <div className="viewEvent-headerActions">
            <button
              className="viewEvent-backBtn"
              onClick={() => navigate("/adminEvents")}
            >
              <ArrowLeft size={18} /> Back
            </button>
            <button
              className="viewEvent-editBtn"
              onClick={() => navigate(`/editEvents/${event._id}`)}
            >
              <Pencil size={18} /> Edit Event
            </button>
          </div>
        </div>

        <div className="viewEvent-topGrid">
          <div className="viewEvent-imageCard">
            {event.coverImage ? (
              <img
                src={`${BASE}/uploads/${event.coverImage}`}
                alt={event.eventName}
                style={{ cursor: "pointer" }}
                onClick={() =>
                  setLightboxSrc(`${BASE}/uploads/${event.coverImage}`)
                }
              />
            ) : (
              <div className="viewEvent-imagePlaceholder" />
            )}
          </div>

            
            <div className="viewEvent-detailsCard">
  <div className="viewEvent-titleRow">
    <h3>Event Information</h3>

    <span
      className={`viewEvent-status ${
        event.status === "Active" ? "active" : "inactive"
      }`}
    >
      {event.status}
    </span>
  </div>

  {/* Event Details */}
  <div className="viewEvent-infoGrid">

    <div className="viewEvent-infoBox">
      <CalendarDays size={18} />
      <div>
        <label>Event Name</label>
        <span>{event.eventName}</span>
      </div>
    </div>

    <div className="viewEvent-infoBox">
      <Tag size={18} />
      <div>
        <label>Category</label>
        <span>{event.category?.categoryName || "-"}</span>
      </div>
    </div>

  </div>

  <hr className="viewEvent-divider" />

  <div className="viewEvent-packageSection">
    <h4>Available Packages</h4>

    {packages.length === 0 ? (
      <p className="viewEvent-empty">
        No active packages available.
      </p>
    ) : (
      <div className="viewEvent-packagesGrid">
        {packages.map((pkg) => (
          <div key={pkg._id} className="viewEvent-packageCard">

            <div className="viewEvent-packageHeader">
              <div>
                <h5>{pkg.packageName}</h5>

                {pkg.tags?.length > 0 && (
                  <div className="viewEvent-tagList">
                    {pkg.tags.map((tag) => (
                      <span key={tag} className="viewEvent-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="viewEvent-packagePrice">
                ₹{pkg.finalPrice.toLocaleString("en-IN")}
              </div>
            </div>

            {pkg.description && (
              <p className="viewEvent-packageDesc">
                {pkg.description}
              </p>
            )}

            <div className="viewEvent-serviceList">
              {pkg.services.map((service) => (
                <span
                  key={service._id}
                  className="viewEvent-serviceTag"
                >
                  ✓ {service.service.serviceName}
                  {service.isOptional && <small> Optional</small>}
                </span>
              ))}
            </div>

          </div>
        ))}
      </div>
    )}
  </div>
</div>
          
        </div>

       <div className="viewEvent-desc">
         {/* Short Description */}
        <div className="viewEvent-card">
          <h3>Short Description</h3>
          <p>{event.shortDescription || "No short description provided."}</p>
        </div>

        {/* Long Description */}
        <div className="viewEvent-card">
          <h3>Long Description</h3>
          <p>{event.longDescription || "No long description provided."}</p>
        </div>
       </div>


        {/* Gallery */}
        <div className="viewEvent-card">
          <h3>Gallery Images</h3>
          {event.galleryImages?.length > 0 ? (
            <div className="viewEvent-gallery">
              {event.galleryImages.map((img, i) => (
                <img
                  key={i}
                  src={`${BASE}/uploads/${img}`}
                  alt={`Gallery ${i + 1}`}
                  style={{ cursor: "pointer" }}
                  onClick={() => setLightboxSrc(`${BASE}/uploads/${img}`)}
                />
              ))}
            </div>
          ) : (
            <p style={{ color: "#8a9ba8" }}>No gallery images added.</p>
          )}
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </AdminLayout>
  );
};

export default ViewEvents;
