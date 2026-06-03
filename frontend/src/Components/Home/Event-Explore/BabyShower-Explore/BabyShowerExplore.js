// BabyShowerExplore.js

import React from "react";
import "./BabyShowerExplore.css";
import Navbar from "../../../Navbar/Navbar";
import Footer from "../../../Footer/Footer";

function BabyShowerExplore() {

  const babyImages = [
     "https://images.unsplash.com/photo-1544717305-2782549b5136",
  
  "https://images.unsplash.com/photo-1516627145497-ae6968895b74",

  "https://images.unsplash.com/photo-1519689680058-324335c77eba",

  "https://images.unsplash.com/photo-1513151233558-d860c5398176",

  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc",

  "https://images.unsplash.com/photo-1519225421980-715cb0215aed",

  "https://images.unsplash.com/photo-1519741497674-611481863552",

  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",

  "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8"
  ];

  return (

    <>
    
      <Navbar />

      <section className="baby-shower-explore">

        {/* Hero Section */}

        <div className="baby-shower-explore-hero">

          <div className="baby-shower-explore-left">

            <p className="baby-shower-explore-mini-title">
              EVENTURA BABY SHOWER
            </p>

            <h1 className="baby-shower-explore-main-title">
              Celebrate The Sweetest Beginning
            </h1>

            <p className="baby-shower-explore-description">
              Elegant baby shower celebrations designed with dreamy décor,
              floral styling, premium dining, games, photography,
              entertainment, and unforgettable memories for your growing family.
            </p>

            <button className="baby-shower-explore-btn">
              Explore Celebration
            </button>

          </div>

          <div className="baby-shower-explore-right">

            <img
              src={babyImages[0]}
              alt="baby shower"
              className="baby-shower-explore-main-image"
            />

            <img
              src={babyImages[1]}
              alt="baby shower"
              className="baby-shower-explore-floating-image"
            />

          </div>

        </div>

        {/* Story Section */}

        <div className="baby-shower-explore-story-section">

          <div className="baby-shower-explore-story-image">
            <img src={babyImages[2]} alt="baby shower" />
          </div>

          <div className="baby-shower-explore-story-content">

            <p className="baby-shower-explore-mini-title">
              BEAUTIFUL MOMENTS
            </p>

            <h2>
              A Celebration Filled With Joy & Love
            </h2>

            <p>
              Eventura creates luxury baby shower experiences with elegant
              styling, premium decoration, personalized themes, lighting,
              catering, games, and unforgettable moments for families.
            </p>

            <p>
              Every celebration is carefully crafted to create emotional,
              heartwarming memories surrounded by your loved ones.
            </p>

          </div>

        </div>

        {/* Image Gallery */}

        <div className="baby-shower-explore-gallery">

          <div className="baby-shower-explore-gallery-card">
            <img src={babyImages[3]} alt="decor" />
            <h4>Dreamy Decorations</h4>
          </div>

          <div className="baby-shower-explore-gallery-card">
            <img src={babyImages[4]} alt="celebration" />
            <h4>Elegant Celebration</h4>
          </div>

          <div className="baby-shower-explore-gallery-card">
            <img src={babyImages[5]} alt="photography" />
            <h4>Memorable Photography</h4>
          </div>

        </div>

        {/* Highlight Section */}

        <div className="baby-shower-explore-highlight-section">

          <div className="baby-shower-explore-highlight-left">

            <img src={babyImages[6]} alt="baby shower" />

          </div>

          <div className="baby-shower-explore-highlight-right">

            <div className="baby-shower-explore-highlight-box">

              <p className="baby-shower-explore-mini-title">
                EVENTURA EXPERIENCE
              </p>

              <h2>
                Personalized Luxury Baby Shower Events
              </h2>

              <p>
                From elegant floral setups and pastel themes to live dessert
                counters, family entertainment, games, music, and photography —
                Eventura handles every detail beautifully.
              </p>

              <button className="baby-shower-explore-btn">
                Discover Packages
              </button>

            </div>

          </div>

        </div>

        {/* Services */}

        <div className="baby-shower-explore-services">

          <div className="baby-shower-explore-service-item">
            <img src={babyImages[7]} alt="service" />
            <p>Luxury Decor Styling</p>
          </div>

          <div className="baby-shower-explore-service-item">
            <img src={babyImages[8]} alt="service" />
            <p>Premium Catering</p>
          </div>

          <div className="baby-shower-explore-service-item">
            <img src={babyImages[2]} alt="service" />
            <p>Family Photography</p>
          </div>

        </div>

        {/* Packages */}

        <div className="baby-shower-explore-package-heading">

          <p className="baby-shower-explore-mini-title">
            EVENT PACKAGES
          </p>

          <h2>
            Choose Your Perfect Celebration
          </h2>

        </div>

        <div className="baby-shower-explore-packages">

          {/* Silver */}

          <div className="baby-shower-explore-package-card">

            <h3>Silver</h3>

            <h1>₹25K</h1>

            <ul>
              <li>Elegant Balloon Decor</li>
              <li>Simple Floral Styling</li>
              <li>Photography Coverage</li>
              <li>Welcome Entrance Setup</li>
              <li>Family Seating Arrangement</li>
            </ul>

            <button>Choose Package</button>

          </div>

          {/* Gold */}

          <div className="baby-shower-explore-package-card baby-shower-explore-featured-package">

            <span className="baby-shower-explore-tag">
              MOST BOOKED
            </span>

            <h3>Gold</h3>

            <h1>₹55K</h1>

            <ul>
              <li>Luxury Theme Decoration</li>
              <li>Premium Floral Styling</li>
              <li>Live Dessert Counter</li>
              <li>Professional Photography</li>
              <li>Entertainment & Games</li>
              <li>Music & Lighting Setup</li>
            </ul>

            <button>Choose Package</button>

          </div>

          {/* Premium */}

          <div className="baby-shower-explore-package-card">

            <h3>Premium</h3>

            <h1>₹1.2L</h1>

            <ul>
              <li>Grand Luxury Decoration</li>
              <li>Celebrity Style Setup</li>
              <li>Complete Event Management</li>
              <li>Premium Dining Experience</li>
              <li>Cinematic Photography</li>
              <li>Entertainment & Live Music</li>
            </ul>

            <button>Choose Package</button>

          </div>

          {/* Custom */}

          <div className="baby-shower-explore-package-card">

            <h3>Custom</h3>

            <h1>Flexible</h1>

            <ul>
              <li>Fully Personalized Theme</li>
              <li>Luxury Add-ons</li>
              <li>Venue Planning</li>
              <li>Custom Catering</li>
              <li>Premium Entertainment</li>
              <li>Exclusive Experience Design</li>
            </ul>

            <button>Contact Us</button>

          </div>

        </div>

      </section>

      <Footer />

    </>
  );
}

export default BabyShowerExplore;