import React, { useState, useEffect } from "react";
import axios from "axios";
import './Faq.css'

const BASE_URL = "http://localhost:5000";

function Faq() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null); // tracks which FAQ is currently open

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/faqs`);
        setFaqs(res.data.data);
        if (res.data.data.length > 0) {
          setOpenId(res.data.data[0]._id); // first FAQ open by default
        }
      } catch (error) {
        console.error("Failed to load FAQs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  const handleToggle = (id) => {
    // clicking the currently open FAQ closes it; clicking a different one opens that one instead
    setOpenId(prev => (prev === id ? null : id));
  };

  return (
    <section className="faq-glass-section py-5">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="faq-title">Frequently Asked Questions</h2>
          <p className="faq-subtitle">
            Clear your doubts before planning your perfect event with Eventura
          </p>
        </div>

        {loading && <p className="text-center text-white">Loading FAQs...</p>}

        {!loading && faqs.length === 0 && (
          <p className="text-center text-white">No FAQs available right now.</p>
        )}

        {!loading && faqs.length > 0 && (
          <div className="accordion glass-accordion">
            {faqs.map((faq) => {
              const isOpen = openId === faq._id;
              return (
                <div className="accordion-item glass-card-faq" key={faq._id}>
                  <h2 className="accordion-header">
                    <button
                      type="button"
                      className={`accordion-button ${isOpen ? "" : "collapsed"}`}
                      onClick={() => handleToggle(faq._id)}
                    >
                      {faq.question}
                    </button>
                  </h2>
                  {isOpen && (
                    <div className="accordion-collapse collapse show">
                      <div className="accordion-body">{faq.answer}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default Faq;