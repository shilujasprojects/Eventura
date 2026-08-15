import React, { useState, useEffect } from "react";
import "./OurService.css";

const API_BASE_URL = "http://localhost:5000/api";
const UPLOADS_BASE_URL = "http://localhost:5000/uploads";

function OurService() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/services?status=Active`);
        const data = await res.json();

        if (data.success) {
          // Only keep services that actually have a banner image —
          // this section is a visual image grid, so a card with no
          // image would just render as a broken icon.
          setServices(data.data.filter((service) => service.bannerImage));
        } else {
          setError("Could not load services");
        }
      } catch (err) {
        console.error("Error fetching services:", err);
        setError("Could not load services");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    // Our Service section
    <div className="container-fluid our-service-card px-0 py-5 p-md-5">
      <section className="container">
        <div className="divider">
          <span>Our Services</span>
        </div>

        {loading && <p className="text-center mt-4">Loading services...</p>}

        {!loading && error && <p className="text-center mt-4">{error}</p>}

        {!loading && !error && services.length === 0 && (
          <p className="text-center mt-4">No services available right now.</p>
        )}

        {!loading && !error && services.length > 0 && (
          <div className="row g-3 mt-3 mb-5">
            {services.map((service) => (
              <div className="col-lg-3 col-md-6" key={service._id}>
                <div
                  className="service-image-card"
                  data-aos="zoom-out"
                  data-aos-duration="2000"
                >
                  <img
                    src={`${UPLOADS_BASE_URL}/${service.bannerImage}`}
                    alt={service.serviceName}
                  />
                  <div className="service-overlay">
                    <h4>{service.serviceName}</h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default OurService;