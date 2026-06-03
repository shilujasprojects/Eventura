import React from "react";

import { Link } from "react-router-dom";
import './Banner.css'
import banner from "../Images/banner.png"


function Banner() {
  return (
    // Banner Section

    <section className="banner">
      <div className="container">
        <div className="row align-items-center">

          {/* Left Content */}

          <div className="col-lg-7  col-md-6 text-light" data-aos="fade-right"
              data-aos-duration="2000">
            <h2 className="banner-title">
              Because Every <br />
              Event Tells a Story
            </h2>

            <p className="banner-text">
              Whether it's a joyful celebration or a meaningful farewell,
              Eventura helps you plan events that reflect emotions, culture, and
              care — without stress.
            </p>

            <p className="banner-highlight">You celebrate. We manage the rest.</p>
            <div className="d-flex align-items-center gap-3 flex-nowrap">
              <Link to="/bookNow" className="btn btn-warn">
                Plan Your Event
              </Link>
              <Link to="/services" className="btn btn-outline-light">
                Explore Options
              </Link>
            </div>
          </div>

          {/* Right Image */}

          <div className="col-lg-5 col-md-6 text-center mt-2 mt-lg-0 mt-md-5">
            <img
              src={ banner }
              alt="Event Banner"
              className="img-fluid banner-image"
              data-aos="flip-left"
              data-aos-duration="2500"
              data-aos-easing="ease-out-cubic"
              
              
            />
            {/*  */}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Banner;
