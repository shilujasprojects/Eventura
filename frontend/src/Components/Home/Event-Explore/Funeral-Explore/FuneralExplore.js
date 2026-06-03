import React, { useState } from "react";
import "./FuneralExplore.css";
import Navbar from "../../../Navbar/Navbar";
import Footer from "../../../Footer/Footer";

export default function FuneralExplore() {

const [message,setMessage] = useState("");


const handleSubmit = (e)=>{
e.preventDefault();
alert("Tribute message sent ❤️");
setMessage("");
}

return (
<>
<Navbar/>

<div className="funeral-page">

{/* HERO */}

<section className="funeral-hero">

<h1>Honoring Life & Memories</h1>

<p>
We provide compassionate funeral arrangements and memorial services 
to celebrate the life of your loved ones with dignity and respect.
</p>

</section>


{/* SERVICES */}

<section className="funeral-services">

<h2>Funeral Services</h2>

<div className="funeral-services-grid">

<div className="funeral-service-card">
<h3>Memorial Ceremony</h3>
<p>
A peaceful gathering where family and friends come together
to celebrate a life well lived.
</p>
</div>

<div className="funeral-service-card">
<h3>Burial Arrangements</h3>
<p>
Complete funeral and burial arrangements handled with
professional care and compassion.
</p>
</div>

<div className="funeral-service-card">
<h3>Floral Tributes</h3>
<p>
Elegant floral arrangements to express sympathy
and heartfelt condolences.
</p>
</div>

<div className="funeral-service-card">
<h3>Memory Video Tribute</h3>
<p>
A beautiful video slideshow to remember the
life journey of your loved one.
</p>
</div>

</div>

</section>


{/* MEMORIAL GALLERY */}

<section className="memorial-moment">

<div className="memorial-content mt-4">

{/* LEFT TEXT */}

<div className="memorial-text">

<div className="client-info">

<img
src="https://randomuser.me/api/portraits/women/65.jpg"
alt="client"
/>

<h4>Sarah Johnson</h4>

</div>

<p className="gratitude-text">
"Our family is deeply grateful for the care and compassion shown 
throughout the memorial service. Every detail was handled with 
respect and grace, allowing us to honor our loved one in the most 
beautiful way possible."
</p>

</div>


{/* RIGHT IMAGE */}

<div className="memorial-image">

<img
src="https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=1200&q=80"
alt="memorial service"
/>

</div>

</div>

</section>


{/* TRIBUTE MESSAGE */}

<section className="tribute-section">

<div className="tribute-container">

<h2>Leave a Tribute</h2>

<p className="tribute-subtitle">
Share a message of remembrance, love, or comfort for the family.
</p>

<form className="tribute-form" onSubmit={handleSubmit}>

<textarea
placeholder="Write your message of remembrance..."
value={message}
onChange={(e)=>setMessage(e.target.value)}
required
/>

<button type="submit">
Send Tribute
</button>

</form>

</div>

</section>

</div>

<Footer/>
</>
);
}