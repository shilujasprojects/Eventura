import React from 'react'
import { Link } from 'react-router-dom'
import './ServiceBanner.css'

function ServiceBanner() {
  return (
    <section className="about-service w-100">
      <div className="content-service text-start">
          <h2 >Everything You Need <span>for a </span>Perfect Event</h2>
          <p className="pt-3">From Planning to exceution, Eventura brings together trusted services to make every celebration seamless.</p>
          <Link to="/services" className="btn mt-3 mb-4">Explore Services</Link>
      </div>
    </section>
  )
}

export default ServiceBanner
