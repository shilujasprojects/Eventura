// CorporateExplore.js

import React from "react";
import "./CorporateExplore.css";

import Navbar from "../../../Navbar/Navbar";
import Footer from "../../../Footer/Footer";

function CorporateExplore() {

  const corporateImages = [

    "https://images.unsplash.com/photo-1511578314322-379afb476865",

    "https://images.unsplash.com/photo-1505373877841-8d25f7d46678",

    "https://images.unsplash.com/photo-1515169067868-5387ec356754",

    "https://images.unsplash.com/photo-1517457373958-b7bdd4587205",

    "https://images.unsplash.com/photo-1497366754035-f200968a6e72",

    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",

    "https://images.unsplash.com/photo-1552664730-d307ca884978",

    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3"

  ];

  return (

    <>

      <Navbar />

      <section className="corporate-explore">

        {/* HERO */}

        <div className="corporate-explore-hero">

          <img
            src={corporateImages[0]}
            alt="corporate"
          />

          <div className="corporate-explore-overlay">

            <p>
              EVENTURA CORPORATE
            </p>

            <h1>
              Corporate Events <br />
              Reimagined
            </h1>

            <button>
              Explore Experiences
            </button>

          </div>

        </div>

        {/* WELCOME SECTION */}

        <div className="corporate-explore-welcome-section">

          <div className="corporate-explore-welcome-left">

            <img
              src={corporateImages[1]}
              alt="corporate"
            />

          </div>

          <div className="corporate-explore-welcome-center">

            <p>
              EVENTURA EXPERIENCE
            </p>

            <h2>
              Premium Corporate <br />
              Event Planning
            </h2>

            <span>
              Meetings • Launches • Conferences • Gala Nights
            </span>

            <button>
              View Services
            </button>

          </div>

          <div className="corporate-explore-welcome-right">

            <img
              src={corporateImages[2]}
              alt="corporate"
            />

          </div>

        </div>

        {/* FEATURE IMAGE */}

        <div className="corporate-explore-feature-image">

          <img
            src={corporateImages[3]}
            alt="corporate"
          />

          <div className="corporate-explore-feature-content">

            <h2>
              Creating Elegant <br />
              Business Experiences
            </h2>

            <p>
              From luxury corporate dinners to product launches,
              conferences, networking events, and executive meetings —
              Eventura creates seamless experiences that leave
              a lasting impression.
            </p>

          </div>

        </div>

        {/* BRANDS */}

        <div className="corporate-explore-brands">

          <p>
            TRUSTED BY LEADING BRANDS
          </p>

          <div className="corporate-explore-brand-logos">

            <span>EVENTURA</span>

            <span>ELITE GROUP</span>

            <span>VISION TECH</span>

            <span>URBAN MEDIA</span>

            <span>NEXORA</span>

          </div>

        </div>

        {/* SERVICES */}

        <div className="corporate-explore-services-section">

          <div className="corporate-explore-services-left">

            <h2>
              Working With <br />
              Eventura
            </h2>

            <p>
              We design premium corporate experiences tailored
              to your brand identity. Every detail — from
              lighting to hospitality — is crafted with elegance.
            </p>

            <button>
              Request Brochure
            </button>

          </div>

          <div className="corporate-explore-services-right">

            <div className="corporate-explore-service-card">

              <h3>
                Corporate Conferences
              </h3>

              <p>
                Luxury conference setups with premium guest experience.
              </p>

            </div>

            <div className="corporate-explore-service-card">

              <h3>
                Product Launches
              </h3>

              <p>
                Modern launch events designed for maximum impact.
              </p>

            </div>

            <div className="corporate-explore-service-card">

              <h3>
                Gala & Networking
              </h3>

              <p>
                Elegant networking evenings and executive gatherings.
              </p>

            </div>

          </div>

        </div>

        {/* GALLERY */}

        <div className="corporate-explore-gallery">

          <img
            src={corporateImages[4]}
            alt="corporate"
          />

          <img
            src={corporateImages[5]}
            alt="corporate"
          />

          <img
            src={corporateImages[6]}
            alt="corporate"
          />

        </div>

        {/* PACKAGES */}

        <div className="corporate-explore-packages-wrapper">

          <div className="corporate-explore-package-heading">

            <p>
              EVENTURA PACKAGES
            </p>

            <h2>
              Corporate Packages
            </h2>

          </div>

          <div className="corporate-explore-packages">

            {/* SILVER */}

            <div className="corporate-explore-package-card">

              <h3>Silver</h3>

              <h2>₹40K</h2>

              <ul>

                <li>Conference Setup</li>

                <li>Basic Stage Decoration</li>

                <li>Audio Setup</li>

                <li>Guest Coordination</li>

                <li>Refreshments</li>

              </ul>

              <button>
                Choose Package
              </button>

            </div>

            {/* GOLD */}

            <div className="corporate-explore-package-card premium-package">

              <div className="corporate-package-tag">
                MOST BOOKED
              </div>

              <h3>Gold</h3>

              <h2>₹90K</h2>

              <ul>

                <li>Luxury Venue Styling</li>

                <li>Lighting & LED Setup</li>

                <li>Professional Photography</li>

                <li>Dining Arrangement</li>

                <li>Corporate Branding</li>

                <li>Guest Hospitality</li>

              </ul>

              <button>
                Choose Package
              </button>

            </div>

            {/* PREMIUM */}

            <div className="corporate-explore-package-card">

              <h3>Premium</h3>

              <h2>₹2L</h2>

              <ul>

                <li>Luxury Corporate Experience</li>

                <li>Executive Lounge Setup</li>

                <li>Entertainment & Media</li>

                <li>Premium Catering</li>

                <li>Complete Event Management</li>

                <li>VIP Hospitality</li>

              </ul>

              <button>
                Choose Package
              </button>

            </div>

            {/* CUSTOM */}

            <div className="corporate-explore-package-card">

              <h3>Custom</h3>

              <h2>Flexible</h2>

              <ul>

                <li>Custom Branding Setup</li>

                <li>Flexible Venue Planning</li>

                <li>Luxury Add-ons</li>

                <li>Personalized Experiences</li>

                <li>Premium Hospitality</li>

                <li>Fully Tailored Corporate Event</li>

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

export default CorporateExplore;