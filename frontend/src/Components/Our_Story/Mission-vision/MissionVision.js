import React from 'react'
import './MissionVision.css'

function MissionVision() {
  return (
    <div className="container-fluid mission-section">
        <div className="container">
      <h2 className="text-center about-title">Our Mission & our Vision</h2>

      <div className="row mt-5 mission-row g-3">
        <div className="col-md-6 ">
          <div className="card mission-card p-4 ">
            <div className="d-flex align-items-center justify-content-center mb-3">
              <i className="bi bi-bullseye"></i>
              <h4 className="card-title ms-3 mb-0">Our Mission</h4>
            </div>

            <p className="card-text text-center">
              To make event planning stress-free by providing reliable services,
              transparent pricing, and effortless booking experiences.
            </p>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card mission-card p-4">
            <div className="d-flex align-items-center justify-content-center mb-3">
              <i className="bi bi-stars"></i>
              <h4 className="card-title ms-3 mb-0">Our Vision</h4>
            </div>

            <p className="card-text text-center">
              To become the most trusted event booking platform that brings joy,
              creativity, and confidence to every celebration.
            </p>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default MissionVision
