import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { 
  Search, 
  Mail, 
  Phone, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  Eye, 
  Trash2, 
  Send, 
  AlertCircle, 
  X,
  HelpCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import './Support.css';
import AdminLayout from '../../Pages/Admin/Layout/AdminLayout';

const BASE_URL = "http://localhost:5000";
const ROWS_PER_PAGE = 10;

const ManageInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [filteredInquiries, setFilteredInquiries] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replyError, setReplyError] = useState("");
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, targetId: null });

  // Fetch inquiries once on mount
  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/inquiries`);
      setInquiries(res.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load inquiries.");
    } finally {
      setIsLoading(false);
    }
  };

  // Client-side filter (status tab + search) — recalculates whenever data or filters change
  useEffect(() => {
    const delay = setTimeout(() => {
      let result = inquiries;

      if (activeTab !== "All") {
        result = result.filter(item => item.status === activeTab);
      }

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        result = result.filter(item =>
          item.clientName.toLowerCase().includes(query) ||
          item.ticketId.toLowerCase().includes(query) ||
          item.email.toLowerCase().includes(query) ||
          item.subject.toLowerCase().includes(query)
        );
      }

      setFilteredInquiries(result);
      // Whenever the tab or search changes, the result set is different —
      // jump back to page 1 so we don't land on an empty/out-of-range page.
      setCurrentPage(1);
    }, 250);

    return () => clearTimeout(delay);
  }, [activeTab, searchQuery, inquiries]);

  // ── Pagination ──────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(filteredInquiries.length / ROWS_PER_PAGE));
  const paginatedInquiries = filteredInquiries.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const updateLocalInquiry = (updated) => {
    setInquiries(prev => prev.map(item => (item._id === updated._id ? updated : item)));
    setSelectedInquiry(prev => (prev && prev._id === updated._id ? updated : prev));
  };

  const handleSetInProgress = async (id) => {
    try {
      const res = await axios.patch(`${BASE_URL}/api/inquiries/${id}/status`, { status: "In Progress" });
      updateLocalInquiry(res.data.data);
      toast.success("Inquiry ticket updated to In Progress status.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not update status.");
    }
  };

  const handleResolveInquiry = async (id) => {
    try {
      const res = await axios.patch(`${BASE_URL}/api/inquiries/${id}/status`, { status: "Resolved" });
      updateLocalInquiry(res.data.data);
      toast.success("Ticket successfully resolved!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not resolve ticket.");
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    const trimmed = replyText.trim();

    if (!trimmed) {
      setReplyError("Reply content cannot be blank.");
      return;
    }
    if (trimmed.length < 5) {
      setReplyError("Reply must be at least 5 characters.");
      return;
    }

    setIsSendingReply(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/inquiries/${selectedInquiry._id}/replies`, { text: trimmed });
      updateLocalInquiry(res.data.data);
      setReplyText("");
      setReplyError("");
      toast.success("Reply sent to customer inbox!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send reply.");
    } finally {
      setIsSendingReply(false);
    }
  };

  const triggerDeletePrompt = (id, e) => {
    e.stopPropagation();
    setDeleteModal({ isOpen: true, targetId: id });
  };

  const confirmDeleteInquiry = async () => {
    const targetId = deleteModal.targetId;
    try {
      await axios.delete(`${BASE_URL}/api/inquiries/${targetId}`);
      setInquiries(prev => prev.filter(item => item._id !== targetId));
      if (selectedInquiry?._id === targetId) setSelectedInquiry(null);
      toast.success("Inquiry permanently archived from ledger.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete inquiry.");
    } finally {
      setDeleteModal({ isOpen: false, targetId: null });
    }
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  // ── Shared action buttons (used by BOTH the table row and the mobile
  //    card, so the action logic only lives in one place) — tooltips are
  //    driven by data-tooltip in CSS via .support-action-btn::after ──────
  const renderActions = (inq) => (
    <>
      <button 
        className="support-action-btn action-view" 
        onClick={() => setSelectedInquiry(inq)} 
        data-tooltip="Inspect Inquiry"
        aria-label="Inspect Inquiry"
      >
        <Eye size={16} />
      </button>
      {inq.status !== "Resolved" && (
        <button 
          className="support-action-btn action-approve" 
          onClick={() => handleResolveInquiry(inq._id)} 
          data-tooltip="Mark Resolved"
          aria-label="Mark Resolved"
        >
          <CheckCircle size={16} />
        </button>
      )}
      <button 
        className="support-action-btn action-reject" 
        onClick={(e) => triggerDeletePrompt(inq._id, e)} 
        data-tooltip="Delete Ticket"
        aria-label="Delete Ticket"
      >
        <Trash2 size={16} />
      </button>
    </>
  );

  return (
    <AdminLayout>
      <div className="supportPage">
        <div className="supportPage-header">
          <div>
            <h2>Inquiries & Support Desks</h2>
            <p>Review customer forms, reply to custom event package questionnaires, and track resolution timelines.</p>
          </div>
        </div>

        <div className="supportPage-searchBox">
          <Search size={18} className="search-icon-svg" />
          <input 
            type="text" 
            placeholder="Search queries by ID, Name, Email or Topic keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => setSearchQuery("")}>&times;</button>
          )}
        </div>

        <div className="supportPage-tabs">
          <button className={activeTab === "All" ? "tab-btn active" : "tab-btn"} onClick={() => setActiveTab("All")}>
            All Queries <span className="tab-count">{inquiries.length}</span>
          </button>
          <button className={activeTab === "New" ? "tab-btn active" : "tab-btn"} onClick={() => setActiveTab("New")}>
            New <span className="tab-count">{inquiries.filter(i => i.status === "New").length}</span>
          </button>
          <button className={activeTab === "In Progress" ? "tab-btn active" : "tab-btn"} onClick={() => setActiveTab("In Progress")}>
            In Progress <span className="tab-count">{inquiries.filter(i => i.status === "In Progress").length}</span>
          </button>
          <button className={activeTab === "Resolved" ? "tab-btn active" : "tab-btn"} onClick={() => setActiveTab("Resolved")}>
            Resolved <span className="tab-count">{inquiries.filter(i => i.status === "Resolved").length}</span>
          </button>
        </div>

        <div className="supportPage-tableWrapper">
          {isLoading ? (
            <div className="table-loading-state">
              <div className="spinner"></div>
              <p>Syncing customer desk manifests...</p>
            </div>
          ) : filteredInquiries.length === 0 ? (
            <div className="table-empty-state">
              <HelpCircle size={40} className="empty-state-icon" />
              <h3>No Support Inquiries Located</h3>
              <p>No messages correspond to your chosen active filtering conditions.</p>
            </div>
          ) : (
            <>
              {/* ===== DESKTOP (≥1024px) & TABLET (768–1023px) — table =====
                  On tablet this scrolls horizontally and hides the
                  "col-optional" columns via CSS; desktop is untouched. */}
              <div className="supportPage-tableScroll">
                <table className="supportPage-table">
                  <thead>
                    <tr>
                      <th>Ticket ID</th>
                      <th>Client Contact</th>
                      <th className="col-optional">Subject Topic</th>
                      <th className="col-optional">Received Date</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedInquiries.map((inq) => (
                      <tr key={inq._id}>
                        <td className="support-id-cell">{inq.ticketId}</td>
                        <td>
                          <div className="client-meta">
                            <strong className="client-primary-name">{inq.clientName}</strong>
                            <span className="client-email">{inq.email}</span>
                          </div>
                        </td>
                        <td className="col-optional">
                          <div className="subject-meta">
                            <strong>{inq.subject}</strong>
                            <span className="message-snippet">{inq.message.substring(0, 50)}...</span>
                          </div>
                        </td>
                        <td className="col-optional">{formatDate(inq.createdAt)}</td>
                        <td>
                          <span className={`status-pill ${inq.status.toLowerCase().replace(/\s+/g, '-')}`}>
                            {inq.status}
                          </span>
                        </td>
                        <td>
                          <div className="supportPage-actions">{renderActions(inq)}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ===== MOBILE & TABLET CARD VIEW (≤992px) ===== */}
              <div className="inquiries-card-list">
                {paginatedInquiries.map((inq) => (
                  <div className="inquiry-card" key={inq._id}>
                    {/* 1. Top Bar */}
                    <div className="inquiry-card-top">
                      <span className="support-id-cell">{inq.ticketId}</span>
                      <span className={`status-pill ${inq.status.toLowerCase().replace(/\s+/g, '-')}`}>
                        {inq.status}
                      </span>
                    </div>

                    {/* 2. Client & Meta Info Grid */}
                    <div className="inquiry-card-infoGrid">
                      <div className="inquiry-card-clientCol">
                        <span className="grid-label">Client Contact</span>
                        <strong className="client-primary-name">{inq.clientName}</strong>
                        <span className="client-email">{inq.email}</span>
                      </div>
                      <div className="inquiry-card-metaCol">
                        <span className="grid-label">Received</span>
                        <span className="date-text" style={{ color: '#fff7ee', fontSize: '0.9rem' }}>
                          {formatDate(inq.createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* 3. Subject & Message Snippet */}
                    <div className="inquiry-card-subject">
                      <strong style={{ color: '#fff7ee', fontSize: '0.95rem' }}>{inq.subject}</strong>
                      <span className="message-snippet">{inq.message.substring(0, 60)}...</span>
                    </div>

                    {/* 4. Actions Footer */}
                    <div className="inquiry-card-actions">
                      <div className="supportPage-actions">{renderActions(inq)}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="supportPage-pagination">
                <span className="pagination-info">
                  Showing {(currentPage - 1) * ROWS_PER_PAGE + 1}–
                  {Math.min(currentPage * ROWS_PER_PAGE, filteredInquiries.length)} of {filteredInquiries.length}
                </span>

                <div className="pagination-controls">
                  <button
                    className="pagination-btn"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft size={16} />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      className={page === currentPage ? "pagination-btn active" : "pagination-btn"}
                      onClick={() => goToPage(page)}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    className="pagination-btn"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {selectedInquiry && (
          <div className="bookingModal-overlay" onClick={() => setSelectedInquiry(null)}>
            <div className="bookingModal-card" onClick={(e) => e.stopPropagation()}>
              <div className="bookingModal-header">
                <h3>Support Desk Audit: {selectedInquiry.ticketId}</h3>
                <button className="closeModal-btn" onClick={() => setSelectedInquiry(null)}>
                  <X size={20} />
                </button>
              </div>
              
              <div className="bookingModal-body">
                <div className="bookingModal-grid">
                  <div className="bookingModal-infoBlock">
                    <label>Identity Dossier</label>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Mail size={14} className="muted-icon" /> <strong>{selectedInquiry.clientName}</strong>
                    </p>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8a9ba8', fontSize: '0.85rem' }}>
                      <Phone size={13} className="muted-icon" /> {selectedInquiry.phone}
                    </p>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8a9ba8', fontSize: '0.85rem' }}>
                      {selectedInquiry.email}
                    </p>
                  </div>
                  <div className="bookingModal-infoBlock">
                    <label>Inquiry Timeline</label>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Clock size={14} className="muted-icon" /> Received: {formatDate(selectedInquiry.createdAt)}
                    </p>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      Status: <span className={`status-pill ${selectedInquiry.status.toLowerCase().replace(/\s+/g, '-')}`}>{selectedInquiry.status}</span>
                    </p>
                  </div>
                </div>

                <div className="support-message-box">
                  <div className="support-message-header">
                    <MessageSquare size={16} />
                    <span>Topic: {selectedInquiry.subject}</span>
                  </div>
                  <p className="support-message-content">"{selectedInquiry.message}"</p>
                </div>

                <div className="support-replies-thread">
                  <label>Operational Response Thread</label>
                  {selectedInquiry.replies.length === 0 ? (
                    <div className="no-replies-message">
                      <span>No responses recorded. Compose a reply message below to follow up.</span>
                    </div>
                  ) : (
                    <div className="replies-wrapper">
                      {selectedInquiry.replies.map((rep) => (
  <div key={rep._id} className={`reply-bubble ${rep.repliedBy === "Client" ? "reply-fromClient" : ""}`}>
    <span className="reply-sender">{rep.repliedBy === "Client" ? selectedInquiry.clientName : "Admin"}</span>
    <p>{rep.text}</p>
    <small>Posted: {formatDate(rep.createdAt)}</small>
  </div>
))}
                    </div>
                  )}
                </div>

                <form onSubmit={handleSendReply} className="support-reply-form">
                  <label htmlFor="replyText">Draft Official Response</label>
                  <textarea 
                    id="replyText"
                    rows={3} 
                    placeholder="Type follow-up support response or event pricing options..."
                    value={replyText}
                    onChange={(e) => {
                      setReplyText(e.target.value);
                      if (replyError) setReplyError("");
                    }}
                  />
                  {replyError && (
                    <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{replyError}</span>
                  )}
                  <button type="submit" className="btn-send-reply" disabled={isSendingReply}>
                    <Send size={14} />
                    <span>{isSendingReply ? "Sending..." : "Send Response"}</span>
                  </button>
                </form>
              </div>

              <div className="bookingModal-footer">
                {selectedInquiry.status === "New" && (
                  <button 
                    className="btn-approve-submit" 
                    onClick={() => handleSetInProgress(selectedInquiry._id)}
                  >
                    Set In Progress
                  </button>
                )}
                {selectedInquiry.status !== "Resolved" && (
                  <button 
                    className="btn-approve-submit" 
                    onClick={() => handleResolveInquiry(selectedInquiry._id)}
                  >
                    Mark Resolved
                  </button>
                )}
                <button className="bookingModal-cancelBtn" onClick={() => setSelectedInquiry(null)}>
                  Dismiss Desk
                </button>
              </div>
            </div>
          </div>
        )}

        {deleteModal.isOpen && (
          <div className="bookingModal-overlay">
            <div className="bookingModal-card confirmation-mini" onClick={(e) => e.stopPropagation()}>
              <div className="bookingModal-body text-center">
                <AlertCircle size={40} className="warning-icon-svg" />
                <h3>Confirm Deletion</h3>
                <p>
                  Are you sure you want to permanently delete this support ticket? This operation cannot be undone.
                </p>
                <div className="confirmation-actions">
                  <button className="btn-danger-execute" onClick={confirmDeleteInquiry}>
                    Confirm Archive
                  </button>
                  <button 
                    className="bookingModal-cancelBtn" 
                    onClick={() => setDeleteModal({ isOpen: false, targetId: null })}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </AdminLayout>
  );
};

export default ManageInquiries;