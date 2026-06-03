// AnniversaryExplore.js

import React from "react";
import "./AnniversaryExplore.css";
import Navbar from "../../../Navbar/Navbar";
import Footer from "../../../Footer/Footer";

function AnniversaryExplore() {

  const anniversaryImages = [

    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc",

    "https://images.unsplash.com/photo-1522673607200-164d1b6ce486",

    "https://images.unsplash.com/photo-1519741497674-611481863552",

    "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8",

    "https://images.unsplash.com/photo-1525258946800-98cfd641d0de",

    "https://images.unsplash.com/photo-1519225421980-715cb0215aed",

    "https://images.unsplash.com/photo-1520854221256-17451cc331bf",

    "https://images.unsplash.com/photo-1513278974582-3e1b4a4fa21f",

    "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2"

  ];

  return (

    <>
    
      <Navbar />

      <section className="anniversary-explore">

        {/* HERO */}

        <div className="anniversary-explore-hero">

          <img
            src={anniversaryImages[0]}
            alt="anniversary"
          />

          <div className="anniversary-explore-overlay">

            <p>
              EVENTURA ANNIVERSARY
            </p>

            <h1>
              Celebrate Love <br />
              Beyond Time
            </h1>

            <button>
              Explore Moments
            </button>

          </div>

        </div>

        {/* STORY SECTION */}

        <div className="anniversary-explore-story-section">

          <div className="anniversary-explore-story-left">

            <h2>
              Where Beautiful <br />
              Memories Return
            </h2>

            <p>
              Eventura creates elegant anniversary celebrations
              designed with romance, luxury décor, candlelit dining,
              floral artistry, and unforgettable experiences.
            </p>

            <p>
              Whether it’s your 1st anniversary or a golden milestone,
              every detail is crafted to relive your journey together.
            </p>

            <button>
              Learn More
            </button>

          </div>

          <div className="anniversary-explore-story-right">

            <img
              src={anniversaryImages[1]}
              alt="couple"
              className="anniversary-explore-main-img"
            />

            <img
              src={anniversaryImages[2]}
              alt="flowers"
              className="anniversary-explore-circle-img"
            />

          </div>

        </div>

        {/* MARQUEE */}

        <div className="anniversary-explore-marquee">

          <p>
            ✦ EVENTURA LOVE STORIES ✦ TIMELESS ANNIVERSARY MOMENTS ✦
            ELEGANT CELEBRATIONS ✦ ROMANTIC EXPERIENCES ✦
          </p>

        </div>

        {/* GALLERY */}

        <div className="anniversary-explore-gallery">

          <div className="anniversary-explore-gallery-card">

            <img
              src={anniversaryImages[3]}
              alt="anniversary"
            />

            <h3>
              Together Forever
            </h3>

            <p>
              Elegant romantic celebrations beautifully crafted
              with luxurious styling.
            </p>

          </div>

          <div className="anniversary-explore-gallery-card">

            <img
              src={anniversaryImages[4]}
              alt="anniversary"
            />

            <h3>
              Floral Elegance
            </h3>

            <p>
              Premium floral décor and dreamy candlelight
              experiences by Eventura.
            </p>

          </div>

          <div className="anniversary-explore-gallery-card">

            <img
              src={anniversaryImages[5]}
              alt="anniversary"
            />

            <h3>
              Romantic Evenings
            </h3>

            <p>
              Celebrate milestones with intimate luxury
              anniversary experiences.
            </p>

          </div>

        </div>

        {/* PERFECT DAY */}

        <div className="anniversary-explore-perfect-section">

          <div className="anniversary-explore-perfect-left">

            <img
              src={anniversaryImages[6]}
              alt="anniversary"
            />

          </div>

          <div className="anniversary-explore-perfect-right">

            <div className="anniversary-explore-small-grid">

              <img
                src={anniversaryImages[4]}
                alt="anniversary"
              />

              <img
                src={anniversaryImages[8]}
                alt="anniversary"
              />

            </div>

            <div className="anniversary-explore-perfect-content">

              <h2>
                Your Perfect <br />
                Anniversary
              </h2>

              <p>
                From romantic candlelight dinners to luxurious
                anniversary décor and premium experiences,
                Eventura turns your celebration into timeless memories.
              </p>

            </div>

          </div>

        </div>

        {/* PACKAGES */}

        <div className="anniversary-explore-packages-wrapper">

          <div className="anniversary-explore-package-heading">

            <p>
              EVENTURA PACKAGES
            </p>

            <h2>
              Anniversary Packages
            </h2>

          </div>

          <div className="anniversary-explore-packages">

            {/* SILVER */}

            <div className="anniversary-explore-package-card">

              <h3>Silver</h3>

              <h2>₹25K</h2>

              <ul>

                <li>Elegant Table Décor</li>

                <li>Floral Arrangements</li>

                <li>Romantic Lighting</li>

                <li>Photography Coverage</li>

                <li>Music Setup</li>

              </ul>

              <button>
                Choose Package
              </button>

            </div>

            {/* GOLD */}

            <div className="anniversary-explore-package-card premium-package">

              <div className="anniversary-package-tag">
                MOST BOOKED
              </div>

              <h3>Gold</h3>

              <h2>₹60K</h2>

              <ul>

                <li>Luxury Decoration</li>

                <li>Premium Floral Styling</li>

                <li>Candlelight Dining</li>

                <li>Cinematic Photography</li>

                <li>Entertainment Setup</li>

                <li>Guest Coordination</li>

              </ul>

              <button>
                Choose Package
              </button>

            </div>

            {/* PREMIUM */}

            <div className="anniversary-explore-package-card">

              <h3>Premium</h3>

              <h2>₹1.2L</h2>

              <ul>

                <li>Luxury Anniversary Experience</li>

                <li>Premium Dining Setup</li>

                <li>Drone Photography</li>

                <li>Live Entertainment</li>

                <li>Luxury Seating Arrangement</li>

                <li>Complete Event Coordination</li>

              </ul>

              <button>
                Choose Package
              </button>

            </div>

            {/* CUSTOM */}

            <div className="anniversary-explore-package-card">

              <h3>Custom</h3>

              <h2>Flexible</h2>

              <ul>

                <li>Customized Theme Décor</li>

                <li>Luxury Add-ons</li>

                <li>Private Dining Experience</li>

                <li>Photography & Entertainment</li>

                <li>Flexible Planning</li>

                <li>Fully Personalized Setup</li>

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

export default AnniversaryExplore;