import React from 'react'
import './HowItWorks.css'

function HowItWorks() {
  return (
    //How it works section 

    <section className="how-it-works pt-0">
  <div className="container p-0 p-md-4">
    <h2 className="work-title">How We Work</h2>
    <p className="work-subtitle">
  From first idea to final applause, Eventura transforms your vision into a beautifully
  curated event — effortless, elegant, and unforgettable.
</p>

<div className="steps-grid ">
  <div className="glass-step" data-aos="zoom-in-up"  data-aos-duration="1500">
    <span className="step-number">01</span>
    <h4>Discover Your Vision</h4>
    <p>
      We begin by understanding your story, style, and expectations to shape an event
      that truly reflects you.
    </p>
  </div>

  <div className="glass-step" data-aos="zoom-in-up"  data-aos-duration="1500">
    <span className="step-number">02</span>
    <h4>Curate & Design</h4>
    <p>
      From themes and decor to vendors and timelines, every detail is thoughtfully
      planned with elegance and precision.
    </p>
  </div>

  <div className="glass-step" data-aos="zoom-in-up"  data-aos-duration="1500">
    <span className="step-number">03</span>
    <h4>Seamless Execution</h4>
    <p>
      Our expert team manages everything behind the scenes, ensuring your event unfolds
      flawlessly and stress-free.
    </p>
  </div>

  <div className="glass-step" data-aos="zoom-in-up" data-aos-duration="1500" >
    <span className="step-number">04</span>
    <h4>Celebrate the Moment</h4>
    <p>
      Relax, enjoy, and make memories while we deliver a perfectly orchestrated
      experience from start to finish.
    </p>
  </div>
</div>

  </div>
</section>
  )
}

export default HowItWorks
