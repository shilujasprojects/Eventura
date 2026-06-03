import React from "react";
import './OurService.css'
import Catering from "../Service-Images/catering-service.jpg";
import Decoration from "../Service-Images/decoration-service.jpg";
import Makeup from "../Service-Images/makeup-service.jpg";
import Photo_Video from "../Service-Images/photo-video-service.jpg";
import Rentals from "../Service-Images/rent-outfit-service.jpg";
import Music from "../Service-Images/music-service.jpg";
import Furniture from "../Service-Images/furniture-service.jpg";
import Event_service from "../Service-Images/event-service.jpg";
import Accessories from "../Service-Images/accessories-service.jpg";
import Cake_service from "../Service-Images/cake-service.jpg";
import Travel from "../Service-Images/travel-service.jpg";
import Kids from "../Service-Images/kids-service.jpg";



function OurService() {
  return (
     // Our Service section

    <div className="container-fluid our-service-card px-0 py-5 p-md-5">
      <section className="container">
        
            <div className="divider">
          <span>Our Services</span>
        </div>
        

        <div className="row g-3 mt-3 mb-5">
          <div className="col-lg-3 col-md-6">
            <div className="service-image-card" data-aos="zoom-out" data-aos-duration="2000">
              <img src={Catering} alt="catering-service" />
              <div className="service-overlay">
                <h4>Catering Services</h4>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="service-image-card" data-aos="zoom-out" data-aos-duration="2000">
              <img src={Decoration} alt="catering-service" />
              <div className="service-overlay">
                <h4>Event Decoration & Styling</h4>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="service-image-card" data-aos="zoom-out" data-aos-duration="2000">
              <img src={Makeup} alt="makeup-service" />
              <div className="service-overlay">
                <h4>Makeup & Styling</h4>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="service-image-card" data-aos="zoom-out" data-aos-duration="2000">
              <img src={Photo_Video} alt="photo-video-service" />
              <div className="service-overlay">
                <h4>Photography & Videography</h4>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="service-image-card" data-aos="zoom-out" data-aos-duration="2000">
              <img src={Rentals} alt="rent-outfit-service" />
              <div className="service-overlay">
                <h4>Rental Outfits</h4>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="service-image-card" data-aos="zoom-out" data-aos-duration="2000">
              <img src={Music} alt="music-service" />
              <div className="service-overlay">
                <h4>Music & Entertainment</h4>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="service-image-card" data-aos="zoom-out" data-aos-duration="2000">
              <img src={Furniture} alt="furniture-service" />
              <div className="service-overlay">
                <h4>Furniture & Equipment</h4>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="service-image-card" data-aos="zoom-out" data-aos-duration="2000">
              <img src={Travel} alt="travel-service" />
              <div className="service-overlay">
                <h4>Travel & Guest Management</h4>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="service-image-card" data-aos="zoom-out" data-aos-duration="2000">
              <img src={Accessories} alt="accessories-service" />
              <div className="service-overlay">
                <h4>Accessories & Event Props</h4>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="service-image-card" data-aos="zoom-out" data-aos-duration="2000">
              <img src={Cake_service} alt="cake-service" />
              <div className="service-overlay">
                <h4>Custom Cakes & Bakery</h4>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="service-image-card" data-aos="zoom-out" data-aos-duration="2000">
              <img src={Kids} alt="kids-service" />
              <div className="service-overlay">
                <h4>Kids Entertainment</h4>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="service-image-card" data-aos="zoom-out" data-aos-duration="2000">
              <img src={Event_service} alt="event-service" />
              <div className="service-overlay">
                <h4>Event Planning & Coordination</h4>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default OurService
