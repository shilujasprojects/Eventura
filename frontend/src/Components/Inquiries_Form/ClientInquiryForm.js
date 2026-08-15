import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Send } from 'lucide-react';
import './ClientInquiryForm.css';

const BASE_URL = "http://localhost:5000";

const ClientInquiryForm = ({ loggedInClient, onSuccess }) => {
  const [formData, setFormData] = useState({
    clientName: loggedInClient?.fullName || "",
    email: loggedInClient?.email || "",
    phone: loggedInClient?.phone || "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9+\-\s]{10,15}$/;

    if (!formData.clientName.trim()) newErrors.clientName = "Name is required.";
    if (!formData.email.trim() || !emailRegex.test(formData.email)) newErrors.email = "Enter a valid email address.";
    if (!formData.phone.trim() || !phoneRegex.test(formData.phone)) newErrors.phone = "Enter a valid phone number.";
    if (!formData.subject.trim()) newErrors.subject = "Subject is required.";
    if (!formData.message.trim() || formData.message.trim().length < 15) {
      newErrors.message = "Message should be at least 15 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/inquiries`, {
        ...formData,
        client: loggedInClient?._id || null,
      });

      toast.success(`Inquiry submitted! Your ticket ID is ${res.data.data.ticketId}`);
      setFormData(prev => ({ ...prev, subject: "", message: "" }));
      if (onSuccess) onSuccess(res.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="clientInquiry-card">
      <h2>Get in Touch</h2>
      <p>Have a question about a package, booking, or event? Send us a message and our team will get back to you.</p>

      <form onSubmit={handleSubmit} className="clientInquiry-form">
        <div className="clientInquiry-grid">
          <div className="clientInquiry-field">
            <label>Full Name</label>
            <input
              type="text"
              name="clientName"
              className={errors.clientName ? "has-error" : ""}
              value={formData.clientName}
              onChange={handleChange}
            />
            {errors.clientName && <span className="field-error">{errors.clientName}</span>}
          </div>

          <div className="clientInquiry-field">
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              className={errors.phone ? "has-error" : ""}
              value={formData.phone}
              onChange={handleChange}
            />
            {errors.phone && <span className="field-error">{errors.phone}</span>}
          </div>

          <div className="clientInquiry-field">
            <label>Email</label>
            <input
              type="email"
              name="email"
              className={errors.email ? "has-error" : ""}
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="clientInquiry-field">
            <label>Subject</label>
            <input
              type="text"
              name="subject"
              placeholder="e.g. Custom Wedding Package Inquiry"
              className={errors.subject ? "has-error" : ""}
              value={formData.subject}
              onChange={handleChange}
            />
            {errors.subject && <span className="field-error">{errors.subject}</span>}
          </div>

          <div className="clientInquiry-field clientInquiry-fullWidth">
            <label>Message</label>
            <textarea
              name="message"
              rows={4}
              placeholder="Tell us more about your event and requirements..."
              className={errors.message ? "has-error" : ""}
              value={formData.message}
              onChange={handleChange}
            />
            {errors.message && <span className="field-error">{errors.message}</span>}
          </div>
        </div>

        <button type="submit" className="clientInquiry-submitBtn" disabled={isSubmitting}>
          <Send size={16} />
          <span>{isSubmitting ? "Submitting..." : "Send Inquiry"}</span>
        </button>
      </form>
    </div>
  );
};

export default ClientInquiryForm;