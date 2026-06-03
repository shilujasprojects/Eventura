import React from "react";
import './Faq.css'

function Faq() {
  return (
    //   FAQ Section

    <section className="faq-glass-section py-5">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="faq-title">Frequently Asked Questions</h2>
          <p className="faq-subtitle">
            Clear your doubts before planning your perfect event with Eventura
          </p>
        </div>

        <div className="accordion glass-accordion" id="glassFaq">
          {/* FAQ 1 */}
          <div className="accordion-item glass-card-faq">
            <h2 className="accordion-header">
              <button
                className="accordion-button"
                data-bs-toggle="collapse"
                data-bs-target="#gfaq1"
              >
                What types of events does Eventura manage?
              </button>
            </h2>
            <div id="gfaq1" className="accordion-collapse collapse show">
              <div className="accordion-body">
                Eventura manages weddings, birthdays, baby showers, corporate
                events, housewarming ceremonies, and funeral services with
                complete planning support.
              </div>
            </div>
          </div>

          {/* FAQ 2 */}
          <div className="accordion-item glass-card-faq">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                data-bs-toggle="collapse"
                data-bs-target="#gfaq2"
              >
                Can I customize my event services?
              </button>
            </h2>
            <div id="gfaq2" className="accordion-collapse collapse">
              <div className="accordion-body">
                Yes! All services are fully customizable including décor,
                catering, entertainment, and rituals based on your preferences.
              </div>
            </div>
          </div>

          {/* FAQ 3 */}
          <div className="accordion-item glass-card-faq">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                data-bs-toggle="collapse"
                data-bs-target="#gfaq3"
              >
                How early should I book my event?
              </button>
            </h2>
            <div id="gfaq3" className="accordion-collapse collapse">
              <div className="accordion-body">
                We recommend booking at least 2–4 weeks in advance. For
                weddings, booking 2–3 months earlier ensures better vendor
                availability.
              </div>
            </div>
          </div>

          {/* FAQ 4 */}
          <div className="accordion-item glass-card-faq">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                data-bs-toggle="collapse"
                data-bs-target="#gfaq4"
              >
                Does Eventura provide on-site support?
              </button>
            </h2>
            <div id="gfaq4" className="accordion-collapse collapse">
              <div className="accordion-body">
                Yes. Our professional team ensures smooth coordination and
                support throughout the event day.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Faq;
