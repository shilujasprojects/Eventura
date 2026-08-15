import React from "react";
import { Link } from "react-router-dom";
import './FounderSection.css'
import founder from "../Images/founder.jpg";
import flower from "../Images/couple-flower.jpg";

function FounderSection() {
  return (
     // Founder Section

    <section class="eventura-hero">
      <div class="container">
        <div class="hero-grid">
          {/* LEFT CONTENT */}
          <div className="hero-founder-content" data-aos="fade-up" data-aos-duration="2000">
            <div className="founder">
              <img src={founder} alt="Founder" />
              <span>
                Hey, we’re <strong>Eventura</strong>
                <br />
                Your Event Planning Partner
              </span>
            </div>

            <h1>
              Crafting Moments,
              <br />
              Creating Memories.
            </h1>

            <p className="hero-founder-desc">
              We design and deliver seamless events with creativity, precision,
              and elegance — so you can enjoy every moment stress-free.
            </p>

            <Link to="/bookNow" className="hero-btn">
              Plan Your Event
            </Link>
          </div>

          {/* RIGHT IMAGE */}
          <div className="hero-image" data-aos="fade-left" data-aos-duration="2000">
            <img src={flower} alt="Event Setup" />
          </div>
        </div>

        {/* STATS Card */}
        <div className="hero-stats" data-aos="zoom-out-down" data-aos-duration="1500">
          <div className="stat-card" >
            <h3>8+</h3>
            <p>Years Experience</p>
          </div>

          <div className="stat-card">
            <h3>1200+</h3>
            <p>Events Managed</p>
          </div>

          <div className="stat-card">
            <h3>300+</h3>
            <p>Trusted Vendors</p>
          </div>

          <div className="stat-card">
            <h3>2500+</h3>
            <p>Happy Clients</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FounderSection
