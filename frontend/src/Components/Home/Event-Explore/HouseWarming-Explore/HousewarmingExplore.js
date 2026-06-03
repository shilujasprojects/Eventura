// HousewarmingExplore.js

import React from "react";
import "./HousewarmingExplore.css";

import Navbar from "../../../Navbar/Navbar";
import Footer from "../../../Footer/Footer";

function HousewarmingExplore() {

  const houseImages = [

    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",

    "https://images.unsplash.com/photo-1484154218962-a197022b5858",

    "https://images.unsplash.com/photo-1494526585095-c41746248156",

    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",

    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",

    "https://images.unsplash.com/photo-1489515217757-5fd1be406fef",

    "https://images.unsplash.com/photo-1460317442991-0ec209397118",

    "https://images.unsplash.com/photo-1448630360428-65456885c650",

    "https://images.unsplash.com/photo-1494526585095-c41746248156"
  ];

  return (

    <>

      <Navbar />

      <section className="housewarming-explore mt-5">

        {/* HERO */}

        <div className="housewarming-explore-hero">

          <p className="housewarming-explore-mini-title">
            EVENTURA HOUSE WARMING
          </p>

          <h1 className="housewarming-explore-main-title">
            Create Warm Memories <br />
            In Your Dream Home
          </h1>

          <p className="housewarming-explore-description">
            Elegant house warming celebrations designed with luxurious
            décor, traditional touches, premium dining, floral styling,
            lighting, and unforgettable moments crafted beautifully
            by Eventura.
          </p>

        </div>

        {/* SECTION 1 */}

        <div className="housewarming-explore-section-one">

          <div className="housewarming-explore-left-image">

            <img
              src={houseImages[0]}
              alt="housewarming"
            />

          </div>

          <div className="housewarming-explore-right-content">

            <p className="housewarming-small-title">
              EVENTURA EXPERIENCE
            </p>

            <h2>
              Celebrate New <br />
              Beginnings Beautifully
            </h2>

            <p>
              Every home deserves a warm celebration filled with
              happiness, elegance, and unforgettable memories.
            </p>

            <button>
              Explore Eventura
            </button>

          </div>

          <div className="housewarming-floating-image">

            <img
              src={houseImages[1]}
              alt="housewarming"
            />

          </div>

        </div>

        {/* SECTION 2 */}

        <div className="housewarming-explore-section-two">

          <div className="housewarming-explore-left-content">

            <h2>
              A Perfect Blend <br />
              Of Tradition & Luxury
            </h2>

            <p>
              From floral decoration to dining arrangements,
              lighting, seating, and guest coordination —
              every detail is designed to make your house
              warming elegant and stress-free.
            </p>

            <button>
              About Our Services
            </button>

          </div>

          <div className="housewarming-explore-right-gallery">

            <div className="housewarming-gallery-large">

              <img
                src={houseImages[2]}
                alt="housewarming"
              />

            </div>

            <div className="housewarming-gallery-small">

              <img
                src={houseImages[3]}
                alt="housewarming"
              />

            </div>

          </div>

        </div>

        {/* SECTION 3 */}

        <div className="housewarming-explore-banner">

          <img
            src={houseImages[4]}
            alt="housewarming"
          />

          <div className="housewarming-explore-banner-card">

            <h2>
              Your Housewarming <br />
              Experience
            </h2>

            <p>
              Eventura creates elegant celebrations with décor,
              catering, lighting, photography, floral styling,
              and premium guest experiences for your dream home.
            </p>

            <button>
              Discover Packages
            </button>

          </div>

        </div>

        {/* FEATURES */}

        <div className="housewarming-explore-features">

          <h2>
            Our Features
          </h2>

          <div className="housewarming-feature-grid">

            <div className="housewarming-feature-card">

              <img
                src={houseImages[5]}
                alt="decor"
              />

              <p>
                Luxury Home Décor
              </p>

            </div>

            <div className="housewarming-feature-card">

              <img
                src={houseImages[6]}
                alt="dining"
              />

              <p>
                Elegant Dining Setup
              </p>

            </div>

            <div className="housewarming-feature-card">

              <img
                src={houseImages[7]}
                alt="lighting"
              />

              <p>
                Premium Guest Experience
              </p>

            </div>

          </div>

        </div>

        {/* PACKAGES */}

<div className="housewarming-explore-packages-wrapper">

  <div className="housewarming-explore-package-heading">

    <p>
      EVENTURA PACKAGES
    </p>

    <h2>
  Elegant Packages
  For Your Housewarming
</h2>

  </div>

  <div className="housewarming-explore-packages">

    {/* SILVER */}

    <div className="housewarming-explore-package-card">

      <h3>Silver</h3>

      <h2>₹25K</h2>

      <ul>

        <li>Elegant Entrance Décor</li>

        <li>Basic Floral Styling</li>

        <li>Traditional Setup</li>

        <li>Guest Seating Arrangement</li>

        <li>Welcome Refreshments</li>

      </ul>

      <button>
        Choose Package
      </button>

    </div>

    {/* GOLD */}

    <div className="housewarming-explore-package-card premium-package">

      <div className="housewarming-package-tag">
        MOST BOOKED
      </div>

      <h3>Gold</h3>

      <h2>₹60K</h2>

      <ul>

        <li>Luxury Floral Decoration</li>

        <li>Premium Lighting Setup</li>

        <li>Dining Arrangement</li>

        <li>Photography Coverage</li>

        <li>Guest Coordination</li>

        <li>Music & Ambience</li>

      </ul>

      <button>
        Choose Package
      </button>

    </div>

    {/* PREMIUM */}

    <div className="housewarming-explore-package-card">

      <h3>Premium</h3>

      <h2>₹1.2L</h2>

      <ul>

        <li>Grand Luxury Decoration</li>

        <li>Premium Catering Setup</li>

        <li>Cinematic Photography</li>

        <li>Entertainment Experience</li>

        <li>Luxury Seating Arrangement</li>

        <li>Complete Event Coordination</li>

      </ul>

      <button>
        Choose Package
      </button>

    </div>

    {/* CUSTOM */}

    <div className="housewarming-explore-package-card">

      <h3>Custom</h3>

      <h2>Flexible</h2>

      <ul>

        <li>Customized Theme Décor</li>

        <li>Luxury Add-ons</li>

        <li>Flexible Guest Planning</li>

        <li>Custom Dining Experience</li>

        <li>Photography & Entertainment</li>

        <li>Fully Personalized Setup</li>

      </ul>

      <button>
        Contact Eventura
      </button>

    </div>

  </div>

</div>

        {/* TESTIMONIAL */}

        <div className="housewarming-explore-testimonial">

          <h2>
            “Eventura transformed our house warming into a beautiful,
            luxurious celebration filled with warmth and unforgettable memories.”
          </h2>

          <p>
            — SHILU & FAMILY
          </p>

        </div>

      </section>

      <Footer />

    </>

  );
}

export default HousewarmingExplore;