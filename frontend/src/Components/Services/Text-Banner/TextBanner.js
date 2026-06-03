import React from 'react'
import { Link } from 'react-router-dom'
import './TextBanner.css'

function TextBanner() {
  return (
    
    // Text Banner

    <section
      className="container-fluid p-5 text-banner"
      style={{background: "#062036", opacity: "0.85"}}
    >
      <div className="divider" style={{color: "#d6aa5f"}}>
        <span style={{color: "#fff7ee"}}>Plan Your Event Effortlessly!</span>
      </div>

      <div className="text-center py-2">
        <p>Book trusted services for your next celebration.</p>
        <Link to="/bookNow" className="btn">Get Started</Link>
      </div>
    </section>
  )
}

export default TextBanner
