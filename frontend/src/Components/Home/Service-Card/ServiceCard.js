import React from "react";
import { Link } from "react-router-dom";
import './ServiceCard.css'
import birthday from "../Images/birthday.jpg";
import marriage from "../Images/marriage.jpg";
import babyShower from "../Images/baby_Shower.jpg";
import engagement from "../Images/engagement.jpg";
import corporate from "../Images/corporate.jpg";
import funeral from "../Images/funeral-flower.jpg";
import anniversary from "../Images/anniversary.jpg";
import housewarming from "../Images/housewarming.jpg";

function ServiceCard() {

    const cardService = [
    {
      title: "Birthday",
      image: birthday,
      description:
        "Make every birthday unforgettable with joyful themes and surprises.",
      link: "/birthday-explore"
    },
    {
      title: "Wedding",
      image: marriage,
      description:
        "End-to-end wedding planning with elegance, care, and perfection.",
      link: "/wedding-explore"
    },
    {
      title: "Baby Shower",
      image: babyShower,
      description:
        "Celebrate new beginnings with warm, beautiful, and thoughtful setups.",
      link: "/babyshower-explore"
    },
    {
      title: "Engagement",
      image: engagement,
      description:
        "Elegant celebrations to mark the start of a beautiful journey together.",
      link: "/engagement-explore"
    },
    {
      title: "Corporate Events",
      image: corporate,
      description:
        "Professional event management tailored for impactful moments.",
      link: "/corporate-explore"
    },
    {
      title: "Funeral Services",
      image: funeral,
      description:
        "Respectful, dignified arrangements handled with compassion and care.",
       link: "/funeral-explore"
    },
    {
      title: "Anniversary",
      image: anniversary,
      description:
        "Recreate memories and celebrate love with perfectly planned moments.",
      link: "/anniversary-explore"
    },
    {
      title: "Housewarming",
      image: housewarming,
      description:
        "Welcome new beginnings with tasteful and joyful housewarming events.",
      link: "/housewarming-explore"
    }
  ];
  
  return (
    <div className='container-fluid service-part'>
      <section
      className="container"
      style={{ backgroundColor: "#062036" }}
    >
      <h2
        className="text-center"
        style={{
          fontSize:'55px',
          color: "white",
          textTransform: "capitalize",
          marginBottom: "45px",
          fontFamily: "Great Vibes,cursive",
          fontWeight: 580,
        }}
      >
        Our Events
      </h2>

      <div className="row g-4">
      {cardService.map((card,index) => (
        <div className="col-lg-3 col-md-6" key={index}>
          <div className="card card-service">
             <img src={card.image} alt={card.title} className="image-card-top" />
             <div className="body-card">
                <h5 className="title-card">{card.title}</h5>
                <p className="text-card">
                {card.description}
              </p>
              <Link to={card.link} className="btn btn-explore">
                Explore
              </Link>
             </div>
          </div>
          </div>
      )) }

      </div>
    </section>
    </div>
  )
}

export default ServiceCard
