import React from "react";
import './CarouselBanner.css'
import marriage from '../Event-Images/marriage.jpg'
import engagement from '../Event-Images/engagement.jpg'
import baby_shower from '../Event-Images/baby-shower.jpg'
import anniversary from '../Event-Images/anniversary.jpg'
import birthday from '../Event-Images/birthday.jpg'

function CarouselBanner() {
  return (
    // Carousel Section

    <div id="event-carousel" className="carousel slide" data-bs-ride="carousel">
      {/*Carousel indicators  */}

      <div className="carousel-indicators">
        <button
          type="button"
          data-bs-target="#event-carousel"
          data-bs-slide-to="0"
          className="active"
        ></button>
        <button
          type="button"
          data-bs-target="#event-carousel"
          data-bs-slide-to="1"
        ></button>
        <button
          type="button"
          data-bs-target="#event-carousel"
          data-bs-slide-to="2"
        ></button>
        <button
          type="button"
          data-bs-target="#event-carousel"
          data-bs-slide-to="3"
        ></button>
        <button
          type="button"
          data-bs-target="#event-carousel"
          data-bs-slide-to="4"
        ></button>
        <button
          type="button"
          data-bs-target="#event-carousel"
          data-bs-slide-to="5"
        ></button>
      </div>

      {/* Slides */}
      <div className="carousel-inner">
        <div className="carousel-item active">
          <img src={ marriage } alt="wedding" className="img-fluid" />

          <div className="carousel-content">
            <div className="carousel-text">
              <h2>Wedding Ceremony</h2>
              <p>
                <i className="bi bi-bag-check me-2"></i> Sat, May 5, 2024 · 5:00
                PM onwards
              </p>
              <p>
                <i className="bi bi-geo-alt me-2"></i> Lakeside Gardens,
                Kumarakom, Kottayam, Kerala
              </p>
            </div>
          </div>
        </div>

        <div className="carousel-item">
          <img
            src={ engagement }
            alt="engagement"
            className="img-fluid"
          />

          <div className="carousel-content">
            <div className="carousel-text">
              <h2>Engagement Ceremony</h2>
              <p>
                <i className="bi bi-bag-check me-2"></i> Fri, June 14, 2024 ·
                6:00 PM onwards
              </p>
              <p>
                <i className="bi bi-geo-alt me-2"></i> Green Leaf Convention
                Center, Kochi, Kerala
              </p>
            </div>
          </div>
        </div>

        <div className="carousel-item">
          <img src={ birthday } alt="birthday" className="img-fluid" />

          <div className="carousel-content">
            <div className="carousel-text">
              <h2>Birthday Celebration</h2>
              <p>
                <i className="bi bi-bag-check me-2"></i> Sat, July 20, 2024 ·
                5:30 PM onwards
              </p>
              <p>
                <i className="bi bi-geo-alt me-2"></i> Spice Route Banquet Hall,
                Calicut, Kerala
              </p>
            </div>
          </div>
        </div>

        <div className="carousel-item">
          <img
            src={ anniversary }
            alt="corporate"
            className="img-fluid"
          />

          <div className="carousel-content">
            <div className="carousel-text">
              <h2>Annual Corporate Meet</h2>
              <p>
                <i className="bi bi-bag-check me-2"></i> Thu, August 8, 2024 ·
                10:00 AM onwards
              </p>
              <p>
                <i className="bi bi-geo-alt me-2"></i> Lulu International
                Convention Centre, Thiruvananthapuram, Kerala
              </p>
            </div>
          </div>
        </div>

        <div className="carousel-item">
          <img
            src={ marriage }
            alt="house warming"
            className="img-fluid"
          />

          <div className="carousel-content">
            <div className="carousel-text">
              <h2>Housewarming</h2>
              <p>
                <i className="bi bi-bag-check me-2"></i> Mon, September 2, 2024
                · 8:00 AM onwards
              </p>
              <p>
                <i className="bi bi-geo-alt me-2"></i> Harmony Villas, Kakkanad,
                Kochi, Kerala
              </p>
            </div>
          </div>
        </div>

        <div className="carousel-item">
          <img
            src={ baby_shower }
            alt="baby shower"
            className="img-fluid"
          />

          <div className="carousel-content">
            <div className="carousel-text">
              <h2>Baby Shower</h2>
              <p>
                <i className="bi bi-bag-check me-2"></i> Sat, October 12, 2024 ·
                11:00 AM onwards
              </p>
              <p>
                <i className="bi bi-geo-alt me-2"></i> Lotus Banquet Hall,
                Alappuzha, Kerala
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#event-carousel"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon"></span>
      </button>

      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#event-carousel"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon"></span>
      </button>
    </div>

  )
}

export default CarouselBanner
