// EngagementExplore.js

import React from "react";
import "./EngagementExplore.css";

import Navbar from "../../../Navbar/Navbar";
import Footer from "../../../Footer/Footer";

function EngagementExplore() {

  const engagementImages = [
    "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3",
    "https://images.unsplash.com/photo-1530103862676-de8c9debad1d",
    "https://images.unsplash.com/photo-1513151233558-d860c5398176",
    "https://images.unsplash.com/photo-1464349153735-7db50ed83c84",
    "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92",
    "https://images.unsplash.com/photo-1486427944299-d1955d23e34d",
    "https://images.unsplash.com/photo-1521305916504-4a1121188589",
    "https://images.unsplash.com/photo-1558636508-e0db3814bd1d",
    "https://images.unsplash.com/photo-1602631985686-1bb0e6a8696e"
  ];

  return (

    <>
    
      <Navbar />

      <section className="engagement-explore">

        {/* Hero Section */}

        <div className="engagement-explore-hero">

          <p className="engagement-explore-mini-title">
            EVENTURA ENGAGEMENTS
          </p>

          <h1 className="engagement-explore-main-title">
            Celebrate The Beginning <br />
            Of Your Forever Story
          </h1>

          <p className="engagement-explore-description">
            Elegant engagement celebrations designed with luxurious décor,
            romantic floral styling, cinematic photography, premium dining,
            and unforgettable experiences crafted beautifully by Eventura.
          </p>

        </div>

        {/* Collage */}

<div className="engagement-explore-collage">

  <div className="engagement-explore-collage-wrapper">

    

    {/* Top Center */}
    <div className="engagement-explore-image engagement-img-1">
      <img src={engagementImages[0]} alt="engagement" />
    </div>

    {/* Top Right */}
    <div className="engagement-explore-image engagement-img-2">
      <img src={engagementImages[1]} alt="engagement" />
    </div>

    {/* Left Middle */}
    <div className="engagement-explore-image engagement-img-3">
      <img src={engagementImages[2]} alt="engagement" />
    </div>

    {/* Center Main */}
    <div className="engagement-explore-image engagement-img-4">
      <img src={engagementImages[3]} alt="engagement" />
    </div>

    {/* Right Middle */}
    <div className="engagement-explore-image engagement-img-5">
      <img src={engagementImages[4]} alt="engagement" />
    </div>

    {/* Bottom Left */}
    <div className="engagement-explore-image engagement-img-6">
      <img src={engagementImages[5]} alt="engagement" />
    </div>

    {/* Bottom Right */}
    <div className="engagement-explore-image engagement-img-7">
      <img src={engagementImages[6]} alt="engagement" />
    </div>

  </div>

</div>

        {/* About Section */}

        <div className="engagement-explore-about-section">

          <div className="engagement-explore-about-left">

            <p className="engagement-about-small-title">
              OUR ENGAGEMENT EXPERIENCE
            </p>

            <h2>
              Crafted With Elegance,
              Romance & Luxury
            </h2>

            <p>
              Eventura transforms engagement celebrations into timeless
              luxury experiences filled with romance, elegance, and
              unforgettable memories.
            </p>

            <p>
              From dreamy floral arrangements to premium dining,
              entertainment, guest coordination, photography,
              lighting, and venue styling — every detail is
              beautifully curated.
            </p>

          </div>

          <div className="engagement-explore-about-right">

            <img
              src={engagementImages[6]}
              alt="engagement"
            />

          </div>

        </div>

        {/* Services */}

        <div className="engagement-explore-services">

          <div className="engagement-explore-service-card">

            <img
              src={engagementImages[7]}
              alt="decor"
            />

            <p>Luxury Decoration</p>

          </div>

          <div className="engagement-explore-service-card">

            <img
              src={engagementImages[8]}
              alt="photography"
            />

            <p>Cinematic Photography</p>

          </div>

          <div className="engagement-explore-service-card">

            <img
              src={engagementImages[2]}
              alt="premium"
            />

            <p>Premium Experience</p>

          </div>

        </div>

        {/* Packages */}

        <div className="engagement-explore-package-wrapper">

          <div className="engagement-explore-package-heading">

            <p>EVENTURA PACKAGES</p>

            <h2>
              Engagement Packages
              Designed For Every Celebration
            </h2>

          </div>

          <div className="engagement-explore-packages">

            {/* Silver */}

            <div className="engagement-explore-package-card">

              <h3>Silver</h3>

              <h2>₹25K</h2>

              <ul>
                <li>Elegant Stage Setup</li>
                <li>Basic Floral Decoration</li>
                <li>Photography Coverage</li>
                <li>Guest Welcome Area</li>
                <li>Music Arrangement</li>
              </ul>

              <button>
                Choose Package
              </button>

            </div>

            {/* Gold */}

            <div className="engagement-explore-package-card premium-package">

              <div className="package-tag">
                MOST BOOKED
              </div>

              <h3>Gold</h3>

              <h2>₹60K</h2>

              <ul>
                <li>Luxury Floral Styling</li>
                <li>Cinematic Photography</li>
                <li>Live Music & Lighting</li>
                <li>Premium Entrance Setup</li>
                <li>Catering Coordination</li>
                <li>Guest Seating Arrangement</li>
              </ul>

              <button>
                Choose Package
              </button>

            </div>

            {/* Premium */}

            <div className="engagement-explore-package-card">

              <h3>Premium</h3>

              <h2>₹1.2L</h2>

              <ul>
                <li>Grand Luxury Decoration</li>
                <li>Drone Photography</li>
                <li>Premium Dining Experience</li>
                <li>Entertainment & DJ</li>
                <li>Complete Event Coordination</li>
                <li>Luxury Couple Entry</li>
              </ul>

              <button>
                Choose Package
              </button>

            </div>

            {/* Custom */}

            <div className="engagement-explore-package-card">

              <h3>Custom</h3>

              <h2>Flexible</h2>

              <ul>
                <li>Personalized Theme Styling</li>
                <li>Custom Venue Planning</li>
                <li>Luxury Add-ons</li>
                <li>Photography & Entertainment</li>
                <li>Flexible Guest Experience</li>
                <li>Tailored Premium Services</li>
              </ul>

              <button>
                Contact Eventura
              </button>

            </div>

          </div>

        </div>

      </section>

      <Footer />

    </>

  );
}

export default EngagementExplore;