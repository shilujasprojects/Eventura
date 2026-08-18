import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./CategoryExplore.css";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import useCategoryDetails from "../../hooks/useCategoryDetails";
import useCategoryEvents from "../../hooks/useCategoryEvents";
import useCategoryPackages from "../../hooks/useCategoryPackages";
import useCategoryGallery from "../../hooks/useCategoryGallery";
import { IMG_URL } from "../../api/api";

const SERVICE_LIMIT = 4;

export default function CategoryExplore() {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const { category, loading: categoryLoading } = useCategoryDetails(categoryId);
  const { events, loading: eventsLoading } = useCategoryEvents(categoryId);
  const { packages, loading: packagesLoading } = useCategoryPackages(categoryId);

  const { images: momentImages, loading: galleryLoading } = useCategoryGallery(
    category?.categoryName,
    9,
  );

  const galleryRef = useRef(null);
  const autoSlideRef = useRef(null);

  const [lightbox, setLightbox] = useState(false);
  const [selectedImg, setSelectedImg] = useState("");
  const [expandedPackages, setExpandedPackages] = useState({});

  const toggleExpand = (id) => {
    setExpandedPackages((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  /* Scroll buttons */
  const scrollGallery = (value) => {
    galleryRef.current.scrollLeft += value;
  };

  /* Auto slide */
  const startAutoSlide = () => {
    autoSlideRef.current = setInterval(() => {
      if (!galleryRef.current) return;

      galleryRef.current.scrollLeft += 300;

      if (
        galleryRef.current.scrollLeft + galleryRef.current.clientWidth >=
        galleryRef.current.scrollWidth
      ) {
        galleryRef.current.scrollLeft = 0;
      }
    }, 2000);
  };

  useEffect(() => {
    startAutoSlide();
    return () => clearInterval(autoSlideRef.current);
  }, []);

  /* Lightbox */
  const openLightbox = (src) => {
    setSelectedImg(src);
    setLightbox(true);
  };

  const closeLightbox = () => {
    setLightbox(false);
  };

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

  const hasEvents = !eventsLoading && events.length > 0;
  const hasMoments = !galleryLoading && momentImages.length > 0;
  const hasPackages = !packagesLoading && packages.length > 0;

  return (
    <>
      <Navbar />

      <div className="category-explore">
        {/* HERO */}
        <section className="category-explore-hero">
          <img src={`${IMG_URL}${category.image}`} alt={category.categoryName} />
          <div className="category-explore-overlay">
            <p>EVENTURA {category.categoryName.toUpperCase()}</p>
            <h1>{category.categoryName}</h1>
            <p className="category-explore-desc">{category.description}</p>
          </div>
        </section>

        {/* EVENTS GRID — only shown once real events exist */}
        {hasEvents && (
          <section className="category-explore-events">
            <div className="category-explore-section-heading">
              <p>EVENTURA {category.categoryName.toUpperCase()}</p>
              <h2>{category.categoryName} Events</h2>
            </div>

            <div className="category-explore-events-grid">
              {events.map((event) => (
                <div key={event._id} className="category-explore-event-card">
                  <img src={`${IMG_URL}${event.coverImage}`} alt={event.eventName} />
                  <div className="category-explore-event-info">
                    <h3>{event.eventName}</h3>
                    <p>{event.shortDescription}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* MOMENTS — only shown once gallery images exist */}
        {hasMoments && (
          <section className="category-explore-gallery">
            <div className="category-explore-section-heading">
              <p>EVENTURA MOMENTS</p>
              <h2>{category.categoryName} Moments</h2>
            </div>

            <div className="category-explore-gallery-wrapper">
              <button
                className="category-explore-scroll-btn left"
                onClick={() => scrollGallery(-300)}
              >
                ❮
              </button>

              <div
                className="category-explore-gallery-row"
                ref={galleryRef}
                onMouseEnter={() => clearInterval(autoSlideRef.current)}
                onMouseLeave={startAutoSlide}
              >
                {momentImages.map((img) => (
                  <img
                    key={img}
                    src={img}
                    alt={`${category.categoryName} moment`}
                    loading="lazy"
                    onClick={() => openLightbox(img)}
                  />
                ))}
              </div>

              <button
                className="category-explore-scroll-btn right"
                onClick={() => scrollGallery(300)}
              >
                ❯
              </button>
            </div>
          </section>
        )}

        {/* LIGHTBOX */}
        {lightbox && (
          <div className="category-explore-lightbox" onClick={closeLightbox}>
            <span className="category-explore-lightbox-close" onClick={closeLightbox}>
              &times;
            </span>
            <img src={selectedImg} alt="preview" onClick={(e) => e.stopPropagation()} />
          </div>
        )}

        {/* PACKAGES — only shown once real packages exist */}
        {hasPackages && (
          <section className="category-explore-packages-wrapper">
            <div className="category-explore-section-heading">
              <p>EVENTURA PACKAGES</p>
              <h2>{category.categoryName} Packages</h2>
            </div>

            <div className="category-explore-packages">
              {packages.map((pkg) => {
                const isExpanded = expandedPackages[pkg._id];
                const visibleServices = isExpanded
                  ? pkg.services
                  : pkg.services.slice(0, SERVICE_LIMIT);
                const hiddenCount = pkg.services.length - SERVICE_LIMIT;

                return (
                  <div key={pkg._id} className="category-explore-package-card">
                    {pkg.tags?.length > 0 && (
                      <div className="category-explore-package-tag">{pkg.tags[0]}</div>
                    )}

                    <h3>{pkg.packageName}</h3>
                    <h2>₹{pkg.finalPrice.toLocaleString()}</h2>

                    <ul>
                      {visibleServices.map((s) => (
                        <li key={s.service?._id}>{s.service?.serviceName}</li>
                      ))}
                    </ul>

                    {hiddenCount > 0 && (
                      <p
                        className="category-explore-package-toggle"
                        onClick={() => toggleExpand(pkg._id)}
                      >
                        {isExpanded ? "Show less" : `+${hiddenCount} more`}
                      </p>
                    )}

                    <button onClick={() => navigate("/bookNow")}>
                      Choose Package
                    </button>
                  </div>
                );
              })}

              {/* Static Custom package card — always shown alongside real packages */}
              <div className="category-explore-package-card category-explore-package-card--custom">
                <h3>Custom</h3>
                <p className="category-explore-package-custom-text">
                  Don't see a package that fits? Build your own with the exact
                  services your event needs.
                </p>

                <button onClick={() => navigate("/bookNow")}>
                  Request Custom Package
                </button>
              </div>
            </div>
          </section>
        )}
      </div>

      <Footer />
    </>
  );
}