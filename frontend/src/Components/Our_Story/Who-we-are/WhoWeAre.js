import React from 'react'
import about2 from '../Story_images/about-part-2.png'
import './WhoWeAre.css'

function WhoWeAre() {
  return (
    
//    Who we are section

  <div className='content2 container-fluid px-0 py-5 p-md-5 m-0'>
    <section className="container ">
    <div className="row align-items-center">
        <div className="col-md-8 " data-aos="fade-up-left" data-aos-duration="1500">
            <h2 className="about-title">Who we are</h2>
    <p className="about-subtitle">
          Eventura is an all-in-one event booking platform designed to connect people with trusted vendors, creative planners, and seamless services. We believe every event—big or small—deserves perfect execution, and our goal is to make event planning simple, transparent, and stress-free from start to finish.
        </p>
        </div>
        <div className="col-md-4 mt-lg-3 mt-md-5 " data-aos="flip-right" data-aos-duration="2500">
            <img src={ about2 } alt="about 2" className="img-fluid" />
        </div>
    </div>
    </section>
  </div>

  )
}

export default WhoWeAre
