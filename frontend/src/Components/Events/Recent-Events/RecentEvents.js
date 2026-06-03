import React from "react";
import { Link } from "react-router-dom";
import './RecentEvents.css';
import summer from "../Event-Images/summer-party.jpg";
import company from "../Event-Images/comapny-gala.jpg";
import baby from "../Event-Images/baby-girl-boy.jpg";
import anniversary from "../Event-Images/anniversary-cheers.jpg";

function RecentEvents() {
  return (
    <div className="container-fluid recent-event">
      <section className="container">
      <div className="row g-3 mb-3">
        <div className="d-flex  justify-content-between align-items-center mt-0 ">
          <h2 className="mt-5 mb-4">Our Events</h2>
          <Link type="button" className="btn mt-4" to="#" id="view-more">
            View More
          </Link>
        </div>
        <div className="col-lg-3 col-md-6">
          <div className="card">
            <img src={summer} alt="" className="img-card-top" />
            <div className="card-body">
              <h5 className="card-title mt-2">Summer Party</h5>
              <p className="card-text">
                A lively summer party filled with colorful decor, refreshing
                themes, and joyful moments designed for a fun and relaxed
                experience.
              </p>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6">
          <div className="card">
            <img src={anniversary} alt="" className="img-card-top" />
            <div className="card-body">
              <h5 className="card-title mt-2">Elegant Anniversary</h5>
              <p className="card-text pb-0 pb-lg-4">
                A beautifully styled anniversary event celebrating love,
                milestones, and cherished memories with elegance and warmth.
              </p>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6">
          <div className="card">
            <img src={company} alt="" className="img-card-top" />
            <div className="card-body">
              <h5 className="card-title mt-2">Company Gala</h5>
              <p className="card-text">
                A premium corporate gala featuring sophisticated décor, seamless
                coordination, and an unforgettable professional atmosphere.
              </p>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6">
          <div className="card">
            <img src={baby} alt="" className="img-card-top" />
            <div className="card-body">
              <h5 className="card-title mt-2">Baby Shower</h5>
              <p className="card-text pb-0 pb-lg-4">
                A heartwarming baby shower planned with soft themes, graceful
                décor, and joyful celebrations to welcome new beginnings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
    </div>
  )
}

export default RecentEvents
