import React from "react";
import './ClientTestimonials.css'
import profile1 from "../Images/profile1.jpg";
import profile2 from "../Images/profile2.jpg";
import profile3 from "../Images/profile3.jpg";

function ClientTestimonials() {
  return (
   
    // Client testimonials

    <section className="client py-5">
      <div className="container text-center">
        <h2>what our clients say</h2>
        <p style={{ color: "white", marginBottom: "40px" }}>
          Real experiences from people who trusted Eventura for their special
          moments.
        </p>

        <div
          id="clientCarousel"
          className="carousel slide"
          data-bs-ride="carousel"
          data-bs-interval="4000"
        >
          {/* Indicators */}
          <div className="carousel-indicators mb-0">
            <button
              type="button"
              data-bs-target="#clientCarousel"
              data-bs-slide-to="0"
              className="active"
            ></button>
            <button
              type="button"
              data-bs-target="#clientCarousel"
              data-bs-slide-to="1"
            ></button>
            <button
              type="button"
              data-bs-target="#clientCarousel"
              data-bs-slide-to="2"
            ></button>
          </div>

          {/* Carousel Inner */}
          <div className="carousel-inner">
            {/* Slide 1 */}
            <div className="carousel-item active ">
              <div className="d-flex justify-content-center mt-0 mt-lg-5">
                <div className="col-lg-4 col-md-6">
                  <div className="card text-center p-3 client-card pb-4">
                    <div className="stars">
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                    </div>

                    <p className="card-para">
                      <b>“</b>Eventura made our wedding planning completely
                      stress-free. Every service was perfectly coordinated!
                      <b>”</b>
                    </p>

                    <img
                      src={ profile2 }
                      className="profile-image"
                      alt="profile 2"
                    />
                    <h4 className="card-title">Anjali & Rahul</h4>
                    <p className="card-text">Wedding Event</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Slide 2 */}
            <div className="carousel-item">
              <div className="d-flex justify-content-center mt-0 mt-lg-5">
                <div className="col-lg-4 col-md-6">
                  <div className="card text-center p-3 client-card  pb-4">
                    <div className="stars">
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                    </div>

                    <p className="card-para">
                      <b>“</b>From booking to execution, everything was smooth.
                      Highly recommended for any celebration.<b>”</b>
                    </p>

                    <img
                      src={ profile3 }
                      className="profile-image"
                      alt="profile 3"
                    />
                    <h4 className="card-title">Nithya Sumran</h4>
                    <p className="card-text">Birthday Party</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Slide 3 */}
            <div className="carousel-item">
              <div className="d-flex justify-content-center  mt-0 mt-lg-5">
                <div className="col-lg-4 col-md-6">
                  <div className="card text-center p-3 client-card  pb-4">
                    <div className="stars">
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                    </div>

                    <p className="card-para">
                      <b>“</b>Professional vendors, easy booking, and great
                      support. Eventura truly understands events.<b>”</b>
                    </p>

                    <img
                      src={ profile1 }
                      className="profile-image"
                      alt="profile 1"
                    />
                    <h4 className="card-title">Thomas George</h4>
                    <p className="card-text">Corporate Event</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#clientCarousel"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon"></span>
          </button>

          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#clientCarousel"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon"></span>
          </button>
        </div>
      </div>
    </section>
  
  )
}

export default ClientTestimonials
