import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ENDPOINTS, IMG_URL } from "../../../api/api";
import "./ServiceCard.css";
import { ChevronDown, ChevronUp } from "lucide-react";

function ServiceCard() {
  const [categories, setCategories] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${ENDPOINTS.category}?status=Active`);
      const data = await res.json();
      const sorted = [...data].sort((a, b) =>
        a.categoryName.localeCompare(b.categoryName)
      );
      setCategories(sorted);
    } catch (error) {
      console.log("Error fetching categories:", error);
    }
  };

  // Cuts long description short and adds "..."
  // Full description stays safe in DB, only display text is shortened
  const truncateText = (text, limit = 150) => {
    if (!text) return "";
    if (text.length <= limit) return text;
    return text.substring(0, limit).trim() + "...";
  };

  const visibleCategories = showAll ? categories : categories.slice(0, 8);
  const hasMore = categories.length > 8;

  return (
    <section className="service-part">
      <div className="service-part__inner">
        <h2 className="service-heading">Our Events</h2>

        <div className="service-part__grid">
          {visibleCategories.map((category) => (
            <div className="category-card" key={category._id}>
              <div className="category-card__image-wrap">
                <img
                  src={`${IMG_URL}${category.image}`}
                  alt={category.categoryName}
                  className="category-card__image"
                />
              </div>
              <div className="category-card__body">
                <h5 className="category-card__title">{category.categoryName}</h5>
                <p className="category-card__text">
                  {truncateText(category.description)}
                </p>
                {/* Now links using the real DB id, not a hardcoded slug —
                    works automatically for any category admin adds */}
                <Link to={`/explore/${category._id}`} className="category-card__btn">
                  Explore
                </Link>
              </div>
            </div>
          ))}
        </div>

        {hasMore && (
          <p
            className="show-toggle"
            onClick={() => setShowAll((prev) => !prev)}
          >
            {showAll ? (
              <>
                Show Less <ChevronUp size={18} />
              </>
            ) : (
              <>
                Show More <ChevronDown size={18} />
              </>
            )}
          </p>
        )}
      </div>
    </section>
  );
}

export default ServiceCard;