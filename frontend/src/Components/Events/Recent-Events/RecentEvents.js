import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./RecentEvents.css";

const BASE_URL = "http://localhost:5000";

function RecentEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/events?status=Active`);
        setEvents(res.data.data.slice(8, 12));
      } catch (error) {
        toast.error("Failed to load events.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <section className="events-showcase">
      <div className="events-showcase__inner">
        <div className="events-showcase__header">
          <h2 className="events-showcase__title">Our Events</h2>
          <Link to="/view-more" className="events-showcase__link">
            View More
          </Link>
        </div>

        {loading ? (
          <p className="events-showcase__status">Loading events...</p>
        ) : events.length === 0 ? (
          <p className="events-showcase__status">No events to show right now.</p>
        ) : (
          <div className="events-showcase__grid">
            {events.map((event) => (
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
        )}
      </div>
    </section>
  );
}

export default RecentEvents;