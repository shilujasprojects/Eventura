import React from 'react'
import './WhyEventura.css'

function WhyEventura() {
  return (
    <div className="why-choose-event container-fluid px-0 py-5 p-md-5 mt-0">
        <section className=" container" >
      <div className="divider">
        <span>Why Choose Eventura?</span>
      </div>

      <div className="row mt-5">
        {/* Card 1 */}
        <div className="col-lg-3 col-md-6">
          <div className="card text-center card-icon1 p-3" data-aos="zoom-in-down" data-aos-duration="1500">
            <i className="bi bi-shield-check"></i>
            <h4 className="card-title">Trusted Vendors</h4>
            <div className="d-flex justify-content-center px-4">
              <p className="card-para">
                <span className="icon-card">🎯</span> 500+ Events Managed
              </p>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="col-lg-3 col-md-6">
          <div className="card text-center card-icon1 p-3" data-aos="zoom-in-down" data-aos-duration="1500">
            <i className="bi bi-calendar-plus"></i>
            <h4 className="card-title">Easy Booking</h4>
            <div className="d-flex justify-content-center px-4">
              <p className="card-para">
                <span className="icon-card">📅</span> 200+ Verified Vendors
              </p>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="col-lg-3 col-md-6">
          <div className="card text-center card-icon1 p-3" data-aos="zoom-in-down" data-aos-duration="1500">
            <i className="bi bi-people"></i>
            <h4 className="card-title">All Communities</h4>
            <div className="d-flex justify-content-center px-4">
              <p className="card-para">
                <span className="icon-card">👥</span> 550+ Happy Clients
              </p>
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="col-lg-3 col-md-6">
          <div className="card text-center card-icon1 p-3" data-aos="zoom-in-down" data-aos-duration="1500">
            <i className="bi bi-stars"></i>
            <h4 className="card-title">Premium Experience</h4>
            <div className="d-flex justify-content-center px-4">
              <p className="card-para">
                <span className="icon-card">🕘</span> 24/7 Support
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
    </div>

  )
}

export default WhyEventura
