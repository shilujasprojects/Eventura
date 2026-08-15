import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "./Clients.css";
import AdminLayout from "../../Pages/Admin/Layout/AdminLayout";
import { Ban, Eye, Search, UserCheck, Users, ChevronLeft, ChevronRight } from "lucide-react";

const BASE_URL = "http://localhost:5000";
const ROWS_PER_PAGE = 10;

const getInitials = (name) => (name || "").trim().charAt(0).toUpperCase() || "?";

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const ManageClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Active");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchClients = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/clients`);
      setClients(res.data.data);
    } catch (error) {
      toast.error("Could not load client records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Whenever the tab or search changes, the result set is different —
  // jump back to page 1 so we don't land on an empty/out-of-range page.
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  const handleToggleStatus = async (clientId) => {
    setTogglingId(clientId);
    try {
      const res = await axios.patch(`${BASE_URL}/api/admin/clients/${clientId}/status`);
      const updatedStatus = res.data.data.status;

      setClients((prev) =>
        prev.map((c) => (c._id === clientId ? { ...c, status: updatedStatus } : c))
      );

      if (selectedClient && selectedClient._id === clientId) {
        setSelectedClient((prev) => ({ ...prev, status: updatedStatus }));
      }

      toast.success(
        updatedStatus === "Suspended" ? "Client account suspended." : "Client account activated."
      );
    } catch (error) {
      toast.error("Could not update this client's status. Please try again.");
    } finally {
      setTogglingId(null);
    }
  };

  const filteredClients = clients.filter((client) => {
    const matchesTab = client.status === activeTab;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      client.fullName.toLowerCase().includes(query) ||
      client.email.toLowerCase().includes(query) ||
      client.clientId.toLowerCase().includes(query);
    return matchesTab && matchesSearch;
  });

  // ── Pagination ──────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(filteredClients.length / ROWS_PER_PAGE));
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Shared icon-action block — same tooltip-on-hover pattern used
  // on the Packages page (data-tooltip + button::after in CSS)
  const ActionButtons = ({ client }) => (
    <div className="allClients-actions">
      <button
        className="client-action-btn view-btn"
        data-tooltip="View Profile"
        aria-label="View Profile"
        onClick={() => setSelectedClient(client)}
      >
        <Eye size={16} />
      </button>
      <button
        className={`client-action-btn toggle-btn ${client.status === "Active" ? "suspend" : "activate"}`}
        data-tooltip={client.status === "Active" ? "Suspend Account" : "Activate Account"}
        aria-label={client.status === "Active" ? "Suspend Account" : "Activate Account"}
        onClick={() => handleToggleStatus(client._id)}
        disabled={togglingId === client._id}
      >
        {togglingId === client._id ? (
          <span className="btn-spinner" />
        ) : client.status === "Active" ? (
          <Ban size={16} />
        ) : (
          <UserCheck size={16} />
        )}
      </button>
    </div>
  );

  if (loading) {
    return (
      <AdminLayout>
        <p className="clients-loading">Loading client records...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="allClients">
        <div className="allClients-header">
          <div>
            <h2>Client Management</h2>
            <p>Monitor customer account analytics, tracking histories, and structural profiles.</p>
          </div>
        </div>

        <div className="allClients-searchBox">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search clients by ID, name, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="allClients-tabs">
          <button
            className={activeTab === "Active" ? "tab-btn active" : "tab-btn"}
            onClick={() => setActiveTab("Active")}
          >
            Active Accounts{" "}
            <span className="tab-count">{clients.filter((c) => c.status === "Active").length}</span>
          </button>
          <button
            className={activeTab === "Suspended" ? "tab-btn active" : "tab-btn"}
            onClick={() => setActiveTab("Suspended")}
          >
            Suspended / Flagged{" "}
            <span className="tab-count">{clients.filter((c) => c.status === "Suspended").length}</span>
          </button>
        </div>

        <div className="allClients-tableWrapper">
          {filteredClients.length === 0 ? (
            <div className="table-empty-state">
              <div className="empty-icon">
                <Users size={40} />
              </div>
              <h3>No Client Profiles Found</h3>
              <p>No customer records match your specified lookup parameters.</p>
            </div>
          ) : (
            <>
              {/* ---------- TABLE VIEW (large & medium screens) ---------- */}
              <div className="allClients-tableScroll">
                <table className="allClients-table">
                  <thead>
                    <tr>
                      <th>Client Profile</th>
                      <th className="col-contact">Contact Details</th>
                      <th>Total Bookings</th>
                      <th>Lifetime Revenue</th>
                      <th className="col-joined">Joined Date</th>
                      <th style={{ textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedClients.map((client) => (
                      <tr key={client._id}>
                        <td>
                          <div className="client-profile-cell">
                            <div className="client-avatar-fallback">{getInitials(client.fullName)}</div>
                            <div className="client-title-meta">
                              <strong className="client-primary-name">{client.fullName}</strong>
                              <small className="client-uid-tag">{client.clientId}</small>
                            </div>
                          </div>
                        </td>
                        <td className="col-contact">
                          <div className="client-contact-meta">
                            <span>{client.email}</span>
                            <small>{client.phone || "Not added"}</small>
                          </div>
                        </td>
                        <td>
                          <span className="client-count-badge">{client.totalBookings} Events</span>
                        </td>
                        <td className="gold-text-value">₹ {client.totalSpent.toLocaleString()}</td>
                        <td className="col-joined">{formatDate(client.createdAt)}</td>
                        <td>
                          <ActionButtons client={client} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ---------- CARD VIEW (small screens only) ---------- */}
              <div className="allClients-cardList">
                {paginatedClients.map((client) => (
                  <div className="allClients-card" key={client._id}>
                    <div className="allClients-card-top">
                      <div className="client-profile-cell">
                        <div className="client-avatar-fallback">{getInitials(client.fullName)}</div>
                        <div className="client-title-meta">
                          <strong className="client-primary-name">{client.fullName}</strong>
                          <small className="client-uid-tag">{client.clientId}</small>
                        </div>
                      </div>
                      <span className={`status-pill-badge ${client.status.toLowerCase()}`}>
                        {client.status}
                      </span>
                    </div>

                    <div className="allClients-card-contact">
                      <span>{client.email}</span>
                      <small>{client.phone || "Not added"}</small>
                    </div>

                    <div className="allClients-card-meta">
                      <span className="client-count-badge">{client.totalBookings} Events</span>
                      <span className="gold-text-value">₹ {client.totalSpent.toLocaleString()}</span>
                    </div>

                    <div className="allClients-card-footer">
                      <span className="allClients-card-date">
                        Joined: {formatDate(client.createdAt)}
                      </span>
                      <ActionButtons client={client} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="allClients-pagination">
                <span className="pagination-info">
                  Showing {(currentPage - 1) * ROWS_PER_PAGE + 1}–
                  {Math.min(currentPage * ROWS_PER_PAGE, filteredClients.length)} of {filteredClients.length}
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

        {selectedClient && (
          <div className="clientModal-overlay" onClick={() => setSelectedClient(null)}>
            <div className="clientModal-card" onClick={(e) => e.stopPropagation()}>
              <div className="clientModal-header">
                <h3>Client Profile Manifest</h3>
                <button className="closeModal-btn" onClick={() => setSelectedClient(null)}>
                  &times;
                </button>
              </div>

              <div className="clientModal-body">
                <div className="clientModal-hero">
                  <div className="clientModal-avatarFallback">{getInitials(selectedClient.fullName)}</div>
                  <div className="clientModal-person">
                    <h4>{selectedClient.fullName}</h4>
                    <p>{selectedClient.email} | {selectedClient.phone || "Not added"}</p>
                    <small className="client-uid-tag">{selectedClient.clientId}</small>
                    <span className={`status-pill-badge ${selectedClient.status.toLowerCase()}`}>
                      {selectedClient.status}
                    </span>
                  </div>
                </div>

                <div className="clientModal-metricsGrid">
                  <div className="metric-box">
                    <span className="metric-title">Total Bookings</span>
                    <span className="metric-value">{selectedClient.totalBookings}</span>
                  </div>
                  <div className="metric-box">
                    <span className="metric-title">Total Capital Invested</span>
                    <span className="metric-value gold-text-value">
                      ₹ {selectedClient.totalSpent.toLocaleString()}
                    </span>
                  </div>
                  <div className="metric-box">
                    <span className="metric-title">Customer Since</span>
                    <span className="metric-value" style={{ fontSize: "1.1rem" }}>
                      {formatDate(selectedClient.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="clientModal-historySection">
                  <h5>System Booking Logs</h5>
                  {selectedClient.history.length === 0 ? (
                    <p className="no-history-txt">
                      This individual hasn't scheduled any Eventura bookings yet.
                    </p>
                  ) : (
                    <div className="history-list">
                      {selectedClient.history.map((log) => (
                        <div key={log.bookingId} className="history-item-strip">
                          <div className="history-main-info">
                            <strong>{log.eventName}</strong>
                            <small>{log.bookingId} • {formatDate(log.date)}</small>
                          </div>
                          <div className="history-price-status">
                            <strong>₹{log.amount.toLocaleString()}</strong>
                            <span className="history-status-lbl">{log.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="clientModal-footer">
                <button
                  className={`client-action-btn toggle-btn ${
                    selectedClient.status === "Active" ? "suspend" : "activate"
                  }`}
                  onClick={() => handleToggleStatus(selectedClient._id)}
                  disabled={togglingId === selectedClient._id}
                >
                  {togglingId === selectedClient._id
                    ? "Updating..."
                    : selectedClient.status === "Active"
                    ? "Suspend Account"
                    : "Activate Account"}
                </button>
                <button className="clientModal-closeBtn" onClick={() => setSelectedClient(null)}>
                  Close Profile
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </AdminLayout>
  );
};

export default ManageClients;