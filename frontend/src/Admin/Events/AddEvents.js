import React, { useState } from "react";
import "./AddEvents.css";

const AddEvent = () => {
  const [eventData, setEventData] = useState({
    eventName: "",
    price: "",
    shortDescription: "",
    description: "",
    status: "Active",
    bannerImage: null,
  });

  const handleChange = (e) => {
    setEventData({
      ...eventData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setEventData({
      ...eventData,
      bannerImage: e.target.files[0],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(eventData);

    // API Call Here
  };

  return (
    <div className="addEvent">

      {/* Page Header */}
      <div className="addEvent-header">
        <h2>Add Event</h2>
        <p>Create a new event for Eventura</p>
      </div>

      {/* Form Card */}
      <div className="addEvent-card">

        <form onSubmit={handleSubmit}>

          {/* Event Name */}
          <div className="addEvent-formGroup">
            <label>Event Name</label>

            <input
              type="text"
              name="eventName"
              placeholder="Enter event name"
              value={eventData.eventName}
              onChange={handleChange}
            />
          </div>

          {/* Price */}
          <div className="addEvent-formGroup">
            <label>Starting Price</label>

            <input
              type="number"
              name="price"
              placeholder="Enter price"
              value={eventData.price}
              onChange={handleChange}
            />
          </div>

          {/* Short Description */}
          <div className="addEvent-formGroup">
            <label>Short Description</label>

            <textarea
              rows="3"
              name="shortDescription"
              placeholder="Short event description"
              value={eventData.shortDescription}
              onChange={handleChange}
            />
          </div>

          {/* Full Description */}
          <div className="addEvent-formGroup">
            <label>Full Description</label>

            <textarea
              rows="5"
              name="description"
              placeholder="Full event description"
              value={eventData.description}
              onChange={handleChange}
            />
          </div>

          {/* Status */}
          <div className="addEvent-formGroup">
            <label>Status</label>

            <select
              name="status"
              value={eventData.status}
              onChange={handleChange}
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>

          {/* Banner Image */}
          <div className="addEvent-formGroup">
            <label>Banner Image</label>

            <input
              type="file"
              onChange={handleImageChange}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="addEvent-submitBtn"
          >
            Create Event
          </button>

        </form>

      </div>

    </div>
  );
};

export default AddEvent;