import React, { useState, useEffect } from "react";
import {
  Search,
  CheckCircle,
  XCircle,
  Eye,
  RotateCcw,
  Download,
  FileText,
  AlertTriangle,
} from "lucide-react";
import "./Payments.css";
import AdminLayout from "../../Pages/Admin/Layout/AdminLayout";

// Mock Transaction Database mapped directly with Client and Booking Modules
const INITIAL_TRANSACTIONS = [
  {
    id: "TXN-2026-8501",
    bookingId: "EV-2026-9401",
    clientName: "Rahul Sharma",
    email: "rahul@example.com",
    amount: 72500, // 50% advance payment
    method: "UPI (Google Pay)",
    status: "Pending", // Needs admin manual screenshot verification
    date: "15 Jun 2026",
    receiptUrl:
      "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=500", // Placeholder receipt
    notes: "Advance payment for Royal Heritage Wedding",
  },
  {
    id: "TXN-2026-8502",
    bookingId: "EV-2026-9402",
    clientName: "Anita Joseph",
    email: "anita@example.com",
    amount: 35000, // Full payment
    method: "Bank Transfer (NEFT)",
    status: "Success",
    date: "10 Jun 2026",
    receiptUrl:
      "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=500",
    notes: "Neon Beats Birthday Party - Full Settlement",
  },
  {
    id: "TXN-2026-8503",
    bookingId: "EV-2026-7014",
    clientName: "Vikram Malhotra",
    email: "vikram@example.com",
    amount: 105000,
    method: "Credit Card",
    status: "Success",
    date: "05 Jun 2026",
    receiptUrl: null,
    notes: "Booking advance for Corporate Gala",
  },
  {
    id: "TXN-2026-8504",
    bookingId: "EV-2026-6102",
    clientName: "Arjun Nair",
    email: "arjun@example.com",
    amount: 15000,
    method: "UPI",
    status: "Refunded",
    date: "28 May 2026",
    receiptUrl: null,
    notes: "Refund processed due to event date cancellation",
  },
];

const ManagePayments = () => {
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [filteredTxns, setFilteredTxns] = useState([]);
  const [activeTab, setActiveTab] = useState("All"); // Options: All, Pending, Success, Refunded
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Modals Controller
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [refundModal, setRefundModal] = useState({
    isOpen: false,
    txnId: null,
    clientName: "",
    amount: 0,
  });

  /* STREAMING_CHUNK: Handling filter and search logic side-effects... */
  // Filter & Search Execution Block
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      let result = transactions;

      // Apply Filter Tabs
      if (activeTab !== "All") {
        result = result.filter((t) => t.status === activeTab);
      }

      // Apply Search Query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        result = result.filter(
          (t) =>
            t.clientName.toLowerCase().includes(query) ||
            t.id.toLowerCase().includes(query) ||
            t.bookingId.toLowerCase().includes(query) ||
            t.method.toLowerCase().includes(query),
        );
      }

      setFilteredTxns(result);
      setIsLoading(false);
    }, 350);

    return () => clearTimeout(timer);
  }, [activeTab, searchQuery, transactions]);

  // Action: Verify/Approve Manual Payment
  const handleVerifyPayment = (txnId) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === txnId ? { ...t, status: "Success" } : t)),
    );
    if (selectedTxn?.id === txnId) setSelectedTxn(null);
  };

  // Action: Reject/Mark Failed
  const handleRejectPayment = (txnId) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === txnId ? { ...t, status: "Failed" } : t)),
    );
    if (selectedTxn?.id === txnId) setSelectedTxn(null);
  };

  // Action: Execute Refund Transaction
  const handleProcessRefund = () => {
    const txnId = refundModal.txnId;
    setTransactions((prev) =>
      prev.map((t) => (t.id === txnId ? { ...t, status: "Refunded" } : t)),
    );
    setRefundModal({ isOpen: false, txnId: null, clientName: "", amount: 0 });
    if (selectedTxn?.id === txnId) setSelectedTxn(null);
  };

  return (
    <AdminLayout>
      <div className="allPayments">
        {/* Dynamic Module Header */}
        <div className="allPayments-header">
          <div>
            <h2>Financial Ledger & Payments</h2>
            <p>
              Monitor client deposit status, verify manual bank assets, and
              trigger ledger refunds.
            </p>
          </div>
        </div>

        {/* Modern SaaS Filter Search Row */}
        <div className="allPayments-searchBox">
          <Search size={18} className="search-icon-svg" />
          <input
            type="text"
            placeholder="Search by Transaction ID, Client Name, Booking ID, or Method..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => setSearchQuery("")}>
              &times;
            </button>
          )}
        </div>

        {/* Sub-navigation Ledger Tabs */}
        <div className="allPayments-tabs">
          <button
            className={activeTab === "All" ? "tab-btn active" : "tab-btn"}
            onClick={() => setActiveTab("All")}
          >
            All Payments{" "}
            <span className="tab-count">{transactions.length}</span>
          </button>
          <button
            className={activeTab === "Pending" ? "tab-btn active" : "tab-btn"}
            onClick={() => setActiveTab("Pending")}
          >
            Awaiting Verification{" "}
            <span className="tab-count">
              {transactions.filter((t) => t.status === "Pending").length}
            </span>
          </button>
          <button
            className={activeTab === "Success" ? "tab-btn active" : "tab-btn"}
            onClick={() => setActiveTab("Success")}
          >
            Successful{" "}
            <span className="tab-count">
              {transactions.filter((t) => t.status === "Success").length}
            </span>
          </button>
          <button
            className={activeTab === "Refunded" ? "tab-btn active" : "tab-btn"}
            onClick={() => setActiveTab("Refunded")}
          >
            Refunds{" "}
            <span className="tab-count">
              {transactions.filter((t) => t.status === "Refunded").length}
            </span>
          </button>
        </div>

        {/* STREAMING_CHUNK: Rendering the table layout with transaction results... */}
        {/* Data Table Area with Fallbacks */}
        <div className="allPayments-tableWrapper">
          {isLoading ? (
            <div className="table-loading-state">
              <div className="spinner"></div>
              <p>Syncing transactions with bank ledger...</p>
            </div>
          ) : filteredTxns.length === 0 ? (
            <div className="table-empty-state">
              <FileText size={40} className="empty-state-icon" />
              <h3>No Payments Logged</h3>
              <p>
                No transaction history has been matched to your active filter
                configurations.
              </p>
            </div>
          ) : (
            <table className="allPayments-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Booking ID</th>
                  <th>Client Name</th>
                  <th>Amount Received</th>
                  <th>Payment Method</th>
                  <th>Transaction Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTxns.map((txn) => (
                  <tr key={txn.id}>
                    <td className="payment-id-cell">{txn.id}</td>
                    <td className="booking-link-cell">{txn.bookingId}</td>
                    <td>
                      <div className="client-meta">
                        <strong className="client-primary-name">
                          {txn.clientName}
                        </strong>
                        <span className="client-email">{txn.email}</span>
                      </div>
                    </td>
                    <td className="gold-text-value">
                      ₹{txn.amount.toLocaleString()}
                    </td>
                    <td>
                      <span className="payment-method-badge">{txn.method}</span>
                    </td>
                    <td>{txn.date}</td>
                    <td>
                      <span
                        className={`status-pill ${txn.status.toLowerCase()}`}
                      >
                        {txn.status}
                      </span>
                    </td>
                    <td>
                      <div className="allPayments-actions">
                        <button
                          className="allEvents-actions-btn action-view"
                          onClick={() => setSelectedTxn(txn)}
                          title="Inspect Transaction"
                        >
                          <Eye size={16} />
                        </button>

                        {txn.status === "Pending" && (
                          <>
                            <button
                              className="allEvents-actions-btn action-approve"
                              onClick={() => handleVerifyPayment(txn.id)}
                              title="Verify Receipt"
                            >
                              <CheckCircle size={16} />
                            </button>
                            <button
                              className="allEvents-actions-btn action-reject"
                              onClick={() => handleRejectPayment(txn.id)}
                              title="Flag / Fail Transaction"
                            >
                              <XCircle size={16} />
                            </button>
                          </>
                        )}

                        {txn.status === "Success" && (
                          <button
                            className="allEvents-actions-btn action-refund"
                            onClick={() =>
                              setRefundModal({
                                isOpen: true,
                                txnId: txn.id,
                                clientName: txn.clientName,
                                amount: txn.amount,
                              })
                            }
                            title="Trigger Refund Flow"
                          >
                            <RotateCcw size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* STREAMING_CHUNK: Displaying modals for details verification and refunds... */}
        {/* Modal 1: Inspection & Manual Receipt Review Modal */}
        {selectedTxn && (
          <div
            className="bookingModal-overlay"
            onClick={() => setSelectedTxn(null)}
          >
            <div
              className="bookingModal-card"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bookingModal-header">
                <h3>Receipt Audit: {selectedTxn.id}</h3>
                <button
                  className="closeModal-btn"
                  onClick={() => setSelectedTxn(null)}
                >
                  &times;
                </button>
              </div>

              <div className="bookingModal-body">
                <div className="bookingModal-grid">
                  <div className="bookingModal-infoBlock">
                    <label>Customer Identity</label>
                    <p>
                      <strong>Name:</strong> {selectedTxn.clientName}
                    </p>
                    <p>
                      <strong>Email:</strong> {selectedTxn.email}
                    </p>
                  </div>
                  <div className="bookingModal-infoBlock">
                    <label>Allocation Matrix</label>
                    <p>
                      <strong>Assigned Booking:</strong> {selectedTxn.bookingId}
                    </p>
                    <p>
                      <strong>Method Used:</strong> {selectedTxn.method}
                    </p>
                  </div>
                </div>

                <div className="payment-receipt-preview-section">
                  <label>Uploaded Verification Proof</label>
                  {selectedTxn.receiptUrl ? (
                    <div className="receipt-image-card">
                      <img
                        src={selectedTxn.receiptUrl}
                        alt="Transaction Receipt Upload"
                      />
                      <div className="receipt-overlay-actions">
                        <a
                          href={selectedTxn.receiptUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="download-btn"
                        >
                          <Download size={15} /> Download Proof Screen
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="no-receipt-card">
                      <FileText size={30} className="muted-icon" />
                      <span>
                        No physical document needed for instant gateway credit
                        transfers.
                      </span>
                    </div>
                  )}
                </div>

                <div
                  className="bookingModal-infoBlock"
                  style={{ marginTop: "15px" }}
                >
                  <label>Ledger Notes / Context</label>
                  <p className="ledger-notes">
                    {selectedTxn.notes || "No context noted."}
                  </p>
                </div>

                <div className="bookingModal-totalPrice">
                  <span>Calculated Net Credit:</span>
                  <span className="price-tag">
                    ₹{selectedTxn.amount.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="bookingModal-footer">
                {selectedTxn.status === "Pending" && (
                  <>
                    <button
                      className="btn-approve-submit"
                      onClick={() => handleVerifyPayment(selectedTxn.id)}
                    >
                      Approve Ledger Entry
                    </button>
                    <button
                      className="btn-reject-trigger"
                      onClick={() => handleRejectPayment(selectedTxn.id)}
                    >
                      Flag Failed
                    </button>
                  </>
                )}
                <button
                  className="bookingModal-cancelBtn"
                  onClick={() => setSelectedTxn(null)}
                >
                  Dismiss Audit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal 2: Refund Process Confirmation (SaaS Security Rules) */}
        {refundModal.isOpen && (
          <div className="bookingModal-overlay">
            <div
              className="bookingModal-card confirmation-mini"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bookingModal-body text-center">
                <AlertTriangle size={40} className="warning-icon-svg" />
                <h3>Process Ledger Refund</h3>
                <p>
                  Are you sure you want to refund{" "}
                  <strong>₹{refundModal.amount.toLocaleString()}</strong> back
                  to client <strong>{refundModal.clientName}</strong>? This
                  changes standard database booking workflows.
                </p>
                <div className="confirmation-actions">
                  <button
                    className="btn-danger-execute"
                    onClick={handleProcessRefund}
                  >
                    Yes, Process Refund
                  </button>
                  <button
                    className="bookingModal-cancelBtn"
                    onClick={() =>
                      setRefundModal({
                        isOpen: false,
                        txnId: null,
                        clientName: "",
                        amount: 0,
                      })
                    }
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

export default ManagePayments;
