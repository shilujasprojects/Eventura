import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./ViewMoreEvents.css";
import Navbar from "../../Navbar/Navbar";
import Footer from "../../Footer/Footer";

const BASE_URL = "http://localhost:5000";

function ViewMoreEvents() {
  const [groupedEvents, setGroupedEvents] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/events?status=Active`);
        const events = res.data.data;

        const grouped = events.reduce((acc, event) => {
          const categoryName = event.category?.categoryName || "Other Events";
          if (!acc[categoryName]) acc[categoryName] = [];
          acc[categoryName].push(event);
          return acc;
        }, {});

        setGroupedEvents(grouped);
      } catch (error) {
        toast.error("Failed to load events.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const categoryNames = Object.keys(groupedEvents).sort((a, b) =>
  a.localeCompare(b)
);

  return (
    <>
    <Navbar />
    <section className="all-events-page">
      <div className="all-events-page__inner">
        <h2 className="all-events-page__title">All Events</h2>

        {loading ? (
          <p className="all-events-page__status">Loading events...</p>
        ) : categoryNames.length === 0 ? (
          <p className="all-events-page__status">No events available.</p>
        ) : (
          categoryNames.map((categoryName) => (
            <div className="events-category" key={categoryName}>
              <h3 className="events-category__title">{categoryName}</h3>

              <div className="events-showcase__grid">
                {groupedEvents[categoryName].map((event) => (
                  <div className="event-card" key={event._id}>
                    <div className="event-card__image-wrap">
                      <img
                        src={`${BASE_URL}/uploads/${event.coverImage}`}
                        alt={event.eventName}
                        className="event-card__image"
                      />
                    </div>
                    <div className="event-card__body">
                      <h5 className="event-card__title">{event.eventName}</h5>
                      <p className="event-card__text">{event.shortDescription}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
    <Footer />
    </>
  );
}

export default ViewMoreEvents;