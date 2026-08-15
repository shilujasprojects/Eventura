import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './MainBanner.css'
import img1 from "../Images/white-gown-belly.jpg";
import img2 from "../Images/cake.jpg";
import img3 from "../Images/party.jpg";
import img4 from "../Images/carousel_1.jpg";
import { Link } from 'react-router-dom';

const BASE_URL = 'http://localhost:5000';

// Static fallbacks — used whenever the CMS hasn't uploaded a hero image for
// that slot yet, so the collage layout never breaks or shows gaps.
const fallbackImages = [img1, img2, img3, img4];
const fallbackText = {
  heroTitle: "Plan Every Event, With Ease & Elegance ✨",
  heroSubtitle: "From Weddings to Baby Showers, From Birthdays to Farewell Ceremonies — All services in one place.",
};

function MainBanner() {
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/banner`);
        setBanner(res.data.data);
      } catch (error) {
        // Backend unreachable or banner not set up yet — the static fallbacks
        // below keep the homepage looking correct either way.
        setBanner(null);
      }
    };

    fetchBanner();
  }, []);

  const heroTitle = banner?.heroTitle || fallbackText.heroTitle;
  const heroSubtitle = banner?.heroSubtitle || fallbackText.heroSubtitle;

  // Fill each of the 4 collage slots with a CMS image if one exists,
  // otherwise keep the original static photo for that slot.
  const collageImages = [0, 1, 2, 3].map((i) => {
    const uploaded = banner?.images?.[i];
    return uploaded ? `${BASE_URL}/uploads/${uploaded}` : fallbackImages[i];
  });

  return (
    <section className="main-banner">
      <div className="container py-0 py-md-4">
        <div className="row align-items-start">

          {/* Left Content */}
          <div className="col-lg-6 col-md-6 text-light">
            <h1 className="head-text" data-aos="fade-right"
              data-aos-duration="2000">
              {heroTitle}
            </h1>

            <p className="head-para" data-aos="fade-right"
              data-aos-duration="2000">
              {heroSubtitle}
            </p>

            <div className="row" data-aos="fade-right"
              data-aos-duration="2000">
              <div className="col-lg-6">
                <div className="d-flex align-items-center gap-3">

                  <Link
                    type="button"
                    id="book-now"
                    className="btn btn-warning"
                    to="/bookNow"
                  >
                    {banner?.ctaText || "Book an Event"}
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
              <img src={collageImages[0]} alt="Event highlight 1" className="img1" data-aos="zoom-in-up" data-aos-duration="2000" />
              <img src={collageImages[1]} alt="Event highlight 2" className="img2" data-aos="zoom-in-right" data-aos-duration="2500" />
              <img src={collageImages[2]} alt="Event highlight 3" className="img3" data-aos="zoom-in-left" data-aos-duration="2000" />
              <img src={collageImages[3]} alt="Event highlight 4" className="img4" data-aos="zoom-in-down" data-aos-duration="2500" />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default MainBanner