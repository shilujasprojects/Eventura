import React from "react";
import { Link } from "react-router-dom";
import './AboutEvent.css'
import decoration_table from "../Event-Images/decoration-table.jpg";
import birth from "../Event-Images/birth.jpg";
import cherres_party from "../Event-Images/cherres-party.jpg";
import belly_touch from "../Event-Images/belly-touch.jpg";
import couple from "../Event-Images/couple.jpg";
import makeup_girl from "../Event-Images/makeup-girl.jpg";
import catering_foood from "../Event-Images/catering-foood.jpg";
import dj_party from "../Event-Images/dj-party.jpg";
import hall_decor from "../Event-Images/hall-decor.jpg";
import couple_wedding from "../Event-Images/couple-wedding.jpg";
import cater_seets from "../Event-Images/cater-seets.jpg";
import funeral_flower2 from "../Event-Images/funeral-flower2.jpg";
import profile from '../Event-Images/profile3.jpg'

function AboutEvent() {
  return (
    // About Event Section

    <div className="container-fluid about-event">
      <div className="container">
      <div className="row">
        <div className="col-lg-8 mt-3 mt-lg-5">
          <h3>About the Event</h3>
          <p className="text-start">
            Join us in celebrating a beautiful and memorable baby shower
            ceremony filled with love, laughter, and heartfelt moments. This
            special occasion is thoughtfully organized to bless the mother-to-be
            and welcome the new beginning with traditional customs, joyful
            interactions, and warm family gatherings. Surrounded by close
            friends and loved ones, the event features elegant décor, delightful
            refreshments, and meaningful rituals that make the celebration truly
            unforgettable. Every detail is carefully planned to create a
            stress-free experience, allowing families to focus on joy,
            togetherness, and cherished memories that will last a lifetime.
          </p>

          <hr className="mt-4" />

          <div className=" mt-2 mt-lg-4">
            <h4 id="gallery-text">Gallery</h4>

            <div className="row g-3 mt-3 ">
              <div className="col-lg-4 col-md-4" data-aos="zoom-in">
                <img
                  src={decoration_table}
                  alt=""
                  className="img-fluid img-gallery"
                />
              </div>
              <div className="col-lg-4  col-md-4" data-aos="zoom-in"  data-aos-duration="1500">
                <img src={birth} alt="" className="img-fluid img-gallery" />
              </div>
              <div className="col-lg-4 col-md-4" data-aos="zoom-in"  data-aos-duration="1500">
                <img src={cherres_party} alt="" className="img-fluid img-gallery" />
              </div>
              <div className="col-lg-4 col-md-4" data-aos="zoom-in"  data-aos-duration="1500">
                <img src={belly_touch} alt="" className="img-fluid img-gallery" />
              </div>
              <div className="col-lg-4 col-md-4" data-aos="zoom-in"  data-aos-duration="1500">
                <img src={couple} alt="" className="img-fluid img-gallery" />
              </div>
              <div className="col-lg-4 col-md-4" data-aos="zoom-in"  data-aos-duration="1500">
                <img src={makeup_girl} alt="" className="img-fluid img-gallery" />
              </div>
              <div className="col-lg-4 col-md-4" data-aos="zoom-in"  data-aos-duration="1500">
                <img
                  src={catering_foood}
                  alt=""
                  className="img-fluid img-gallery"
                />
              </div>
              <div className="col-lg-4 col-md-4" data-aos="zoom-in"  data-aos-duration="1500">
                <img src={dj_party} alt="" className="img-fluid img-gallery" />
              </div>
              <div className="col-lg-4 col-md-4" data-aos="zoom-in"  data-aos-duration="1500">
                <img src={hall_decor} alt="" className="img-fluid img-gallery" />
              </div>
              <div className="col-lg-4 col-md-4" data-aos="zoom-in"  data-aos-duration="1500">
                <img
                  src={couple_wedding}
                  alt=""
                  className="img-fluid img-gallery"
                />
              </div>
              <div className="col-lg-4 col-md-4" data-aos="zoom-in">
                <img src={cater_seets} alt="" className="img-fluid img-gallery" />
              </div>
              <div className="col-lg-4 col-md-4" data-aos="zoom-in">
                <img
                  src={funeral_flower2}
                  alt=""
                  className="img-fluid img-gallery"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="row">
            {/* LEFT SIDE on md: Price + Gallery */}

            <div className="col-12 col-md-6 col-lg-12">
              {/* Price Card */}

              <div className="side-card">
                <h2>₹250&nbsp;Per person</h2>
                <hr />

                <div className="icon d-flex">
                  <i className="bi bi-bag mx-3"></i>
                  <p>Sat, January 16, 2026</p>
                </div>
                <div className="icon d-flex">
                  <i className="bi bi-check2-circle mx-3"></i>
                  <p>5:00 PM onwards</p>
                </div>
                <div className="icon d-flex">
                  <i className="bi bi-geo-alt mx-3"></i>
                  <p>Lakeside Gardens, Kumarakom, Kottayam, Kerala</p>
                </div>

                <Link className="btn" to="#">
                  Book Now
                </Link>
              </div>

              {/* Gallery Card */}
              <div className="side-card">
                <h4 id="gallery-text-box">Gallery</h4>
                <div className="card text-start" id="card-book">
                  <h5 className="card-title">Book Your Ticket Today!</h5>
                  <p>
                    Experience this unforgettable event with seamless planning.
                  </p>
                  <Link to="#" className="btn ms-0">
                    Continue
                  </Link>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE on md: Schedule + Organizer */}

            <div className="col-12 col-md-6 col-lg-12">
              <div className="side-card">
                <h4 className="mb-4">Schedules</h4>

                <div className="icon d-flex">
                  <i className="bi bi-play-circle mx-3"></i>
                  <p>5:00 PM Welcome Reception</p>
                </div>
                <div className="icon d-flex">
                  <i className="bi bi-play-circle mx-3"></i>
                  <p>5:30 PM Ceremony Starts</p>
                </div>
                <div className="icon d-flex">
                  <i className="bi bi-play-circle mx-3"></i>
                  <p>7:00 PM Cocktail Hour</p>
                </div>

                <hr />

                <h4 className="mb-4">Event Organizer</h4>

                <div className="row g-2">
                  <div className="col-4">
                    <img src={ profile } alt="profile pic" className="img-fluid" />
                  </div>
                  <div className="col-8">
                    <h4>Sarah Morgan</h4>
                    <p id="planner">Certified Wedding Planner</p>
                    <p>
                      <i className="bi bi-telephone-inbound"></i>
                      <span className="px-1">+1 123-456-7890</span>
                    </p>
                    <p>
                      <i className="bi bi-globe-americas"></i>
                      <span id="email-id">www.sarahmorgan.com</span>
                    </p>
                  </div>
                </div>

                <Link to="#" className="btn mt-3">
                  Contact Organizer
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br />
      <br />
    </div>
    </div>
  )
}

export default AboutEvent
