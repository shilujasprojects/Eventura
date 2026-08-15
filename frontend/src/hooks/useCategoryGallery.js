import { useEffect, useState } from "react";
import axios from "axios";

function shuffleArray(arr) {
  const array = [...arr];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// categoryName must match the categoryName stored in the Category document
// (e.g. "Wedding", "Birthday"). imageCount defaults to 3 per the spec, but
// carousel-style galleries usually look better with more — pass a higher
// number where the layout calls for it.
export default function useCategoryGallery(categoryName, imageCount = 3) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!categoryName) {
      setImages([]);
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    axios
      .get(`http://localhost:5000/api/events?status=Active`)
      .then((res) => {
        const events = res.data?.data || [];

        const categoryEvents = events.filter(
          (event) =>
            event.category?.categoryName?.trim().toLowerCase() ===
            categoryName.trim().toLowerCase()
        );

        const allImages = categoryEvents
          .flatMap((event) => event.galleryImages || [])
          .filter((img) => img && img.trim() !== "");

        const uniqueImages = [...new Set(allImages)];
        const randomSubset = shuffleArray(uniqueImages)
          .slice(0, imageCount)
          .map((filename) => `http://localhost:5000/uploads/${filename}`);

        if (isMounted) {
          setImages(randomSubset);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(`Failed to load ${categoryName} gallery images:`, err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [categoryName, imageCount]);

  return { images, loading };
}