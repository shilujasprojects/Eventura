import React from 'react'
import Dinning_lady from '../Service-Images/eventura-about.jpg'
import './EventuraService.css'

function EventuraService() {
  return (
    <section className="why-eventura">
      <div className="container">
        <div className="why-grid">
          
          {/* LEFT CONTENT */}
          <div className="why-content" data-aos="fade-down-right" data-aos-duration="2000">
            <span className="section-tag">Why Eventura Services</span>

            <h2>
              We Create Unforgettable<br />
              Event Experiences
            </h2>

            <p className="why-desc">
              At Eventura, we blend creativity, planning, and flawless execution
              to deliver events that feel effortless, elegant, and memorable.
            </p>

            <div className="why-features">
              <div className="feature">
                <span className="icon">
                  <i className="bi bi-bullseye"></i>
                </span>
                <div>
                  <h5>Personalized Planning</h5>
                  <p>Every detail is customized to match your vision.</p>
                </div>
              </div>

              <div className="feature">
                <span className="icon">
                  <i className="bi bi-people"></i>
                </span>
                <div>
                  <h5>Trusted Vendors</h5>
                  <p>Reliable professionals curated for quality delivery.</p>
                </div>
              </div>

              <div className="feature">
                <span className="icon">
                  <i className="bi bi-clock-history"></i>
                </span>
                <div>
                  <h5>Timely Execution</h5>
                  <p>Seamless coordination with zero last-minute stress.</p>
                </div>
              </div>

              <div className="feature" >
                <span className="icon">
                  <i className="bi bi-layers"></i>
                </span>
                <div>
                  <h5>End-to-End Support</h5>
                  <p>From concept to completion, we manage everything.</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="why-image">
            <img
              src={ Dinning_lady }
              alt="Eventura Event Setup" 
              data-aos="fade-up"
     data-aos-duration="3000"
            />
            {/*  */}
          </div>
        </div>
      </div>
    </section>
  )
}

export default EventuraService
