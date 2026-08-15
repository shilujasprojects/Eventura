import React, { useEffect, useState } from "react";
import axios from "axios";

function shuffleArray(arr) {
  const array = [...arr];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// categoryId: the Category's Mongo _id (required, passed from the parent Explore page)
// count: how many random images to show (default 3)
function AboutEventGallery({ categoryId, count = 3 }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!categoryId) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    axios
      .get(
        `http://localhost:5000/api/events?category=${categoryId}&status=Active`
      )
      .then((res) => {
        const events = res.data?.data || [];

        // Pull every gallery image from every active event in this category
        const allImages = events
          .flatMap((event) => event.galleryImages || [])
          .filter((img) => img && img.trim() !== "");

        const uniqueImages = [...new Set(allImages)];
        const randomSubset = shuffleArray(uniqueImages).slice(0, count);

        if (isMounted) {
          setImages(randomSubset);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load gallery images:", err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [categoryId, count]);

  if (loading) {
    return (
      <div className="row g-3 mt-3">
        {Array.from({ length: count }).map((_, i) => (
          <div className="col-lg-4 col-md-4" key={i}>
            <div className="img-gallery-skeleton" />
          </div>
        ))}
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <p className="text-muted mt-3">
        No gallery images available for this category yet.
      </p>
    );
  }

  return (
    <div className="row g-3 mt-3">
      {images.map((filename, i) => (
        <div
          className="col-lg-4 col-md-4"
          key={filename + i}
          data-aos="zoom-in"
          data-aos-duration="1500"
        >
          <img
            src={`http://localhost:5000/uploads/${filename}`}
            alt="Event gallery"
            className="img-fluid img-gallery"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
}

export default AboutEventGallery;