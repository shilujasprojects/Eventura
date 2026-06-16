import React, { useState, useEffect } from 'react';
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
  HelpCircle
} from 'lucide-react';
import './Support.css';
import AdminLayout from '../../Pages/Admin/Layout/AdminLayout';

const INITIAL_INQUIRIES = [
  {
    id: "INQ-2026-101",
    clientName: "Meera Nair",
    email: "meera.nair@example.com",
    phone: "+91 98470 12345",
    subject: "Custom Heritage Wedding Packages",
    message: "Hi Eventura Team, we are planning a traditional heritage wedding in Fort Kochi on October 2026. Do you support customized flower arrangements matching historical templates, or do we have to select from the predefined premium packaging models?",
    receivedDate: "15 Jun 2026",
    status: "New", // Options: New, In Progress, Resolved
    replies: []
  },
  {
    id: "INQ-2026-102",
    clientName: "Rohan Mathew",
    email: "rohan.mathew@example.com",
    phone: "+91 94460 98765",
    subject: "Corporate Conclave Catering",
    message: "Hello, we want to book a corporate business conclave for 150 guests. We noticed your premium catering options. Can we schedule a customization meeting to review gluten-free and vegan alternatives for our international attendees?",
    receivedDate: "12 Jun 2026",
    status: "In Progress",
    replies: [
      { text: "Hi Rohan, our culinary team is looking into customized menus and will email you directly today.", date: "13 Jun 2026" }
    ]
  },
  {
    id: "INQ-2026-103",
    clientName: "Divya Pillai",
    email: "divya.pillai@example.com",
    phone: "+91 98950 55511",
    subject: "Anniversary Celebration Sound Limits",
    message: "Do you provide sound restrictions guidelines for birthday/anniversary parties conducted around Alappuzha backwater houseboats?",
    receivedDate: "10 Jun 2026",
    status: "Resolved",
    replies: [
      { text: "Standard houseboat sound guidelines have been sent to your email. Closing this ticket.", date: "11 Jun 2026" }
    ]
  }
];

const ManageInquiries = () => {
  const [inquiries, setInquiries] = useState(INITIAL_INQUIRIES);
  const [filteredInquiries, setFilteredInquiries] = useState([]);
  const [activeTab, setActiveTab] = useState("All"); // Options: All, New, In Progress, Resolved
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Modal and Action controllers
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, targetId: null });
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const triggerToast = (msg, type = "success") => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3500);
  };

  useEffect(() => {
    setIsLoading(true);
    const delay = setTimeout(() => {
      let result = inquiries;

      // Filter by dynamic support tab status
      if (activeTab !== "All") {
        result = result.filter(item => item.status === activeTab);
      }

      // Filter by query strings matching name, email, ID, or subject
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        result = result.filter(item => 
          item.clientName.toLowerCase().includes(query) ||
          item.id.toLowerCase().includes(query) ||
          item.email.toLowerCase().includes(query) ||
          item.subject.toLowerCase().includes(query)
        );
      }

      setFilteredInquiries(result);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(delay);
  }, [activeTab, searchQuery, inquiries]);

  // Action: Transition state to In Progress
  const handleSetInProgress = (id) => {
    setInquiries(prev => prev.map(item => 
      item.id === id ? { ...item, status: "In Progress" } : item
    ));
    if (selectedInquiry?.id === id) {
      setSelectedInquiry(prev => ({ ...prev, status: "In Progress" }));
    }
    triggerToast("Inquiry ticket updated to In Progress status.");
  };

  // Action: Transition state to Resolved
  const handleResolveInquiry = (id) => {
    setInquiries(prev => prev.map(item => 
      item.id === id ? { ...item, status: "Resolved" } : item
    ));
    if (selectedInquiry?.id === id) {
      setSelectedInquiry(prev => ({ ...prev, status: "Resolved" }));
    }
    triggerToast("Ticket successfully resolved!");
  };

  // Action: Add Reply to Thread
  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) {
      triggerToast("Reply content cannot be blank.", "error");
      return;
    }

    const nextReply = {
      text: replyText,
      date: "Today"
    };

    setInquiries(prev => prev.map(item => {
      if (item.id === selectedInquiry.id) {
        // Automatically move status to "In Progress" if a response is generated
        const updatedStatus = item.status === "New" ? "In Progress" : item.status;
        return { 
          ...item, 
          status: updatedStatus,
          replies: [...item.replies, nextReply]
        };
      }
      return item;
    }));

    // Update active modal view reference
    setSelectedInquiry(prev => ({
      ...prev,
      status: prev.status === "New" ? "In Progress" : prev.status,
      replies: [...prev.replies, nextReply]
    }));

    setReplyText("");
    triggerToast("Reply processed and sent to customer inbox!");
  };

  // Action: Delete/Archive Confirmation Trigger
  const triggerDeletePrompt = (id, e) => {
    e.stopPropagation();
    setDeleteModal({ isOpen: true, targetId: id });
  };

  const confirmDeleteInquiry = () => {
    const targetId = deleteModal.targetId;
    setInquiries(prev => prev.filter(item => item.id !== targetId));
    setDeleteModal({ isOpen: false, targetId: null });
    if (selectedInquiry?.id === targetId) setSelectedInquiry(null);
    triggerToast("Inquiry permanently archived from ledger.", "error");
  };

  return (
    <AdminLayout>
      <div className="supportPage">
        {/* Module Success/Error Feedback Banner */}
        {toast.show && (
          <div className={`support-toast ${toast.type}`}>
            <AlertCircle size={16} />
            <span>{toast.message}</span>
          </div>
        )}

        {/* CMS Title Module Header */}
        <div className="supportPage-header">
          <div>
            <h2>Inquiries & Support Desks</h2>
            <p>Review customer forms, reply to custom event package questionnaires, and track resolution timelines.</p>
          </div>
        </div>

        {/* Dynamic SaaS Filter Search Row */}
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

        {/* Sub-navigation Ledger Tabs */}
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

        {}
        {/* Core Data Table Area with Fallbacks */}
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
            <table className="supportPage-table">
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Client Contact</th>
                  <th>Subject Topic</th>
                  <th>Received Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInquiries.map((inq) => (
                  <tr key={inq.id}>
                    <td className="support-id-cell">{inq.id}</td>
                    <td>
                      <div className="client-meta">
                        <strong className="client-primary-name">{inq.clientName}</strong>
                        <span className="client-email">{inq.email}</span>
                      </div>
                    </td>
                    <td>
                      <div className="subject-meta">
                        <strong>{inq.subject}</strong>
                        <span className="message-snippet">{inq.message.substring(0, 50)}...</span>
                      </div>
                    </td>
                    <td>{inq.receivedDate}</td>
                    <td>
                      <span className={`status-pill ${inq.status.toLowerCase().replace(/\s+/g, '-')}`}>
                        {inq.status}
                      </span>
                    </td>
                    <td>
                      <div className="supportPage-actions">
                        <button 
                          className="allEvents-actions-btn action-view" 
                          onClick={() => setSelectedInquiry(inq)} 
                          title="Inspect Inquiry Message"
                        >
                          <Eye size={16} />
                        </button>
                        {inq.status !== "Resolved" && (
                          <button 
                            className="allEvents-actions-btn action-approve" 
                            onClick={() => handleResolveInquiry(inq.id)} 
                            title="Mark Resolved"
                          >
                            <CheckCircle size={16} />
                          </button>
                        )}
                        <button 
                          className="allEvents-actions-btn action-reject" 
                          onClick={(e) => triggerDeletePrompt(inq.id, e)} 
                          title="Delete / Archive Ticket"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {}
        {/* Modal 1: Ticket Audit & Quick Reply Canvas */}
        {selectedInquiry && (
          <div className="bookingModal-overlay" onClick={() => setSelectedInquiry(null)}>
            <div className="bookingModal-card" onClick={(e) => e.stopPropagation()}>
              <div className="bookingModal-header">
                <h3>Support Desk Audit: {selectedInquiry.id}</h3>
                <button className="closeModal-btn" onClick={() => setSelectedInquiry(null)}>
                  <X size={20} />
                </button>
              </div>
              
              <div className="bookingModal-body">
                {/* Meta block header info */}
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
                      <Clock size={14} className="muted-icon" /> Received: {selectedInquiry.receivedDate}
                    </p>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      Status: <span className={`status-pill ${selectedInquiry.status.toLowerCase().replace(/\s+/g, '-')}`}>{selectedInquiry.status}</span>
                    </p>
                  </div>
                </div>

                {/* Main Client Message Text block */}
                <div className="support-message-box">
                  <div className="support-message-header">
                    <MessageSquare size={16} />
                    <span>Topic: {selectedInquiry.subject}</span>
                  </div>
                  <p className="support-message-content">"{selectedInquiry.message}"</p>
                </div>

                {/* Replies Thread Tracker */}
                <div className="support-replies-thread">
                  <label>Operational Response Thread</label>
                  {selectedInquiry.replies.length === 0 ? (
                    <div className="no-replies-message">
                      <span>No responses recorded. Compose a reply message below to follow up.</span>
                    </div>
                  ) : (
                    <div className="replies-wrapper">
                      {selectedInquiry.replies.map((rep, idx) => (
                        <div key={idx} className="reply-bubble">
                          <p>{rep.text}</p>
                          <small>Posted: {rep.date}</small>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Reply Form Section */}
                <form onSubmit={handleSendReply} className="support-reply-form">
                  <label htmlFor="replyText">Draft Official Response</label>
                  <textarea 
                    id="replyText"
                    rows={3} 
                    placeholder="Type follow-up support response or event pricing options..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <button type="submit" className="btn-send-reply">
                    <Send size={14} />
                    <span>Send Response</span>
                  </button>
                </form>
              </div>

              <div className="bookingModal-footer">
                {selectedInquiry.status === "New" && (
                  <button 
                    className="btn-approve-submit" 
                    onClick={() => handleSetInProgress(selectedInquiry.id)}
                  >
                    Set In Progress
                  </button>
                )}
                {selectedInquiry.status !== "Resolved" && (
                  <button 
                    className="btn-approve-submit" 
                    onClick={() => handleResolveInquiry(selectedInquiry.id)}
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

        {/* Modal 2: Confirmation Dialog Popup */}
        {deleteModal.isOpen && (
          <div className="bookingModal-overlay">
            <div className="bookingModal-card confirmation-mini" onClick={(e) => e.stopPropagation()}>
              <div className="bookingModal-body text-center">
                <AlertCircle size={40} className="warning-icon-svg" />
                <h3>Confirm Deletion</h3>
                <p>
                  Are you sure you want to permanently delete support ticket <strong>{deleteModal.targetId}</strong>? This operation cannot be undone.
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
    </AdminLayout>
  );
};

export default ManageInquiries;