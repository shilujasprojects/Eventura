import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import "./MakePayment.css";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";

const BASE_URL = "http://localhost:5000";

function MakePayment() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stage, setStage] = useState(null); // "Advance" | "Final" | null
  const [isRetry, setIsRetry] = useState(false); // true if the previous attempt for this stage was Failed

  const [form, setForm] = useState({ method: "UPI", referenceNumber: "" });
  const [receipt, setReceipt] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/bookings/${bookingId}`);
        const data = res.data.data;
        setBooking(data);

        const { advanceStatus, finalStatus } = data.paymentSummary;
        const isCancelled = data.status === "Cancelled";

        // A payment is due if it's either never been attempted ("Not Paid")
        // or the previous attempt was rejected by admin ("Failed") — both
        // states mean the client still needs to submit a receipt.
        const advanceDue =
          !isCancelled && (advanceStatus === "Not Paid" || advanceStatus === "Failed");

        const balanceDue =
          !isCancelled &&
          advanceStatus === "Paid" &&
          data.status === "Completed" &&
          (finalStatus === "Not Paid" || finalStatus === "Failed");

        if (advanceDue) {
          setStage("Advance");
          setIsRetry(advanceStatus === "Failed");
        } else if (balanceDue) {
          setStage("Final");
          setIsRetry(finalStatus === "Failed");
        } else {
          setStage(null);
          setIsRetry(false);
        }
      } catch (error) {
        toast.error("Failed to load booking details.");
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Receipt image must be under 5MB.");
      return;
    }
    setReceipt(file);
    if (errors.receipt) setErrors((prev) => ({ ...prev, receipt: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.referenceNumber.trim()) {
      newErrors.referenceNumber = "Enter the UPI/bank transaction reference number.";
    } else if (form.referenceNumber.trim().length < 4) {
      newErrors.referenceNumber = "That reference number looks too short — please check it.";
    }
    if (!receipt) {
      newErrors.receipt = "Please upload a screenshot of the payment.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = new FormData();
      payload.append("bookingId", bookingId);
      payload.append("paymentStage", stage);
      payload.append("method", form.method);
      payload.append("referenceNumber", form.referenceNumber.trim());
      payload.append("receipt", receipt);

      await axios.post(`${BASE_URL}/api/payments/submit`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Payment submitted! We'll verify it shortly.");
      navigate("/clientDashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Payment submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="payment-page container py-5 text-center">Loading booking details...</div>;
  }
  if (!booking) {
    return <div className="payment-page container py-5 text-center">Booking not found.</div>;
  }
  if (!stage) {
    return (
      <div className="payment-page container py-5 text-center">
        <p>No payment is due for this booking right now.</p>
      </div>
    );
  }

  const amountDue = stage === "Advance"
    ? booking.paymentSummary.advanceAmount
    : booking.paymentSummary.balanceAmount;

  return (
    <>
    <Navbar />
    <div className="container payment-page py-4">
      <div className="make-payment-card">
        <h3 className="mb-1">{stage === "Advance" ? "Advance Payment" : "Final Payment"}</h3>
        <p className="text-muted mb-4">
          Booking {booking.bookingId} — {new Date(booking.eventDate).toLocaleDateString("en-IN")}
        </p>

        {isRetry && (
          <div className="retry-notice-box">
            Your previous {stage === "Advance" ? "advance" : "balance"} payment receipt
            couldn't be verified. Please double-check the details below and submit a new one.
          </div>
        )}

        <div className="amount-due-box">
          <span>Amount Due</span>
          <strong>₹{amountDue.toLocaleString()}</strong>
        </div>

        <div className="upi-details-box">
          <p><strong>Pay via UPI:</strong> eventura@upi</p>
          <p><strong>Or Bank Transfer:</strong> A/C 421568973214, IFSC EVNT0001234</p>
          <small className="text-muted">
            After paying, enter the reference number and upload a screenshot below.
          </small>
        </div>

        <form onSubmit={handleSubmit} className="mt-4">

          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label>Payment Method</label>
              <select
                className="form-select"
                value={form.method}
                onChange={(e) => setForm({ ...form, method: e.target.value })}
              >
                <option value="UPI">UPI</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cash">Cash</option>
              </select>
            </div>

            <div className="col-md-6">
              <label>Transaction Reference Number</label>
              <input
                type="text"
                className="form-control"
                placeholder="UTR / reference number from your bank app"
                value={form.referenceNumber}
                onChange={(e) => setForm({ ...form, referenceNumber: e.target.value })}
              />
              {errors.referenceNumber && <small className="error-text">{errors.referenceNumber}</small>}
            </div>
          </div>

          <div className="mb-3">
            <label>Upload Payment Screenshot</label>
            <input type="file" accept="image/*" className="form-control" onChange={handleFileChange} />
            {errors.receipt && <small className="error-text">{errors.receipt}</small>}
          </div>

          <button type="submit" className="btn btn-gold w-100" disabled={submitting}>
            {submitting ? "Submitting..." : `Submit ₹${amountDue.toLocaleString()} Payment`}
          </button>
        </form>
      </div>
    </div>
    <Footer />
    <ToastContainer position="top-right" autoClose={3000} />
    </>

  );
}

export default MakePayment;