import React, { useEffect, useState } from "react";
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
import profileFallback from '../Event-Images/profile3.jpg';
import axios from "axios";

function AboutEvent() {

  // State to hold the dynamic organizer data
  const [organizer, setOrganizer] = useState({
    name: "Loading...",
    title: "Loading...",
    phone: "",
    website: "",
    profileImage: ""
  });

// Fetch the settings data when the component mounts
  useEffect(() => {
    const fetchSettingsData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/settings");
        
        // Check if the backend returned the organizer object
        if (res.data.data.organizer) {
          const fetchedData = res.data.data.organizer;
          
          // Set the state, but if the database string is empty, use our default dummy text
          setOrganizer({
            name: fetchedData.name || "Sarah Morgan",
            title: fetchedData.title || "Certified Wedding Planner",
            phone: fetchedData.phone || "",
            website: fetchedData.website || "",
            profileImage: fetchedData.profileImage || ""
          });
        }
      } catch (error) {
        console.error("Failed to fetch organizer data:", error);
        
        // If the server is down, remove the "Loading..." text and show dummy data so the UI doesn't break
        setOrganizer({
          name: "Sarah Morgan",
          title: "Certified Wedding Planner",
          phone: "+1 123-456-7890",
          website: "www.sarahmorgan.com",
          profileImage: ""
        });
      }
    };
    
    fetchSettingsData();
  }, []);

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

               <h4 className="mb-4 text-center text-lg-start">Event Organizer</h4>

                {/* MODIFIED RESPONSIVE ROW: Fixed overlap on medium devices */}
                <div className="row g-2 align-items-center text-center text-lg-start">
                  
                  {/* Image Column: 100% width on sm/md (Stacked), 33% width on lg (Side-by-side) */}
                  <div className="col-12 col-md-12 col-lg-4 mb-3 mb-lg-0 d-flex justify-content-center justify-content-lg-start">
                    <img 
                      src={organizer.profileImage ? `http://localhost:5000${organizer.profileImage}` : profileFallback} 
                      alt="Organizer Profile" 
                      className="img-fluid" 
                      style={{ 
                        borderRadius: "50%", 
                        objectFit: "cover", 
                        width: "120px", /* Fixed exact dimensions prevents grid breaking */
                        height: "120px"
                      }} 
                    />
                  </div>
                  
                  {/* Text Details Column: 100% width on sm/md (Stacked), 66% width on lg (Side-by-side) */}
                  <div className="col-12 col-md-12 col-lg-8" style={{ wordWrap: "break-word", overflowWrap: "break-word" }}>
                    <h4 style={{textTransform: 'capitalize'}}>{organizer.name || "Organizer Name"}</h4>
                    <p id="planner" style={{textTransform: 'capitalize'}}>{organizer.title || "Organizer Title"}</p>
                    
                    {organizer.phone && (
                      <p className="d-flex justify-content-center justify-content-lg-start align-items-center">
                        <i className="bi bi-telephone-inbound me-2"></i>
                        <span style={{ textDecoration: 'none', color: '#062036'}}>{organizer.phone}</span>
                      </p>
                    )}
                    
                    {organizer.website && (
                      <p className=" justify-content-lg-start align-items-center mb-0">
                        <i className="bi bi-globe-americas me-2"></i>
                        <a 
                          href={organizer.website.startsWith('http') ? organizer.website : `https://${organizer.website}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          id="email-id"
                          style={{ textDecoration: 'none', paddingLeft: 0, backgroundColor: 'transparent', wordBreak: 'break-word' }}
                        >
                          {organizer.website}
                        </a>
                      </p>
                    )}
                  </div>
                </div>

                {/* Automatically formats the phone number for WhatsApp */}
                {organizer.phone ? (
                  <a 
                    href={`https://wa.me/${organizer.phone.replace(/[^0-9]/g, '')}`} 
                    className="btn mt-4 w-100"
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <i className="bi bi-whatsapp me-2"></i> Contact on WhatsApp
                  </a>
                ) : null}
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
