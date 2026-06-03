import React, { useState } from "react";
import "./BookNow.css";
import birthdayCeleb from "./Book_Now_Images/birthday-celeb.jpg";
import anniversaryCouple2 from "./Book_Now_Images/anniversary-couple2.jpg";
import babyShowerShoe from "./Book_Now_Images/baby-shower-shoe.jpg";
import CorporateEvent from "./Book_Now_Images/corporate-event.jpg";
import CoupleMarraige from "./Book_Now_Images/couple-marraige.jpg";
import funeralFlower from "./Book_Now_Images/funeral_flower_2.jpg";
import houseWarming from "./Book_Now_Images/house-warming.jpg";
import ringExchange from "./Book_Now_Images/ring-exchange.jpg";
import { useNavigate } from "react-router-dom";

function BookNow() {

  const [selectedServices, setSelectedServices] = useState([]);   // Serivce selection - selectedServices = array; It stores multiple selected services. 

  const [selectedEvent, setSelectedEvent] = useState('Wedding');    // Event card selection

  const navigate = useNavigate();

  const services = [
    "Catering",
    "Decoration & Styling",
    "Photo & Video",
    "Makeup & Styling",
    "Music & Entertainment",
    "Rentals Outfits",
    "Furniture & Equipment",
    "Travel & Guest Management",
    "Accessories & Event Props",
    "Custom Cakes & Bakery",
    "Kids Entertainment",
    "Planning & Coordination ",
  ];

  const events = [
    { name : 'Wedding', image : CoupleMarraige},
    { name : 'Birthday', image : birthdayCeleb },
    { name : 'Engagement' , image : ringExchange },
    { name: 'Baby Shower', image : babyShowerShoe },
    { name : 'Anniversary', image : anniversaryCouple2 },
    { name : 'Corporate', image : CorporateEvent },
    { name : 'Housewarming', image : houseWarming },
    { name : 'Funeral Services' , image : funeralFlower},
  ]

  const toggleService = (service) => {              //service = the item user clicked.
    if (selectedServices.includes(service)) {           // .includes() checks: “Is this service already inside the array?”
      setSelectedServices(selectedServices.filter((s) => s !== service));   // .filter() creates a new array removing that service.
    } else {
      setSelectedServices([...selectedServices, service]);  // ...selectedServices = spread operator; It copies old array and adds new service.
    }
  };

  const handleReview = () => {
  const bookingData = {
    eventType: selectedEvent, 
    date: document.getElementById("eventDate")?.value,
    startTime: document.getElementById("startTime")?.value,
    endTime: document.getElementById("endTime")?.value,
    city: document.getElementById("city")?.value,
    guestCount: document.getElementById("guestCount")?.value,
    services: selectedServices,
    fullName: document.getElementById("fullName")?.value,
    phone: document.getElementById("phone")?.value,
    email: document.getElementById("email")?.value,
  };

  localStorage.setItem("eventBooking", JSON.stringify(bookingData));

  navigate("/booksummary");
};
  return (
    <>
      <div className="container-fluid book-now-section">
        <div className="container main-section py-4 py-md-5">
          {/* EVENT TYPE */}
          <div className="mb-4">
            <h4 className="mb-3">Select Event Type</h4>

            {/* <div className="row g-3">
              <div className="col-6 col-sm-4 col-md-3 col-lg-2">
                <div className={`event-card ${selectedEvent === "Wedding" ? 'active' : "" }`} // className="event-card active"- if condition is true
                      onClick={() => {setSelectedEvent("Wedding")}}                            // className="event-card " - if condition is false
                >
                  
                  <img src={CoupleMarraige} alt="Wedding" />
                  <p>Wedding</p>
                </div>
              </div>

              <div className="col-6 col-sm-4 col-md-3 col-lg-2">
                <div className={`event-card ${selectedEvent === "Birthday" ? "active" : "" }`}
                     onClick = {() => {setSelectedEvent ("Birthday")}}
                >
                  <img src={birthdayCeleb} alt="Birthday" />
                  <p>Birthday</p>
                </div>
              </div>

              <div className="col-6 col-sm-4 col-md-3 col-lg-2">
                <div className={`event-card ${ selectedEvent === "Engagement" ? "active" : "" }`}
                     onClick = {() => {setSelectedEvent("Engagement")}}
                >
                  <img src={ringExchange} alt="Engagement" />
                  <p>Engagement</p>
                </div>
              </div>

              <div className="col-6 col-sm-4 col-md-3 col-lg-2">
                <div className={`event-card ${selectedEvent === "Baby Shower" ? "active" : "" }`}
                    onClick ={() => {setSelectedEvent("Baby Shower")}}
                >
                  <img src={babyShowerShoe} alt="Baby Shower" />
                  <p>Baby Shower</p>
                </div>
              </div>

              <div className="col-6 col-sm-4 col-md-3 col-lg-2">
                <div className={`event-card ${selectedEvent === 'Anniversary' ? "active" : "" }`}
                     onClick={() => {setSelectedEvent("Anniversary")}}
                >
                  <img src={anniversaryCouple2} alt="Anniversary" />
                  <p>Anniversary</p>
                </div>
              </div>

              <div className="col-6 col-sm-4 col-md-3 col-lg-2">
                <div className={`event-card ${selectedEvent === 'Corporate' ? "active" : "" }`}
                     onClick ={() => {setSelectedEvent("Corporate")}}
                >
                  <img src={CorporateEvent} alt="Corporate" />
                  <p>Corporate</p>
                </div>
              </div>

              <div className="col-6 col-sm-4 col-md-3 col-lg-2">
                <div className={`event-card ${selectedEvent === "Housewarming" ? "active" : "" }`}
                     onClick ={() => {setSelectedEvent("Housewarming")}}
                >
                  <img src={houseWarming} alt="Housewarming" />
                  <p>Housewarming</p>
                </div>
              </div>

              <div className="col-6 col-sm-4 col-md-3 col-lg-2">
                <div className={`event-card ${selectedEvent === 'Funeral Services' ? "active" : "" }`}
                     onClick ={() => {setSelectedEvent("Funeral Services")}}
                >
                  <img src={funeralFlower} alt="Funeral Services" />
                  <p>Funeral Services</p>
                </div>
              </div>
            </div> */}

            <div className='row g-3'>
              {
                events.map((event) =>(
                  <div key={event.name} className="col-6 col-sm-4 col-md-3 event-main">
                    <div className={`event-card ${selectedEvent === event.name ? "active" : ""}`}
                         onClick ={() =>{ setSelectedEvent(event.name)}}
                    >
                      <img src={event.image} alt={event.name} />
                      <p>{event.name}</p>

                    </div>
                  </div>
                ))
              }
            </div>
          </div>

          

          {/* EVENT DETAILS */}
          <div className="mb-4">
            <h4 className="mb-3">Event Details</h4>
            <div className="row g-3">
              <div className="col-md-6">
                <label>Date</label>
                <input
                  type="date"
                  className="form-control"
                  id="eventDate"
                  required
                />
              </div>
              <div className="col-md-3">
                <label>Start Time</label>
                <input
                  type="time"
                  className="form-control"
                  id="startTime"
                  required
                />
              </div>
              <div className="col-md-3">
                <label>End Time</label>
                <input
                  type="time"
                  className="form-control"
                  id="endTime"
                  required
                />
              </div>
              <div className="col-md-6">
                <label>City</label>
                <input
                  type="text"
                  className="form-control"
                  id="city"
                  required
                />
              </div>
              <div className="col-md-6">
                <label>Venue Name (optional)</label>
                <input type="text" className="form-control" />
              </div>
              <div className="col-md-6">
                <label>Guest Count</label>
                <input
                  type="number"
                  className="form-control"
                  id="guestCount"
                  placeholder="Enter number of guests"
                  min="100"
                  required
                />
                <small className="text-muted">Approximate guest count</small>
              </div>
              <div className="col-md-6">
                <label>Event Type</label>
                <select className="form-select">
                  <option>Indoor</option>
                  <option>Outdoor</option>
                </select>
              </div>
            </div>
          </div>

          {/* SERVICES */}
          <div className="mb-4">
            <h4 className="mb-3">Select Services</h4>
           
            <div className="row">
              {/* LEFT SIDE - SERVICES */}
              <div className="col-lg-9">
                {/* <h2 className="mb-4">Select Services</h2> */}

                <div className="row g-3">
                  {services.map((service, index) => (
                    <div className="col-md-4" key={index}>
                      <div
                        className={`service-card ${
                          selectedServices.includes(service) ? "active" : ""
                        }`}
                        onClick={() => toggleService(service)}
                      >
                        <h5>{service}</h5>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT SIDE - SUMMARY */}
              <div className="col-lg-3  mt-4 mt-lg-0">
                <div className="summary-box p-4">
                  <h4>Selected Services</h4>
                  {selectedServices.length === 0 ? (
                    <p>No services selected</p>
                  ) : (
                    <ul>
                      {selectedServices.map((service, index) => (
                        <li key={index}>{service}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>


          <div className="mb-4">
            <h4 className="mb-3">Budget & Preferences</h4>

            <div className="row">
              <div className="col-md-4 mb-2">
                <select className="form-select">
                  <option>₹50,000 – ₹1,00,000</option>
                  <option>₹1,00,000 – ₹3,00,000</option>
                  <option>₹3,00,000+</option>
                </select>
              </div>

              <div className="col-md-8 mb-2">
                <textarea
                  className="form-control"
                  rows="2"
                  placeholder="Special requirements..."
                ></textarea>
              </div>
            </div>
          </div>

          {/* CONTACT */}
          <div className="mb-3">
            <h4 className="mb-3">Contact Details</h4>

            <div className="row">
              <div className="col-md-4 mb-2">
                <input
                  type="text"
                  id='fullName'
                  className="form-control"
                  placeholder="Full Name"
                  required
                />
              </div>

              <div className="col-md-4 mb-2">
                <input
                  type="tel"
                  className="form-control"
                  id='phone'
                  placeholder="Phone Number"
                  required
                />
              </div>

              <div className="col-md-4 mb-2">
                <input
                  type="email"
                  className="form-control"
                  id='email'
                  placeholder="Email"
                  required
                />
              </div>

              <div className="col-md-6 d-flex align-items-center">
                <div className="form-check mt-2">
                  <input
                    className="input-check"
                    type="checkbox"
                    id="whatsappConfirm"
                  />
                  <label className="form-check-label" htmlFor="whatsappConfirm">
                    Send updates via WhatsApp
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="text-end mt-4">
            <button
              id="nextBtn"
              type="button"
              className="btn btn-gold px-4 py-2"
              onClick={handleReview}
            >
              Review Booking
            </button>
          </div>
        </div>
      </div>

      {/* Whatsapp floating icon */}
      <a
        href="https://wa.me/919847397414"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
      >
        <i className="bi bi-whatsapp"></i>
      </a>
    </>
  );
}

export default BookNow;
