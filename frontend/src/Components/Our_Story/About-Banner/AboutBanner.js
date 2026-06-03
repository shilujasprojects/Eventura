import React from 'react'
import './AboutBanner.css'

function AboutBanner() {
  return (
    <section className="about-section" >
      {/* style={{ backgroundImage: `url(${aboutImage})` }} */}
    <div className="content">
      <h1>About Eventura</h1>
      <p>
        Eventura is your trusted partner in creating unforgettable moments.
        From personal celebrations to professional events, we simplify
        planning with elegance and reliability.
      </p>
    </div>
  </section>
  )
}

export default AboutBanner
