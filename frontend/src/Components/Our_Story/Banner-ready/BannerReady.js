import React from 'react'
import './BannerReady.css'
import { useNavigate } from "react-router-dom";

function BannerReady() {

  const navigate = useNavigate();

  return (
    // Banner Ready Section

  <div className="about-section2">
    <div className="banner-ready">
      <h1>Ready to Plan Your Event? </h1>
      <p>
        Let Eventura turn your vison into reality.
      </p>
      <button type="button" onClick={() => navigate("/bookNow")} >Book an Event</button>
    </div>
  </div>
  )
}

export default BannerReady
