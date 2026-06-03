import React from 'react'
import './MainBanner.css'
import img1 from "../Images/white-gown-belly.jpg";
import img2 from "../Images/cake.jpg";
import img3 from "../Images/party.jpg";
import img4 from "../Images/carousel_1.jpg";
import { Link } from 'react-router-dom';

function MainBanner() {
  return (
    <section className="main-banner">
      <div className="container py-0 py-md-4">
        <div className="row align-items-start">
          
          {/* Left Content */}
          <div className="col-lg-6 col-md-6 text-light">
            <h1 className="head-text" data-aos="fade-right"
              data-aos-duration="2000">
              Plan Every Event, With Ease & Elegance ✨
            </h1>

            <p className="head-para" data-aos="fade-right"
              data-aos-duration="2000">
              From Weddings to Baby Showers, From Birthdays to Farewell
              Ceremonies — All services in one place.
            </p>

            <div className="row" data-aos="fade-right"
              data-aos-duration="2000">
              <div className="col-lg-6">
                <div className="d-flex align-items-center gap-3">
                  
                  <Link
                    type="button"
                    id="book-now"
                    className="btn btn-warning"
                    to = "/bookNow"
                  >
                    Book an Event
                  </Link>

                  <Link
                    to="/services"
                    className="btn btn-outline-light"
                    id="explore-service"
                  >
                    Explore Services
                  </Link>

                </div>
              </div>
            </div>
          </div>

          {/* Right Image Collage */}
          <div className="col-lg-6 col-md-6 mt-4">
            <div className="image-collage">
              <img src={img1} alt="img1" className="img1" data-aos="zoom-in-up"  data-aos-duration="2000" />
              <img src={img2} alt="img2" className="img2" data-aos="zoom-in-right" data-aos-duration="2500"/>
              <img src={img3} alt="img3" className="img3" data-aos="zoom-in-left"  data-aos-duration="2000" />
              <img src={img4} alt="img4" className="img4" data-aos="zoom-in-down"  data-aos-duration="2500" />
            </div>
          </div>

        </div>
      </div>
    </section>

  )
}

export default MainBanner
