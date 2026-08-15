import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import {
  Search,
  CheckCircle,
  XCircle,
  Eye,
  RotateCcw,
  Download,
  FileText,
  AlertTriangle,
  Lock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import "./Payments.css";
import AdminLayout from "../../Pages/Admin/Layout/AdminLayout";

const BASE_URL = "http://localhost:5000";
const ROWS_PER_PAGE = 10;

const ManagePayments = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTxns, setFilteredTxns] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [downloadingReceipt, setDownloadingReceipt] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedTxn, setSelectedTxn] = useState(null);
  const [refundModal, setRefundModal] = useState({
    isOpen: false,
    txnId: null,
    clientName: "",
    maxAmount: 0,
    amount: "",
    stage: "Advance",
    reason: "",
  });
  const [refundErrors, setRefundErrors] = useState({});

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/payments`);
      setTransactions(res.data.data);
    } catch (error) {
      toast.error("Failed to load transactions. Please refresh the page.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    let result = transactions;

    if (activeTab !== "All") {
      result = result.filter((t) => t.status === activeTab);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.transactionId.toLowerCase().includes(query) ||
          t.booking?.bookingId?.toLowerCase().includes(query) ||
          t.client?.fullName?.toLowerCase().includes(query) ||
          t.method.toLowerCase().includes(query)
      );
    }

    setFilteredTxns(result);
    // Whenever the tab or search changes, the result set is different —
    // jump back to page 1 so we don't land on an empty/out-of-range page.
    setCurrentPage(1);
  }, [activeTab, searchQuery, transactions]);

  // ── Pagination ──────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(filteredTxns.length / ROWS_PER_PAGE));
  const paginatedTxns = filteredTxns.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // ── Verify ────────────────────────────────────────────────
  const handleVerifyPayment = async (txnId) => {
    setActionLoadingId(txnId);
    try {
      const res = await axios.patch(`${BASE_URL}/api/payments/${txnId}/verify`);
      toast.success(res.data.message);
      await fetchTransactions();
      if (selectedTxn?._id === txnId) setSelectedTxn(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to verify payment.");
    } finally {
      setActionLoadingId(null);
    }
  };

  // ── Reject ────────────────────────────────────────────────
  const handleRejectPayment = async (txnId) => {
    setActionLoadingId(txnId);
    try {
      const res = await axios.patch(`${BASE_URL}/api/payments/${txnId}/reject`);
      toast.info(res.data.message);
      await fetchTransactions();
      if (selectedTxn?._id === txnId) setSelectedTxn(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject payment.");
    } finally {
      setActionLoadingId(null);
    }
  };

  // ── Refund modal open ────────────────────────────────────
  const openRefundModal = (txn) => {
    setRefundModal({
      isOpen: true,
      txnId: txn._id,
      clientName: txn.client?.fullName || "this client",
      maxAmount: txn.amount,
      amount: txn.amount,
      stage: txn.paymentStage,
      reason: "",
    });
    setRefundErrors({});
  };

  const closeRefundModal = () => {
    setRefundModal({ isOpen: false, txnId: null, clientName: "", maxAmount: 0, amount: "", stage: "Advance", reason: "" });
    setRefundErrors({});
  };

  const validateRefundAmount = (value, max) => {
    const num = Number(value);
    if (!value) return "Enter a refund amount.";
    if (isNaN(num) || num <= 0) return "Enter a valid amount.";
    if (num > max) return `Can't exceed the paid amount (₹${max.toLocaleString()}).`;
    return "";
  };

  const handleRefundAmountChange = (value) => {
    setRefundModal((prev) => ({ ...prev, amount: value }));
    setRefundErrors((prev) => ({ ...prev, amount: validateRefundAmount(value, refundModal.maxAmount) }));
  };

  const handleRefundReasonChange = (value) => {
    setRefundModal((prev) => ({ ...prev, reason: value }));
    setRefundErrors((prev) => ({ ...prev, reason: value.trim() ? "" : prev.reason }));
  };

  // ── Refund submit ────────────────────────────────────────
  const handleProcessRefund = async () => {
    const errors = {
      amount: validateRefundAmount(refundModal.amount, refundModal.maxAmount),
      reason: refundModal.reason.trim() ? "" : "Please explain why this refund is being issued.",
    };
    setRefundErrors(errors);

    if (errors.amount || errors.reason) {
      toast.error("Please fix the highlighted fields before proceeding.");
      return;
    }

    const txnId = refundModal.txnId;
    setActionLoadingId(txnId);
    try {
      const res = await axios.patch(`${BASE_URL}/api/payments/${txnId}/refund`, {
        reason: refundModal.reason.trim(),
        refundAmount: Number(refundModal.amount),
      });
      toast.success(res.data.message);
      await fetchTransactions();
      if (selectedTxn?._id === txnId) setSelectedTxn(null);
      closeRefundModal();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to process refund.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const receiptUrl = (filename) =>
    filename ? `${BASE_URL}/uploads/${filename}` : null;

  // ── Download receipt ───────────────────────────────────────
  const handleDownloadReceipt = async (filename) => {
    const url = receiptUrl(filename);
    if (!url) return;

    setDownloadingReceipt(true);
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("File not found");

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const tempLink = document.createElement("a");
      tempLink.href = blobUrl;
      tempLink.download = filename;
      document.body.appendChild(tempLink);
      tempLink.click();
      tempLink.remove();

      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      toast.error("Failed to download the receipt. Please try again.");
    } finally {
      setDownloadingReceipt(false);
    }
  };

  // ── Shared helpers (used by BOTH the table row and the mobile card,
  //    so status logic / action buttons only live in one place) ──────
  const getStatusLabel = (txn) =>
    txn.status === "Refunded" && txn.refundedAmount != null && txn.refundedAmount < txn.amount
      ? "Partially Refunded"
      : txn.status;

  const renderActions = (txn) => (
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
            onClick={() => handleVerifyPayment(txn._id)}
            disabled={actionLoadingId === txn._id}
            title="Verify Receipt"
          >
            <CheckCircle size={16} />
          </button>
          <button
            className="allEvents-actions-btn action-reject"
            onClick={() => handleRejectPayment(txn._id)}
            disabled={actionLoadingId === txn._id}
            title="Flag / Fail Transaction"
          >
            <XCircle size={16} />
          </button>
        </>
      )}

      {txn.status === "Success" && (
        txn.booking?.status === "Closed" ? (
          <button
            className="allEvents-actions-btn action-locked"
            disabled
            title="Booking is closed — refunds are not permitted"
          >
            <Lock size={14} />
          </button>
        ) : (
          <button
            className="allEvents-actions-btn action-refund"
            onClick={() => openRefundModal(txn)}
            title="Trigger Refund Flow"
          >
            <RotateCcw size={16} />
          </button>
        )
      )}
    </div>
  );

  return (
    <AdminLayout>
      <div className="allPayments">
        <div className="allPayments-header">
          <div>
            <h2>Financial Ledger & Payments</h2>
            <p>
              Monitor client deposit status, verify manual bank assets, and
              trigger ledger refunds.
            </p>
          </div>
        </div>

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

        <div className="allPayments-tabs">
          {["All", "Pending", "Success", "Failed", "Refunded"].map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? "tab-btn active" : "tab-btn"}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "Pending" ? "Awaiting Verification" : tab}{" "}
              <span className="tab-count">
                {tab === "All"
                  ? transactions.length
                  : transactions.filter((t) => t.status === tab).length}
              </span>
            </button>
          ))}
        </div>

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
            <>
              {/* ===== DESKTOP (≥1024px) & TABLET (768–1023px) — table =====
                  On tablet this scrolls horizontally and hides the
                  "col-optional" columns via CSS; desktop is untouched. */}
              <div className="allPayments-tableScroll">
                <table className="allPayments-table">
                  <thead>
                    <tr>
                      <th>Transaction ID</th>
                      <th className="col-optional">Booking ID</th>
                      <th>Client Name</th>
                      <th className="col-optional">Stage</th>
                      <th>Amount</th>
                      <th className="col-optional">Method</th>
                      <th className="col-optional">Date</th>
                      <th>Status</th>
                      <th style={{ textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedTxns.map((txn) => (
                      <tr key={txn._id}>
                        <td className="payment-id-cell">{txn.transactionId}</td>
                        <td className="booking-link-cell col-optional">{txn.booking?.bookingId || "—"}</td>
                        <td>
                          <div className="client-meta">
                            <strong className="client-primary-name">
                              {txn.client?.fullName || "—"}
                            </strong>
                            <span className="client-email">{txn.client?.email}</span>
                          </div>
                        </td>
                        <td className="col-optional">
                          <span className="payment-stage-badge">
                            {txn.paymentStage === "Advance" ? "Advance" : "Balance"}
                          </span>
                        </td>
                        <td className="gold-text-value">
                          ₹{txn.amount.toLocaleString()}
                          {txn.status === "Refunded" && txn.refundedAmount != null && txn.refundedAmount < txn.amount && (
                            <div className="partial-refund-note">↩ ₹{txn.refundedAmount.toLocaleString()} refunded</div>
                          )}
                        </td>
                        <td className="col-optional">
                          <span className="payment-method-badge">{txn.method}</span>
                        </td>
                        <td className="col-optional">{new Date(txn.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
                        <td>
                          <span className={`status-pill ${txn.status.toLowerCase()}`}>
                            {getStatusLabel(txn)}
                          </span>
                        </td>
                        <td>{renderActions(txn)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ===== MOBILE (<768px) — card list ===== */}
              <div className="payments-card-list">
                {paginatedTxns.map((txn) => (
                  <div className="payment-card" key={txn._id}>
                    <div className="payment-card-top">
                      <div>
                        <span className="payment-id-cell">{txn.transactionId}</span>
                        <div className="payment-card-booking">
                          Booking: {txn.booking?.bookingId || "—"}
                        </div>
                      </div>
                      <span className={`status-pill ${txn.status.toLowerCase()}`}>
                        {getStatusLabel(txn)}
                      </span>
                    </div>

                    <div className="payment-card-client">
                      <strong className="client-primary-name">{txn.client?.fullName || "—"}</strong>
                      <span className="client-email">{txn.client?.email}</span>
                    </div>

                    <div className="payment-card-meta">
                      <div className="payment-card-meta-item">
                        <span className="meta-label">Stage</span>
                        <span className="payment-stage-badge">
                          {txn.paymentStage === "Advance" ? "Advance" : "Balance"}
                        </span>
                      </div>
                      <div className="payment-card-meta-item">
                        <span className="meta-label">Amount</span>
                        <span className="gold-text-value">
                          ₹{txn.amount.toLocaleString()}
                          {txn.status === "Refunded" && txn.refundedAmount != null && txn.refundedAmount < txn.amount && (
                            <div className="partial-refund-note">↩ ₹{txn.refundedAmount.toLocaleString()} refunded</div>
                          )}
                        </span>
                      </div>
                      <div className="payment-card-meta-item">
                        <span className="meta-label">Method</span>
                        <span className="payment-method-badge">{txn.method}</span>
                      </div>
                      <div className="payment-card-meta-item">
                        <span className="meta-label">Date</span>
                        <span className="meta-label-date">{new Date(txn.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
                      </div>
                    </div>

                    <div className="payment-card-actions">{renderActions(txn)}</div>
                  </div>
                ))}
              </div>

              <div className="allPayments-pagination">
                <span className="pagination-info">
                  Showing {(currentPage - 1) * ROWS_PER_PAGE + 1}–
                  {Math.min(currentPage * ROWS_PER_PAGE, filteredTxns.length)} of {filteredTxns.length}
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

        {selectedTxn && (
          <div className="bookingModal-overlay" onClick={() => setSelectedTxn(null)}>
            <div className="bookingModal-card" onClick={(e) => e.stopPropagation()}>
              <div className="bookingModal-header">
                <h3>Receipt Audit: {selectedTxn.transactionId}</h3>
                <button className="closeModal-btn" onClick={() => setSelectedTxn(null)}>
                  &times;
                </button>
              </div>

              <div className="bookingModal-body">
                <div className="bookingModal-grid">
                  <div className="bookingModal-infoBlock">
                    <label>Customer Identity</label>
                    <p><strong>Name:</strong> {selectedTxn.client?.fullName}</p>
                    <p><strong>Email:</strong> {selectedTxn.client?.email}</p>
                  </div>
                  <div className="bookingModal-infoBlock">
                    <label>Allocation Matrix</label>
                    <p><strong>Assigned Booking:</strong> {selectedTxn.booking?.bookingId}</p>
                    <p><strong>Payment Stage:</strong> {selectedTxn.paymentStage === "Advance" ? "Advance Payment" : "Balance Payment"}</p>
                    <p><strong>Method Used:</strong> {selectedTxn.method}</p>
                    <p><strong>Reference No:</strong> {selectedTxn.referenceNumber}</p>
                  </div>
                </div>

                <div className="payment-receipt-preview-section">
                  <label>Uploaded Verification Proof</label>
                  {selectedTxn.receiptUrl ? (
                    <div className="receipt-image-card">
                      <img src={receiptUrl(selectedTxn.receiptUrl)} alt="Transaction Receipt Upload" />
                      <div className="receipt-overlay-actions">
                        <button
                          type="button"
                          className="download-btn"
                          onClick={() => handleDownloadReceipt(selectedTxn.receiptUrl)}
                          disabled={downloadingReceipt}
                        >
                          <Download size={15} />
                          {downloadingReceipt ? "Downloading..." : "Download Proof Screen"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="no-receipt-card">
                      <FileText size={30} className="muted-icon" />
                      <span>No receipt was attached to this transaction.</span>
                    </div>
                  )}
                </div>

                {selectedTxn.status === "Refunded" && selectedTxn.refundReason && (
                  <div className="bookingModal-infoBlock" style={{ marginTop: "15px" }}>
                    <label>Refund Reason</label>
                    <p className="ledger-notes">{selectedTxn.refundReason}</p>
                    {selectedTxn.refundedAmount != null && (
                      <p className="ledger-notes" style={{ marginTop: "8px" }}>
                        Refunded ₹{selectedTxn.refundedAmount.toLocaleString()} of ₹{selectedTxn.amount.toLocaleString()}
                      </p>
                    )}
                  </div>
                )}

                <div className="bookingModal-totalPrice">
                  <span>Calculated Net Credit:</span>
                  <span className="price-tag">₹{selectedTxn.amount.toLocaleString()}</span>
                </div>
              </div>

              <div className="bookingModal-footer">
                {selectedTxn.status === "Pending" && (
                  <>
                    <button
                      className="btn-approve-submit"
                      onClick={() => handleVerifyPayment(selectedTxn._id)}
                      disabled={actionLoadingId === selectedTxn._id}
                    >
                      Approve Ledger Entry
                    </button>
                    <button
                      className="btn-reject-trigger"
                      onClick={() => handleRejectPayment(selectedTxn._id)}
                      disabled={actionLoadingId === selectedTxn._id}
                    >
                      Flag Failed
                    </button>
                  </>
                )}

                {selectedTxn.status === "Success" && (
                  selectedTxn.booking?.status === "Closed" ? (
                    <span className="pending-note">
                      This booking is closed and archived — refunds are not permitted.
                    </span>
                  ) : (
                    <button
                      className="btn-reject-trigger"
                      onClick={() => openRefundModal(selectedTxn)}
                    >
                      Process Refund
                    </button>
                  )
                )}

                <button className="bookingModal-cancelBtn" onClick={() => setSelectedTxn(null)}>
                  Dismiss Audit
                </button>
              </div>
            </div>
          </div>
        )}

        {refundModal.isOpen && (
          <div className="bookingModal-overlay">
            <div className="bookingModal-card confirmation-mini" onClick={(e) => e.stopPropagation()}>
              <div className="bookingModal-body text-center">
                <AlertTriangle size={40} className="warning-icon-svg" />
                <h3>Process Ledger Refund</h3>
                <p>
                  Refunding {refundModal.stage === "Advance" ? "advance" : "balance"} payment for
                  client <strong>{refundModal.clientName}</strong>. Paid amount: ₹{refundModal.maxAmount.toLocaleString()}
                </p>

                <div style={{ textAlign: "left", marginTop: "16px" }}>
                  <label style={{ display: "block", marginBottom: "6px", fontSize: "0.85rem", fontWeight: 600 }}>
                    Refund Amount (₹) *
                  </label>
                  <input
                    type="number"
                    className="refund-amount-input"
                    min="1"
                    max={refundModal.maxAmount}
                    value={refundModal.amount}
                    onChange={(e) => handleRefundAmountChange(e.target.value)}
                  />
                  {refundErrors.amount && <small className="error-text">{refundErrors.amount}</small>}
                  <small className="field-hint-dark">
                    Leave at full amount (₹{refundModal.maxAmount.toLocaleString()}) for a full refund, or lower it for a partial refund.
                  </small>
                </div>

                <div style={{ textAlign: "left", marginTop: "16px" }}>
                  <label style={{ display: "block", marginBottom: "6px", fontSize: "0.85rem", fontWeight: 600 }}>
                    Reason for Refund *
                  </label>
                  <textarea
                    className="refund-reason-input"
                    rows="3"
                    placeholder="e.g. Client requested cancellation due to a scheduling conflict"
                    value={refundModal.reason}
                    onChange={(e) => handleRefundReasonChange(e.target.value)}
                  />
                  {refundErrors.reason && <small className="error-text">{refundErrors.reason}</small>}
                </div>

                <div className="confirmation-actions">
                  <button
                    className="btn-danger-execute"
                    onClick={handleProcessRefund}
                    disabled={actionLoadingId === refundModal.txnId}
                  >
                    {actionLoadingId === refundModal.txnId ? "Processing..." : "Yes, Process Refund"}
                  </button>
                  <button className="bookingModal-cancelBtn" onClick={closeRefundModal}>
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

export default ManagePayments;