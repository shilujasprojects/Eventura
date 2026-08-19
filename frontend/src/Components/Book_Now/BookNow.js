import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./BookNow.css";

// 👈 Update this if your login page's route is different
const LOGIN_ROUTE = "/loginSign";
const BASE_URL = "http://localhost:5000";

function BookNow() {
  const navigate = useNavigate();

  // ── Logged-in client detection ────────────────────────────
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const storedRole = localStorage.getItem("role");
  const loggedInClient = storedRole === "client" ? storedUser : null;

  // ── Gate: must be logged in as a client to even open this page.
  // If not, send them to login/signup and remember to bring them
  // straight back here once they're in.
  useEffect(() => {
    if (!loggedInClient) {
      sessionStorage.setItem("postLoginRedirect", "/booknow");
      toast.info("Please login or sign up to book an event.");
      navigate(LOGIN_ROUTE);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [checkingStatus, setCheckingStatus] = useState(!!loggedInClient);
  const [isSuspended, setIsSuspended] = useState(false);

  // Admin-configured booking rules (margin days, deposit %, GST %).
  // Defaults here match the old hardcoded behavior, so the form still
  // works even if this fetch fails for some reason.
  const [bookingConfig, setBookingConfig] = useState({
    minimumBookingMarginDays: 1,
    advanceDepositPercentage: 50,
    serviceTaxPercentage: 18,
  });

  useEffect(() => {
    const fetchBookingConfig = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/settings/booking-config`);
        setBookingConfig(res.data.data);
      } catch (error) {
        console.error("Could not load booking configuration, using defaults", error);
      }
    };
    fetchBookingConfig();
  }, []);

  useEffect(() => {
    if (!loggedInClient) return;

    const checkStatus = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/public/clients/${loggedInClient._id}/status`,
        );
        setIsSuspended(res.data.status === "Suspended");
      } catch (error) {
        // If the check itself fails, don't block booking on a network hiccup —
        // the backend still enforces the suspended check when the booking is submitted.
        console.error("Could not verify account status", error);
      } finally {
        setCheckingStatus(false);
      }
    };

    checkStatus();
  }, [loggedInClient]);

  // Step 1: Category
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Step 2: Event (under selected category)
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Step 3: Package (under selected category) — or "custom"
  const [packages, setPackages] = useState([]);
  const [packagesLoading, setPackagesLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const [services, setServices] = useState([]);
  const [selectedExtraServices, setSelectedExtraServices] = useState([]);

  const [formData, setFormData] = useState({
    eventDate: "",
    startTime: "",
    endTime: "",
    city: "",
    venueName: "",
    guestCount: "",
    budgetRange: "₹50,000 – ₹1,00,000",
    specialRequirements: "",
    // Prefilled from the logged-in client, if any — still editable in case
    // they're booking on someone else's behalf or want to correct a detail.
    fullName: loggedInClient?.fullName || "",
    phone: loggedInClient?.phone || "",
    email: loggedInClient?.email || "",
    whatsappUpdates: false,
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const isCustom = selectedPackage === "custom";

  // ── Fetch active categories on load ──────────────────────
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/category?status=Active`);
        setCategories(res.data);
      } catch (error) {
        toast.error("Failed to load event categories. Please refresh the page.");
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // ── Fetch active services once (used only for custom builds) ──
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/services?status=Active`);
        setServices(res.data.data);
      } catch (error) {
        console.error("Failed to load services", error);
      }
    };
    fetchServices();
  }, []);

  // ── Fetch active events whenever category changes ────────
  useEffect(() => {
    if (!selectedCategory) {
      setEvents([]);
      setSelectedEvent(null);
      return;
    }

    const fetchEvents = async () => {
      setEventsLoading(true);
      setSelectedEvent(null);
      setPackages([]);
      setSelectedPackage(null);
      setSelectedExtraServices([]);
      try {
        const res = await axios.get(
          `${BASE_URL}/api/events?category=${selectedCategory._id}&status=Active`,
        );
        setEvents(res.data.data);
      } catch (error) {
        toast.error("Failed to load events for this category.");
      } finally {
        setEventsLoading(false);
      }
    };
    fetchEvents();
  }, [selectedCategory]);

  // ── Fetch active packages whenever an event is selected ──
  useEffect(() => {
    if (!selectedEvent) {
      setPackages([]);
      setSelectedPackage(null);
      return;
    }

    const fetchPackages = async () => {
      setPackagesLoading(true);
      setSelectedPackage(null);
      setSelectedExtraServices([]);
      try {
        const res = await axios.get(
          `${BASE_URL}/api/packages?category=${selectedCategory._id}&status=Active`,
        );
        setPackages(res.data.data);
      } catch (error) {
        toast.error("Failed to load packages for this event.");
      } finally {
        setPackagesLoading(false);
      }
    };
    fetchPackages();
  }, [selectedEvent]);

  // ── If no packages exist for this category, auto-switch to custom build ──
  useEffect(() => {
    if (!packagesLoading && selectedEvent && packages.length === 0) {
      setSelectedPackage("custom");
    }
  }, [packagesLoading, packages, selectedEvent]);

  // Reset service selection whenever switching between a real package and custom
  useEffect(() => {
    setSelectedExtraServices([]);
  }, [selectedPackage]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const toggleExtraService = (service) => {
    setSelectedExtraServices((prev) => {
      const exists = prev.find((s) => s.service === service._id);
      if (exists) return prev.filter((s) => s.service !== service._id);
      return [
        ...prev,
        {
          service: service._id,
          serviceName: service.serviceName,
          price: service.servicePrice,
        },
      ];
    });
  };

  // Pricing — subtotal from package/services, GST and advance % pulled
  // from bookingConfig (admin-configured), same formula the backend uses.
  const packagePrice = !isCustom && selectedPackage ? selectedPackage.finalPrice : 0;
  const extraServicesTotal = selectedExtraServices.reduce((sum, s) => sum + s.price, 0);
  const subtotal = packagePrice + extraServicesTotal;
  const taxAmount = Math.round(subtotal * (bookingConfig.serviceTaxPercentage / 100));
  const estimatedTotal = subtotal + taxAmount;
  const estimatedAdvance = Math.round(
    estimatedTotal * (bookingConfig.advanceDepositPercentage / 100),
  );

  const validate = () => {
    const newErrors = {};
    const nameRegex = /^[a-zA-Z\s]{3,50}$/;
    const cityRegex = /^[a-zA-Z\s]{2,40}$/;
    const phoneRegex = /^[6-9]\d{9}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!selectedCategory) newErrors.category = "Please select an event category.";
    if (!selectedEvent) newErrors.event = "Please select an event.";

    if (isCustom && selectedExtraServices.length === 0) {
      newErrors.package = "Select at least one service for your custom booking.";
    }

    // Date validation respects the admin-configured minimum notice period.
    if (!formData.eventDate) {
      newErrors.eventDate = "Event date is required.";
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const chosenDate = new Date(formData.eventDate);
      const marginDays = bookingConfig.minimumBookingMarginDays || 1;
      const minAllowedDate = new Date(today);
      minAllowedDate.setDate(minAllowedDate.getDate() + marginDays);

      if (chosenDate < minAllowedDate) {
        newErrors.eventDate =
          marginDays === 1
            ? "Please book at least 1 day in advance."
            : `Please book at least ${marginDays} days in advance.`;
      }
    }

    if (!formData.startTime) newErrors.startTime = "Start time is required.";
    if (!formData.endTime) newErrors.endTime = "End time is required.";
    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      newErrors.endTime = "End time must be after start time.";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required.";
    } else if (!cityRegex.test(formData.city.trim())) {
      newErrors.city = "City should only contain letters (2–40 characters).";
    }

    if (formData.venueName.trim() && formData.venueName.trim().length < 3) {
      newErrors.venueName = "Venue name should be at least 3 characters.";
    }

    if (!formData.guestCount) {
      newErrors.guestCount = "Guest count is required.";
    } else if (!Number.isInteger(Number(formData.guestCount)) || Number(formData.guestCount) < 1) {
      newErrors.guestCount = "Enter a valid guest count.";
    } else if (Number(formData.guestCount) > 5000) {
      newErrors.guestCount = "Guest count seems too high. Please contact us directly for events this size.";
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    } else if (!nameRegex.test(formData.fullName.trim())) {
      newErrors.fullName = "Name should only contain letters (3–50 characters).";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!phoneRegex.test(formData.phone.trim())) {
      newErrors.phone = "Enter a valid 10-digit phone number.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Enter a valid email address.";
    }

    if (formData.specialRequirements.length > 500) {
      newErrors.specialRequirements = "Please keep this under 500 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleReview = () => {
    if (submitting) return;

    if (!validate()) {
      toast.error("Please fix the highlighted fields before continuing.");
      return;
    }

    setSubmitting(true);

    const bookingData = {
      event: selectedEvent._id,
      eventName: selectedEvent.eventName,
      categoryName: selectedCategory.categoryName,
      coverImage: selectedEvent.coverImage,

      isCustomPackage: isCustom,
      package: isCustom ? null : selectedPackage._id,
      packageName: isCustom ? "Custom Package" : selectedPackage.packageName,
      packagePrice,

      extraServices: selectedExtraServices,
      extraServicesTotal,
      subtotal,
      taxPercentage: bookingConfig.serviceTaxPercentage,
      taxAmount,
      totalAmount: estimatedTotal,
      advancePercentage: bookingConfig.advanceDepositPercentage,
      estimatedAdvance,

      ...formData,
      fullName: formData.fullName.trim(),
      city: formData.city.trim(),
      budgetRange: isCustom ? formData.budgetRange : "",
    };

    localStorage.setItem("eventBooking", JSON.stringify(bookingData));
    navigate("/booksummary");
  };

  // ── Not logged in — the effect above is already redirecting; render
  // nothing but a brief placeholder so the form never flashes on screen ──
  if (!loggedInClient) {
    return (
      <div className="container-fluid book-now-section">
        <div className="container main-section py-5">
          <p className="text-center">Redirecting you to login...</p>
        </div>
      </div>
    );
  }

  // ── Gate: suspended clients see a blocker instead of the booking flow ──
  if (checkingStatus) {
    return (
      <div className="container-fluid book-now-section">
        <div className="container main-section py-5">
          <p className="text-center">Checking your account...</p>
        </div>
      </div>
    );
  }

  if (isSuspended) {
    return (
      <div className="container-fluid book-now-section">
        <div className="container main-section py-5">
          <div className="suspended-blocker">
            <h4>Account Suspended</h4>
            <p>
              Your account is currently suspended, so new bookings can't be made
              right now. Please contact our support team to reactivate your
              account before booking an event.
            </p>
            <a
              href="https://wa.me/9114155238886"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-gold px-4 py-2 mt-2"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container-fluid book-now-section">
        <div className="container main-section py-4 py-md-5">
          {/* STEP 1: CATEGORY */}
          <div className="mb-4">
            <h4 className="mb-3">Select Event Category</h4>

            {categoriesLoading ? (
              <p>Loading categories...</p>
            ) : categories.length === 0 ? (
              <p className="text-muted">
                No categories available right now. Please check back later.
              </p>
            ) : (
              <div className="row g-3">
                {categories.map((category) => (
                  <div key={category._id} className="col-6 col-sm-4 col-md-3 event-main">
                    <div
                      className={`event-card ${selectedCategory?._id === category._id ? "active" : ""}`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      <img
                        src={`${BASE_URL}/uploads/${category.image}`}
                        alt={category.categoryName}
                      />
                      <p>{category.categoryName}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {errors.category && <small className="error-text">{errors.category}</small>}
          </div>

          {/* STEP 2: EVENT */}
          {selectedCategory && (
            <div className="mb-4">
              <h4 className="mb-3">Select Event</h4>

              {eventsLoading ? (
                <p>Loading events...</p>
              ) : events.length === 0 ? (
                <p className="text-muted">No events available under this category yet.</p>
              ) : (
                <div className="row g-3">
                  {events.map((event) => (
                    <div key={event._id} className="col-6 col-sm-4 col-md-3 event-main">
                      <div
                        className={`event-card ${selectedEvent?._id === event._id ? "active" : ""}`}
                        onClick={() => setSelectedEvent(event)}
                      >
                        <img
                          src={`${BASE_URL}/uploads/${event.coverImage}`}
                          alt={event.eventName}
                        />
                        <p>{event.eventName}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {errors.event && <small className="error-text">{errors.event}</small>}
            </div>
          )}

          {/* STEP 3: PACKAGE */}
          {selectedEvent && (
            <div className="mb-4">
              <h4 className="mb-3">Select Package</h4>

              {packagesLoading ? (
                <p>Loading packages...</p>
              ) : packages.length === 0 ? (
                <p className="text-muted">
                  No pre-built packages available for this event yet — build your own package below.
                </p>
              ) : (
                <div className="row g-3">
                  {packages.map((pkg) => (
                    <div key={pkg._id} className="col-md-4">
                      <div
                        className={`service-card ${selectedPackage?._id === pkg._id ? "active" : ""}`}
                        onClick={() => setSelectedPackage(pkg)}
                      >
                        <h5>{pkg.packageName}</h5>
                        <p className="mb-2">₹{pkg.finalPrice.toLocaleString()}</p>
                        <div className="package-included-services">
                          {pkg.services?.map((s) => (
                            <span key={s.service?._id || s.service} className="included-service-tag">
                              {s.service?.serviceName || "Service"}
                              {s.isOptional ? " (optional)" : ""}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="col-md-4">
                    <div
                      className={`service-card ${isCustom ? "active" : ""}`}
                      onClick={() => setSelectedPackage("custom")}
                    >
                      <h5>Build Your Own</h5>
                      <p className="mb-1 text-muted">No package fits?</p>
                      <small>Pick individual services below</small>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SERVICES — custom package flow only */}
          {isCustom && (
            <div className="mb-4">
              <h4 className="mb-3">Select Services</h4>
              <div className="row">
                <div className="col-lg-9">
                  <div className="row g-3">
                    {services.map((service) => (
                      <div className="col-md-4" key={service._id}>
                        <div
                          className={`service-card ${
                            selectedExtraServices.some((s) => s.service === service._id) ? "active" : ""
                          }`}
                          onClick={() => toggleExtraService(service)}
                        >
                          <h5>{service.serviceName}</h5>
                          <small>+ ₹{service.servicePrice.toLocaleString()}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                  {errors.package && (
                    <small className="error-text d-block mt-2">{errors.package}</small>
                  )}
                </div>

                <div className="col-lg-3 mt-4 mt-lg-0">
                  <div className="summary-box p-4">
                    <h4>Your Selection</h4>
                    {selectedExtraServices.length === 0 ? (
                      <p>No services selected</p>
                    ) : (
                      <ul>
                        {selectedExtraServices.map((s) => (
                          <li key={s.service}>{s.serviceName}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedPackage && (
            <>
              <div className="mb-4">
                <h4 className="mb-3">Event Details</h4>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label>Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.eventDate}
                      onChange={(e) => handleInputChange("eventDate", e.target.value)}
                    />
                    <small className="text-muted">
                      Minimum {bookingConfig.minimumBookingMarginDays} day(s) notice required.
                    </small>
                    {errors.eventDate && (
                      <small className="error-text d-block">{errors.eventDate}</small>
                    )}
                  </div>
                  <div className="col-md-3">
                    <label>Start Time</label>
                    <input
                      type="time"
                      className="form-control"
                      value={formData.startTime}
                      onChange={(e) => handleInputChange("startTime", e.target.value)}
                    />
                    {errors.startTime && <small className="error-text">{errors.startTime}</small>}
                  </div>
                  <div className="col-md-3">
                    <label>End Time</label>
                    <input
                      type="time"
                      className="form-control"
                      value={formData.endTime}
                      onChange={(e) => handleInputChange("endTime", e.target.value)}
                    />
                    {errors.endTime && <small className="error-text">{errors.endTime}</small>}
                  </div>
                  <div className="col-md-6">
                    <label>City</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                    />
                    {errors.city && <small className="error-text">{errors.city}</small>}
                  </div>
                  <div className="col-md-6">
                    <label>Venue Name (optional)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.venueName}
                      onChange={(e) => handleInputChange("venueName", e.target.value)}
                    />
                    {errors.venueName && <small className="error-text">{errors.venueName}</small>}
                  </div>
                  <div className="col-md-6">
                    <label>Guest Count</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter number of guests"
                      min="1"
                      max="5000"
                      value={formData.guestCount}
                      onChange={(e) => handleInputChange("guestCount", e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault();
                      }}
                      onWheel={(e) => e.target.blur()}
                    />
                    <small className="text-muted">Approximate guest count</small>
                    {errors.guestCount && (
                      <small className="error-text d-block">{errors.guestCount}</small>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                {isCustom ? (
                  <>
                    <h4 className="mb-3">Budget & Preferences</h4>
                    <div className="row">
                      <div className="col-md-4 mb-2">
                        <label>Estimated Budget</label>
                        <select
                          className="form-select"
                          value={formData.budgetRange}
                          onChange={(e) => handleInputChange("budgetRange", e.target.value)}
                        >
                          <option>₹50,000 – ₹1,00,000</option>
                          <option>₹1,00,000 – ₹3,00,000</option>
                          <option>₹3,00,000+</option>
                        </select>
                        <small className="text-muted">
                          Helps our team plan since no fixed package is selected.
                        </small>
                      </div>
                      <div className="col-md-8 mb-2">
                        <label>Special Requirements</label>
                        <textarea
                          className="form-control"
                          rows="2"
                          maxLength="500"
                          placeholder="Tell us anything specific about your event..."
                          value={formData.specialRequirements}
                          onChange={(e) =>
                            handleInputChange("specialRequirements", e.target.value)
                          }
                        ></textarea>
                        {errors.specialRequirements && (
                          <small className="error-text">{errors.specialRequirements}</small>
                        )}
                      </div>
                    </div>

                    {/* Custom flow gets the same GST/advance breakdown as a package,
                        so the client knows the estimate before submitting. */}
                    <div className="price-summary-box p-3 mt-3">
                      <div className="d-flex justify-content-between">
                        <span>Selected Services Total</span>
                        <strong>₹{subtotal.toLocaleString()}</strong>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>GST ({bookingConfig.serviceTaxPercentage}%)</span>
                        <strong>₹{taxAmount.toLocaleString()}</strong>
                      </div>
                      <hr />
                      <div className="d-flex justify-content-between">
                        <span>Estimated Total</span>
                        <strong>₹{estimatedTotal.toLocaleString()}</strong>
                      </div>
                      <div className="d-flex justify-content-between mt-1">
                        <span className="text-muted">
                          Advance due now ({bookingConfig.advanceDepositPercentage}%)
                        </span>
                        <span className="text-muted">₹{estimatedAdvance.toLocaleString()}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <h4 className="mb-3">Price Summary</h4>
                    <div className="price-summary-box p-3 mb-3">
                      <div className="d-flex justify-content-between">
                        <span>{selectedPackage.packageName}</span>
                        <strong>₹{subtotal.toLocaleString()}</strong>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>GST ({bookingConfig.serviceTaxPercentage}%)</span>
                        <strong>₹{taxAmount.toLocaleString()}</strong>
                      </div>
                      <hr />
                      <div className="d-flex justify-content-between">
                        <span>Total Amount</span>
                        <strong>₹{estimatedTotal.toLocaleString()}</strong>
                      </div>
                      <div className="d-flex justify-content-between mt-1">
                        <span className="text-muted">
                          Advance due now ({bookingConfig.advanceDepositPercentage}%)
                        </span>
                        <span className="text-muted">₹{estimatedAdvance.toLocaleString()}</span>
                      </div>
                    </div>
                    <label>Special Requirements</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      maxLength="500"
                      placeholder="Tell us anything specific about your event..."
                      value={formData.specialRequirements}
                      onChange={(e) =>
                        handleInputChange("specialRequirements", e.target.value)
                      }
                    ></textarea>
                    {errors.specialRequirements && (
                      <small className="error-text">{errors.specialRequirements}</small>
                    )}
                  </>
                )}
              </div>

              <div className="mb-3">
                <h4 className="mb-3">Contact Details</h4>
                {loggedInClient && (
                  <p className="autofilled-note">
                    Prefilled from your account — feel free to edit if needed.
                  </p>
                )}
                <div className="row">
                  <div className="col-md-4 mb-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Full Name"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                    />
                    {errors.fullName && <small className="error-text">{errors.fullName}</small>}
                  </div>
                  <div className="col-md-4 mb-2">
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                    />
                    {errors.phone && <small className="error-text">{errors.phone}</small>}
                  </div>
                  <div className="col-md-4 mb-2">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                    {errors.email && <small className="error-text">{errors.email}</small>}
                  </div>
                  <div className="col-md-6 d-flex align-items-center">
                    <div className="form-check mt-2">
                      <input
                        className="input-check"
                        type="checkbox"
                        id="whatsappConfirm"
                        checked={formData.whatsappUpdates}
                        onChange={(e) =>
                          handleInputChange("whatsappUpdates", e.target.checked)
                        }
                      />
                      <label className="form-check-label" htmlFor="whatsappConfirm">
                        Send updates via WhatsApp
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-end mt-4">
                <button
                  type="button"
                  className="btn btn-gold px-4 py-2"
                  onClick={handleReview}
                  disabled={submitting}
                >
                  Review Booking
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <a
        href="https://wa.me/9114155238886"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
      >
        <i className="bi bi-whatsapp"></i>
      </a>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default BookNow;