import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
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
  // Grab the specific package ID from the URL (e.g., /about-event/64a7f9b...)
  const { id } = useParams();

  // State to hold the dynamic organizer data
  const [organizer, setOrganizer] = useState({
    name: "Loading...",
    title: "Loading...",
    phone: "",
    website: "",
    profileImage: ""
  });

  // State to hold the dynamic package/service data
  const [eventPackage, setEventPackage] = useState(null);

  // 1. Fetch the organizer settings data
  useEffect(() => {
    const fetchSettingsData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/settings");
        
        if (res.data.data.organizer) {
          const fetchedData = res.data.data.organizer;
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

  // 2. Fetch the specific package data based on the URL ID
  useEffect(() => {
    const fetchPackageData = async () => {
      if (!id) return; // Skip if there is no ID in the URL
      try {
        // Hitting the getPackageById controller you made!
        const res = await axios.get(`http://localhost:5000/api/packages/${id}`);
        if (res.data.success) {
          setEventPackage(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch package data:", error);
      }
    };

    fetchPackageData();
  }, [id]);

  return (
    // About Event Section
    <div className="container-fluid about-event">
      <div className="container">
      <div className="row">
        <div className="col-lg-8 mt-3 mt-lg-5">
          {/* We can make this title dynamic later too! */}
          <h3 style={{textTransform: 'capitalize'}}>
            {eventPackage ? eventPackage.packageName : "About the Event"}
          </h3>
          
          <p className="text-start">
            {eventPackage?.description ? eventPackage.description : (
              <>
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
              </>
            )}
          </p>

          <hr className="mt-4" />

          <div className=" mt-2 mt-lg-4">
            <h4 id="gallery-text">Gallery</h4>

            <div className="row g-3 mt-3 ">
              <div className="col-lg-4 col-md-4" data-aos="zoom-in">
                <img src={decoration_table} alt="" className="img-fluid img-gallery" />
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
                <img src={catering_foood} alt="" className="img-fluid img-gallery" />
              </div>
              <div className="col-lg-4 col-md-4" data-aos="zoom-in"  data-aos-duration="1500">
                <img src={dj_party} alt="" className="img-fluid img-gallery" />
              </div>
              <div className="col-lg-4 col-md-4" data-aos="zoom-in"  data-aos-duration="1500">
                <img src={hall_decor} alt="" className="img-fluid img-gallery" />
              </div>
              <div className="col-lg-4 col-md-4" data-aos="zoom-in"  data-aos-duration="1500">
                <img src={couple_wedding} alt="" className="img-fluid img-gallery" />
              </div>
              <div className="col-lg-4 col-md-4" data-aos="zoom-in">
                <img src={cater_seets} alt="" className="img-fluid img-gallery" />
              </div>
              <div className="col-lg-4 col-md-4" data-aos="zoom-in">
                <img src={funeral_flower2} alt="" className="img-fluid img-gallery" />
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="row">
            
            {/* LEFT SIDE on md: Price + Gallery */}
            <div className="col-12 col-md-6 col-lg-12">
              
              {/* --- DYNAMIC PACKAGE PRICE CARD --- */}
              {/* --- EVENT BOOKING CARD --- */}
              <div className="side-card">
                
                {/* Replaced Price with a welcoming Heading */}
                <h2>
                  Tailored Event Packages
                  <span style={{fontSize: '1rem', color: '#8a9ba8', display: 'block', marginTop: '5px'}}>
                    Customizable options for your special day
                  </span>
                </h2>
                
                <hr />

                <div className="icon d-flex">
                  <i className="bi bi-calendar-check mx-3"></i>
                  <p>Flexible Dates Available</p>
                </div>
                <div className="icon d-flex">
                  <i className="bi bi-geo-alt mx-3"></i>
                  <p>Venue Sourcing Assistance</p>
                </div>
                <div className="icon d-flex">
                  <i className="bi bi-star mx-3"></i>
                  <p>Premium Service Guarantee</p>
                </div>

                <Link className="btn" to={"/bookNow"} >
                  Explore & Book
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
                  <Link to={"/bookNow"} className="btn ms-0">
                    Continue
                  </Link>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE on md: Included Services + Organizer */}
            <div className="col-12 col-md-6 col-lg-12">
              
              {/* --- DYNAMIC INCLUDED SERVICES CARD --- */}
              <div className="side-card">
                <h4 className="mb-lg-4 mb-2">Included Services</h4>

                {eventPackage?.services?.length > 0 ? (
                  /* --- REAL DATA FROM DATABASE (Runs when URL has an ID) --- */
                  eventPackage.services.map((item, index) => (
                    <div className="icon d-flex align-items-center mb-3" key={index}>
                      <i className="bi bi-check2-circle mx-3"></i>
                      <div>
                        <p className="mb-0 fw-bold" style={{textTransform: 'capitalize'}}>
                          {item.service.serviceName}
                        </p>
                        {item.isOptional && (
                          <small style={{color: '#8a9ba8', display: 'block', lineHeight: '1'}}>
                            *Optional Add-on
                          </small>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  /* --- DUMMY FALLBACK DATA (Runs when just viewing the UI normally) --- */
                  <>
                    <div className="icon d-flex align-items-center mb-lg-2 mb-1">
                      <i className="bi bi-check2-circle mx-3"></i>
                      <div>
                        <p className="mb-0 fw-bold">Premium Catering</p>
                      </div>
                    </div>
                    
                    <div className="icon d-flex align-items-center mb-lg-2 mb-1">
                      <i className="bi bi-check2-circle mx-3"></i>
                      <div>
                        <p className="mb-0 fw-bold">Venue Decoration</p>
                      </div>
                    </div>
                    
                    <div className="icon d-flex align-items-center mb-lg-2 mb-1">
                      <i className="bi bi-check2-circle mx-3"></i>
                      <div>
                        <p className="mb-0 fw-bold">Professional Photography</p>
                      </div>
                    </div>
                    <div className="icon d-flex align-items-center mb-lg-2 mb-1">
                      <i className="bi bi-check2-circle mx-3"></i>
                      <div>
                        <p className="mb-0 fw-bold">Professional Videography</p>
                        <small style={{color: '#8a9ba8', display: 'block', lineHeight: '1'}}>
                          *Optional Add-on
                        </small>
                      </div>
                    </div>
                  </>
                )}

                <hr />

                <h4 className="mb-4 text-center text-lg-start">Event Organizer</h4>

                {/* MODIFIED RESPONSIVE ROW: Fixed overlap on medium devices */}
                <div className="row g-2 align-items-center text-center text-lg-start">
                  
                  {/* Image Column */}
                  <div className="col-12 col-md-12 col-lg-4 mb-3 mb-lg-0 d-flex justify-content-center justify-content-lg-start">
                    <img 
                      src={organizer.profileImage ? `http://localhost:5000${organizer.profileImage}` : profileFallback} 
                      alt="Organizer Profile" 
                      className="img-fluid" 
                      style={{ 
                        borderRadius: "50%", 
                        objectFit: "cover", 
                        width: "120px",
                        height: "120px"
                      }} 
                    />
                  </div>
                  
                  {/* Text Details Column */}
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
                      <p className="justify-content-lg-start align-items-center mb-0">
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

export default AboutEvent;