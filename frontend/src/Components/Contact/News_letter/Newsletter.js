import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import './Newsletter.css'

const BASE_URL = 'http://localhost:5000';

function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      toast.error("Please enter your email address.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/newsletter/subscribe`, { email: trimmedEmail });
      toast.success(res.data.message || "You're subscribed to the Eventura Circle!");
      setEmail('');
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="lux-newsletter">
      <div className="lux-overlay"></div>

      <div className="lux-container">
        <h2>Join The Eventura Circle</h2>
        <p>
          Receive curated event inspirations, exclusive previews, and private
          offers crafted for unforgettable celebrations.
        </p>

        <form className="lux-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" disabled={submitting}>
            {submitting ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
      </div>
    </section>
  )
}

export default Newsletter