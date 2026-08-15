import React, { useEffect, useRef, useState } from "react";
import "./WeddingExplore.css";
import Footer from "../../../Footer/Footer";
import Navbar from "../../../Navbar/Navbar";
import useCategoryGallery from '../../../../hooks/useCategoryGallery'

export default function WeddingExplore() {

const galleryRef = useRef(null);
const autoSlideRef = useRef(null);

const [lightbox, setLightbox] = useState(false);
const [selectedImg, setSelectedImg] = useState("");

 const { images: weddingImages, loading: galleryLoading } =
    useCategoryGallery("Wedding", 6);

/* Scroll buttons */

const scrollGallery = (value) => {
galleryRef.current.scrollLeft += value;
};

/* Auto slide */
const startAutoSlide = () => {

autoSlideRef.current = setInterval(() => {

if (!galleryRef.current) return;

galleryRef.current.scrollLeft += 300;

if (
galleryRef.current.scrollLeft + galleryRef.current.clientWidth >=
galleryRef.current.scrollWidth
) {
galleryRef.current.scrollLeft = 0;
}

},2000);

};

useEffect(()=>{

startAutoSlide();

return ()=> clearInterval(autoSlideRef.current);

},[]);


/* Lightbox */

const openLightbox = (src) => {
setSelectedImg(src);
setLightbox(true);
};

const closeLightbox = () => {
setLightbox(false);
};

return (
<>
<Navbar />
    <div className='wedding-page'>
        
{/* hero-wedding */}

<section className="hero-wedding">

<div className="hero-wedding-content">

<h1>Luxury Wedding Experience</h1>

<p>
Create unforgettable wedding memories with premium decoration,
photography, catering and entertainment.
</p>

<button>Book Your Wedding</button>

</div>

</section>


{/* STORY */}

<section className="story">

<h2>Crafting Beautiful Memories</h2>

<p>
We design premium experiences for weddings, engagements,
birthdays, corporate events and celebrations.
Our team creates elegant decoration, luxury catering
and unforgettable event moments.
</p>

</section>


{/* wedding-gallery */}

<section className="wedding-gallery">

<h2>Wedding Moments</h2>

<div className="wedding-gallery-wrapper">

<button className="scroll-btn left" onClick={() => scrollGallery(-300)}>❮</button>

<div
  className="wedding-gallery-row"
  ref={galleryRef}
  onMouseEnter={() => clearInterval(autoSlideRef.current)}
  onMouseLeave={startAutoSlide}
>
  {galleryLoading ? (
    Array.from({ length: 6 }).map((_, i) => (
      <div className="wedding-gallery-skeleton" key={i} />
    ))
  ) : weddingImages.length === 0 ? (
    <p>No gallery images available yet.</p>
  ) : (
    weddingImages.map((img) => (
      <img
        key={img}
        src={img}
        alt="wedding"
        loading="lazy"
        onClick={() => openLightbox(img)}
      />
    ))
  )}
</div>

<button className="scroll-btn right" onClick={() => scrollGallery(300)}>❯</button>

</div>

</section>


{/* LIGHTBOX */}

{lightbox && (

<div className="lightbox" onClick={closeLightbox}>

<span className="close" onClick={closeLightbox}>&times;</span>

<img
src={selectedImg}
alt="preview"
onClick={(e)=>e.stopPropagation()}
/>

</div>

)}


{/* VLOGS */}

<section className="vlogs">

<h2>Wedding Event Vlogs</h2>

<div className="video-grid">

<iframe src="https://www.youtube.com/embed/2Vv-BfVoq4g" title="vlog1" allowFullScreen />

<iframe src="https://www.youtube.com/embed/kXYiU_JCYtU" title="vlog2" allowFullScreen />

<iframe src="https://www.youtube.com/embed/tgbNymZ7vqY" title="vlog3" allowFullScreen />

</div>

</section>


{/* PACKAGES */}

<section className="packages">

<h2>Wedding Packages</h2>

<div className="package-container">

{[
{
title:"Silver",
items:["Venue Decoration","Catering Service","Photography","Basic Lighting"]
},
{
title:"Gold",
items:["Premium Decoration","Catering Service","Photography & Videography","DJ & Lighting"]
},
{
title:"Platinum",
items:["Luxury Decoration","5 Star Catering","Photography + Cinematic Video","Live Music Band"]
},
{
title:"Custom",
items:["Luxury Decoration","5 Star Catering","Photography + Cinematic Video","Live Music Band"]
}
].map((pkg,index)=>(
<div className="card-wedding" key={index}>

<h3>{pkg.title}</h3>

<ul>
{pkg.items.map((item,i)=>(
<li key={i}>{item}</li>
))}
</ul>

<button>Select Plan</button>

</div>
))}

</div>

</section>


{/* CTA */}

<section className="cta">

<h2>Let’s Make Your Dream Wedding Come True</h2>

<button>Start Planning</button>

</section>
    </div>

    <Footer />

</>

);

}