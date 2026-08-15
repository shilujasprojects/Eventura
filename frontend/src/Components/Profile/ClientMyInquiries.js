import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Mail, Phone, Clock, MessageSquare, Send, X, HelpCircle } from 'lucide-react';
import './ClientMyInquiries.css';

const BASE_URL = "http://localhost:5000";

const ClientMyInquiries = ({ loggedInClient }) => {
  // loggedInClient: { _id, fullName, email, phone } from your client auth context
  const [inquiries, setInquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replyError, setReplyError] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (loggedInClient?._id) fetchMyInquiries();
  }, [loggedInClient]);

  const fetchMyInquiries = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/inquiries/client/${loggedInClient._id}`);
      setInquiries(res.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load your support tickets.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  const handleSendReply = async (e) => {
    e.preventDefault();
    const trimmed = replyText.trim();

    if (!trimmed) {
      setReplyError("Message cannot be blank.");
      return;
    }
    if (trimmed.length < 5) {
      setReplyError("Message must be at least 5 characters.");
      return;
    }

    setIsSending(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/inquiries/${selectedInquiry._id}/replies`, {
        text: trimmed,
        repliedBy: "Client",
      });

      const updated = res.data.data;
      setInquiries(prev => prev.map(item => (item._id === updated._id ? updated : item)));
      setSelectedInquiry(updated);
      setReplyText("");
      setReplyError("");
      toast.success("Your message has been sent to the Eventura team.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send your message.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="clientProfile-wrapper">
      {/* Client info summary card */}
      <div className="clientProfile-card">
        <h2>{loggedInClient?.fullName}</h2>
        <div className="clientProfile-metaRow">
          <span><Mail size={14} /> {loggedInClient?.email}</span>
          <span><Phone size={14} /> {loggedInClient?.phone}</span>
        </div>
      </div>

      {/* Ticket list */}
      <div className="clientTickets-section">
        <h3>My Support Tickets</h3>

        {isLoading ? (
          <div className="clientTickets-loading">
            <div className="spinner"></div>
            <p>Loading your tickets...</p>
          </div>
        ) : inquiries.length === 0 ? (
          <div className="clientTickets-empty">
            <HelpCircle size={36} />
            <p>You haven't raised any support inquiries yet.</p>
          </div>
        ) : (
          <div className="clientTickets-list">
            {inquiries.map((inq) => (
              <div key={inq._id} className="clientTicket-item" onClick={() => setSelectedInquiry(inq)}>
                <div className="clientTicket-main">
                  <span className="clientTicket-id">{inq.ticketId}</span>
                  <strong>{inq.subject}</strong>
                  <span className="clientTicket-date">Raised: {formatDate(inq.createdAt)}</span>
                </div>
                <span className={`status-pill ${inq.status.toLowerCase().replace(/\s+/g, '-')}`}>
                  {inq.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ticket thread modal */}
      {selectedInquiry && (
        <div className="bookingModal-overlay" onClick={() => setSelectedInquiry(null)}>
          <div className="bookingModal-card" onClick={(e) => e.stopPropagation()}>
            <div className="bookingModal-header">
              <h3>{selectedInquiry.ticketId} — {selectedInquiry.subject}</h3>
              <button className="closeModal-btn" onClick={() => setSelectedInquiry(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="bookingModal-body">
              <p style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8a9ba8', fontSize: '0.85rem' }}>
                <Clock size={14} /> Raised: {formatDate(selectedInquiry.createdAt)} &nbsp;•&nbsp;
                Status: <span className={`status-pill ${selectedInquiry.status.toLowerCase().replace(/\s+/g, '-')}`}>{selectedInquiry.status}</span>
              </p>

              <div className="support-message-box">
                <div className="support-message-header">
                  <MessageSquare size={16} />
                  <span>Your original message</span>
                </div>
                <p className="support-message-content">"{selectedInquiry.message}"</p>
              </div>

              <div className="support-replies-thread">
                <label>Conversation</label>
                {selectedInquiry.replies.length === 0 ? (
                  <div className="no-replies-message">
                    <span>No response yet — our team typically replies within 24 hours.</span>
                  </div>
                ) : (
                  <div className="replies-wrapper">
                    {selectedInquiry.replies.map((rep) => (
                      <div
                        key={rep._id}
                        className={`reply-bubble ${rep.repliedBy === "Client" ? "reply-fromClient" : ""}`}
                      >
                        <span className="reply-sender">{rep.repliedBy === "Client" ? "You" : "Eventura Team"}</span>
                        <p>{rep.text}</p>
                        <small>{formatDate(rep.createdAt)}</small>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <form onSubmit={handleSendReply} className="support-reply-form">
                <label htmlFor="clientReply">Send a follow-up message</label>
                <textarea
                  id="clientReply"
                  rows={3}
                  placeholder="Reply to the Eventura team..."
                  value={replyText}
                  onChange={(e) => {
                    setReplyText(e.target.value);
                    if (replyError) setReplyError("");
                  }}
                />
                {replyError && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{replyError}</span>}
                <button type="submit" className="btn-send-reply" disabled={isSending}>
                  <Send size={14} />
                  <span>{isSending ? "Sending..." : "Send"}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientMyInquiries;