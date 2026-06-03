import React, { useEffect, useState } from "react";
import "./BirthdayExplore.css";
import Footer from "../../../Footer/Footer";
import Navbar from "../../../Navbar/Navbar";

export default function BirthdayExplore() {
  useEffect(() => {
    const targetDate = new Date("2026-05-20T00:00:00").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const gap = targetDate - now;

      const days = Math.floor(gap / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (gap % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((gap % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((gap % (1000 * 60)) / 1000);

      document.getElementById("days").innerText = days > 0 ? days : 0;
      document.getElementById("hours").innerText = hours > 0 ? hours : 0;
      document.getElementById("minutes").innerText = minutes > 0 ? minutes : 0;
      document.getElementById("seconds").innerText = seconds > 0 ? seconds : 0;
    }, 1000);

    return () => clearInterval(interval);
  }, []);


//   Birthday Gallery Section

const [lightbox,setLightbox] = useState(false);
const [selectedImg,setSelectedImg] = useState("");

const openLightbox = (img)=>{
setSelectedImg(img);
setLightbox(true);
};

const closeLightbox = ()=>{
setLightbox(false);
};

const galleryImages = [
"https://images.unsplash.com/photo-1464349095431-e9a21285b5f3",
"https://images.unsplash.com/photo-1530103862676-de8c9debad1d",
"https://images.unsplash.com/photo-1513151233558-d860c5398176",
"https://images.unsplash.com/photo-1464349153735-7db50ed83c84",
"https://images.unsplash.com/photo-1504196606672-aef5c9cefc92",


"https://images.unsplash.com/photo-1486427944299-d1955d23e34d",

"https://images.unsplash.com/photo-1521305916504-4a1121188589",
"https://images.unsplash.com/photo-1558636508-e0db3814bd1d",
"https://images.unsplash.com/photo-1602631985686-1bb0e6a8696e"
];

const vlogVideos = [
"https://www.youtube.com/embed/3yIVNQp7F7Y",
"https://www.youtube.com/embed/2Vv-BfVoq4g",
"https://www.youtube.com/embed/kXYiU_JCYtU"
];

  return (
    <>
      <Navbar />
      <div className="birthday-page mt-5">
        {/* BALLOONS */}

        <div className="balloons">
          <div className="balloon"></div>
          <div className="balloon"></div>
          <div className="balloon"></div>
          <div className="balloon"></div>
          {/* <div className="balloon"></div> */}
        </div>

        {/* HERO */}

        <section className="birthday-hero">
          <div className="birthday-hero-text">
            <h1>Make Every Birthday Magical</h1>

            <p>
              From kids parties to milestone celebrations, we design
              unforgettable birthday experiences.
            </p>

            <button>Explore Themes</button>
          </div>

          <div className="birthday-hero-img">
            <img
              src="https://images.unsplash.com/photo-1464349153735-7db50ed83c84"
              alt="birthday"
            />
          </div>
        </section>

        {/* COUNTDOWN */}

        <section className="countdown">
          <h2>🎉🎉 Next Big Celebration Starts In 🎉🎉</h2>

          <div className="timer">
            <div>
              <span id="days">00</span>
              <p>Days</p>
            </div>

            <div>
              <span id="hours">00</span>
              <p>Hours</p>
            </div>

            <div>
              <span id="minutes">00</span>
              <p>Minutes</p>
            </div>

            <div>
              <span id="seconds">00</span>
              <p>Seconds</p>
            </div>
          </div>
        </section>

        {/* FEATURES */}

        <section className="features">
          <h2>Birthday Experiences</h2>

          <div className="birthday-cards">
            <div className="birthday-card">
              <img
                src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d"
                alt="kids"
              />
              <div className="p-3"> 
                <h3>Kids Birthday</h3>
              <p>Cartoon themes, balloons and magical decorations.</p>
              </div>
            </div>

            <div className="birthday-card">
              <img
                src="https://images.unsplash.com/photo-1486427944299-d1955d23e34d"
                alt="surprise"
              />
              <div className="p-3">
                <h3>Surprise Party</h3>
              <p>Hidden surprises and unforgettable moments.</p>
              </div>
            </div>

            <div className="birthday-card">
              <img
                src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622"
                alt="luxury"
              />
              <div className="p-3">
                <h3>Luxury Birthday</h3>
              <p>Premium birthday parties with stunning themes.</p>
              </div>
            </div>
            <div className="birthday-card">
              <img
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836"
                alt="surprise"
              />
              <div className="p-3">
                <h3>Surprise Party</h3>
              <p>Hidden surprises and unforgettable moments.</p>
              </div>
            </div>
          </div>
        </section>

        {/* birthday-gallery */}

<section className="birthday-moments">
  <h2>Birthday Moments</h2>

<div className="moments-layout">

{/* LEFT IMAGES */}
<div className="birthday-gallery-grid">
{galleryImages.map((img)=>(
<img
key={img}
src={img}
alt="birthday"
loading="lazy"
onClick={()=>openLightbox(img)}
/>
))}
</div>


{/* CENTER CAPTION */}
<div className="moments-caption">

<p className="caption-text">
“Last night was unforgettable! The decorations, music, and surprise cake 
made my birthday feel magical. Every moment was filled with laughter 
and happiness.”
</p>

<p className="caption-author">— Emma & Friends 🎉</p>

</div>


{/* RIGHT VIDEOS */}
<div className="moments-videos">
{vlogVideos.map((video,index)=>(
<div className="video-card" key={index}>
<iframe
src={video}
title="birthday vlog"
allowFullScreen
></iframe>
</div>
))}
</div>

</div>

</section>

{/* LIGHTBOX */}

{lightbox && (

<div className="lightbox" onClick={closeLightbox}>

<span className="close">&times;</span>

<img src={selectedImg} alt="preview"/>

</div>

)}


        {/* PACKAGES */}

        <section className="birthday-packages">
          <h2 className="mb-5">Birthday Packages</h2>

          <div className="package-grid">
            <div className="package-card">
              <h3>🎈 Basic Party</h3>

              <ul>
                <li>Decoration</li>
                <li>Cake</li>
                <li>Photography</li>
              </ul>

              <button>Select</button>
            </div>

            <div className="package-card">
              <h3>🎉 Grand Party</h3>

              <ul>
                <li>Decoration</li>
                <li>DJ Music</li>
                <li>Cake</li>
                <li>Photography</li>
              </ul>

              <button>Select</button>
            </div>

            <div className="package-card">
              <h3>👑 Royal Birthday</h3>

              <ul>
                <li>Luxury Decoration</li>
                <li>Live Music</li>
                <li>Premium Cake</li>
                <li>Photography</li>
              </ul>

              <button>Select</button>
            </div>

            <div className="package-card">
              <h3>👑 Custom Birthday</h3>

              <ul>
                <li>Luxury Decoration</li>
                <li>Live Music</li>
                <li>Premium Cake</li>
                <li>Photography</li>
              </ul>

              <button>Select</button>
            </div>
          </div>
        </section>

        {/* CAKE SECTION */}

        <section className="cake">
          <div className="cake-img">
            <img
              src="https://images.unsplash.com/photo-1578985545062-69928b1d9587"
              alt="cake"
            />
          </div>

          <div className="cake-text">
            <h2>Blow The Candle</h2>

            <p>
              Every birthday deserves a magical cake moment. Celebrate with
              creative cakes and decorations.
            </p>

            <button>Book Birthday</button>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
