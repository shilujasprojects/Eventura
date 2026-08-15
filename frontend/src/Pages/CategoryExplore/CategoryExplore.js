import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./CategoryExplore.css";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import useCategoryDetails from "../../hooks/useCategoryDetails";
import useCategoryEvents from "../../hooks/useCategoryEvents";
import useCategoryPackages from "../../hooks/useCategoryPackages";
import { IMG_URL } from "../../api/api";

export default function CategoryExplore() {
  const { categoryId } = useParams();

  const { category, loading: categoryLoading } = useCategoryDetails(categoryId);
  const { events, loading: eventsLoading } = useCategoryEvents(categoryId);
  const { packages, loading: packagesLoading } = useCategoryPackages(categoryId);

  const [selectedEvent, setSelectedEvent] = useState(null);

  const openEvent = (event) => setSelectedEvent(event);
  const closeEvent = () => setSelectedEvent(null);

  const navigate = useNavigate();

  if (categoryLoading) {
    return (
      <>
        <Navbar />
        <div className="category-explore-loading">Loading...</div>
        <Footer />
      </>
    );
  }

  if (!category) {
    return (
      <>
        <Navbar />
        <div className="category-explore-loading">Category not found.</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="category-explore">

        {/* HERO — uses the category's own image + description from DB */}
        <section className="category-explore-hero">
          <img src={`${IMG_URL}${category.image}`} alt={category.categoryName} />
          <div className="category-explore-overlay">
            <p>EVENTURA {category.categoryName.toUpperCase()}</p>
            <h1>{category.categoryName}</h1>
            <p className="category-explore-desc">{category.description}</p>
          </div>
        </section>

        {/* EVENTS GRID — real events under this category */}
        <section className="category-explore-events">
          <h2>{category.categoryName} Moments</h2>

          {eventsLoading ? (
            <p className="category-explore-empty">Loading events...</p>
          ) : events.length === 0 ? (
            <p className="category-explore-empty">No events added under this category yet.</p>
          ) : (
            <div className="category-explore-events-grid">
              {events.map((event) => (
                <div
                  key={event._id}
                  className="category-explore-event-card"
                  onClick={() => openEvent(event)}
                >
                  <img src={`${IMG_URL}${event.coverImage}`} alt={event.eventName} />
                  <div className="category-explore-event-info">
                    <h3>{event.eventName}</h3>
                    <p>{event.shortDescription}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* EVENT DETAIL MODAL */}
        {selectedEvent && (
          <div className="category-explore-modal-backdrop" onClick={closeEvent}>
            <div
              className="category-explore-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="category-explore-modal-close" onClick={closeEvent}>
                &times;
              </span>

              <img
                src={`${IMG_URL}${selectedEvent.coverImage}`}
                alt={selectedEvent.eventName}
              />

              <h3>{selectedEvent.eventName}</h3>
              <p>{selectedEvent.longDescription}</p>

              {selectedEvent.galleryImages?.length > 0 && (
                <div className="category-explore-modal-gallery">
                  {selectedEvent.galleryImages.map((img) => (
                    <img key={img} src={`${IMG_URL}${img}`} alt="gallery" />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* PACKAGES — real packages under this category */}
        <section className="category-explore-packages-wrapper">
          <div className="category-explore-package-heading">
            <p>EVENTURA PACKAGES</p>
            <h2>{category.categoryName} Packages</h2>
          </div>

          {packagesLoading ? (
            <p className="category-explore-empty">Loading packages...</p>
          ) : packages.length === 0 ? (
            <p className="category-explore-empty">No packages added under this category yet.</p>
          ) : (
            <div className="category-explore-packages">
              {packages.map((pkg) => (
                <div key={pkg._id} className="category-explore-package-card">
                  {pkg.tags?.length > 0 && (
                    <div className="category-explore-package-tag">{pkg.tags[0]}</div>
                  )}

                  <h3>{pkg.packageName}</h3>
                  <h2>₹{pkg.finalPrice.toLocaleString()}</h2>

                  <ul>
                    {pkg.services.map((s) => (
                      <li key={s.service?._id}>{s.service?.serviceName}</li>
                    ))}
                  </ul>

                  <button onClick={() => navigate('/bookNow')}>Choose Package</button>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>

      <Footer />
    </>
  );
}