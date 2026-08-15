import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ENDPOINTS, IMG_URL } from "../../../api/api";
import './ServiceCard.css'

function ServiceCard() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${ENDPOINTS.category}?status=Active`);
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.log("Error fetching categories:", error);
    }
  };

  // Cuts long description short and adds "..."
  // Full description stays safe in DB, only display text is shortened
  const truncateText = (text, limit = 80) => {
    if (!text) return "";
    if (text.length <= limit) return text;
    return text.substring(0, limit).trim() + "...";
  };

  return (
    <div className='container-fluid service-part'>
      <section className="container" style={{ backgroundColor: "#062036" }}>
        <h2 className="text-center service-heading">
          Our Events
        </h2>

        <div className="row g-4">
          {categories.map((category) => (
            <div className="col-lg-3 col-md-6 col-sm-6 col-12" key={category._id}>
              <div className="card card-service">
                <img
                  src={`${IMG_URL}${category.image}`}
                  alt={category.categoryName}
                  className="image-card-top"
                />
                <div className="body-card">
                  <h5 className="title-card">{category.categoryName}</h5>
                  <p className="text-card">{truncateText(category.description)}</p>
                  {/* Now links using the real DB id, not a hardcoded slug —
                      works automatically for any category admin adds */}
                  <Link to={`/explore/${category._id}`} className="btn btn-explore">
                    Explore
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default ServiceCard