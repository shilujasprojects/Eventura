import React from 'react'
import './Newsletter.css'

function Newsletter() {
  return (
    <section className="lux-newsletter">
      <div className="lux-overlay"></div>

      <div className="lux-container">
        <h2>Join The Eventura Circle</h2>
        <p>
          Receive curated event inspirations, exclusive previews, and private
          offers crafted for unforgettable celebrations.
        </p>

        <form className="lux-form">
          <input type="email" placeholder="Enter your email address" required />
          <button type="submit">Subscribe</button>
        </form>
      </div>
    </section>
  )
}

export default Newsletter

