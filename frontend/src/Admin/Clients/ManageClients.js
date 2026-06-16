import React, { useState } from "react";
import "./Clients.css";
import AdminLayout from "../../Pages/Admin/Layout/AdminLayout";
import { Ban, Eye, Search, UserCheck, Users, Zap } from "lucide-react";

// Mock data directly linking client records to your booking module metrics
const INITIAL_CLIENTS = [
  {
    id: "EV-CLI-2026-001",
    name: "Rahul Sharma",
    email: "rahul@example.com",
    phone: "+91 98765 43210",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
    joinedDate: "12 Jan 2026",
    totalBookings: 3,
    totalSpent: 180000,
    status: "Active",
    history: [
      {
        bookingId: "EV-2026-9401",
        eventName: "Royal Heritage Wedding",
        date: "24 Oct 2026",
        amount: 145000,
        status: "Confirmed",
      },
      {
        bookingId: "EV-2026-8104",
        eventName: "Neon Beats Birthday",
        date: "05 Nov 2026",
        amount: 35000,
        status: "Completed",
      },
    ],
  },
  {
    id: "EV-CLI-2026-002",
    name: "Anita Joseph",
    email: "anita@example.com",
    phone: "+91 94471 23456",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    joinedDate: "10 Feb 2026",
    totalBookings: 1,
    totalSpent: 35000,
    status: "Active",
    history: [
      {
        bookingId: "EV-2026-9402",
        eventName: "Standard Party Pack",
        date: "15 Dec 2026",
        amount: 35000,
        status: "Confirmed",
      },
    ],
  },
  {
    id: "EV-CLI-2026-003",
    name: "Vikram Malhotra",
    email: "vikram@example.com",
    phone: "+91 99955 88811",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
    joinedDate: "05 Mar 2026",
    totalBookings: 0,
    totalSpent: 0,
    status: "Suspended",
    history: [],
  },
];

const ManageClients = () => {
  const [clients, setClients] = useState(INITIAL_CLIENTS);
  const [activeTab, setActiveTab] = useState("Active"); // Options: Active, Suspended
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);

  // Toggle client account status between Active and Suspended
  const handleToggleStatus = (clientId) => {
    const updated = clients.map((client) => {
      if (client.id === clientId) {
        const nextStatus = client.status === "Active" ? "Suspended" : "Active";
        return { ...client, status: nextStatus };
      }
      return client;
    });
    setClients(updated);
    // Sync active modal state if open
    if (selectedClient && selectedClient.id === clientId) {
      setSelectedClient({
        ...selectedClient,
        status: selectedClient.status === "Active" ? "Suspended" : "Active",
      });
    }
  };

  // Filter criteria: match the selected tab and the search query string
  const filteredClients = clients.filter((client) => {
    const matchesTab = client.status === activeTab;
    const matchesSearch =
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <>
      <AdminLayout>
        <div className="allClients">
          {/* Title Header Block */}
          <div className="allClients-header">
            <div>
              <h2>Client Management</h2>
              <p>
                Monitor customer account analytics, tracking histories, and
                structural profiles.
              </p>
            </div>
          </div>

          {/* Global Search Component */}
          <div className="allClients-searchBox">
            <span className="search-icon">
                <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search clients by ID, name, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Basic Filter Navigation Tabs */}
          <div className="allClients-tabs">
            <button
              className={activeTab === "Active" ? "tab-btn active" : "tab-btn"}
              onClick={() => setActiveTab("Active")}
            >
              Active Accounts{" "}
              <span className="tab-count">
                {clients.filter((c) => c.status === "Active").length}
              </span>
            </button>
            <button
              className={
                activeTab === "Suspended" ? "tab-btn active" : "tab-btn"
              }
              onClick={() => setActiveTab("Suspended")}
            >
              Suspended / Flagged{" "}
              <span className="tab-count">
                {clients.filter((c) => c.status === "Suspended").length}
              </span>
            </button>
          </div>

          {/* Core Customer Metrics Data Table */}
          <div className="allClients-tableWrapper">
            {filteredClients.length === 0 ? (
              <div className="table-empty-state">
                <div className="empty-icon">
                    <Users size={56} />
                </div>
                <h3>No Client Profiles Found</h3>
                <p>
                  No customer records match your specified lookup parameters.
                </p>
              </div>
            ) : (
              <table className="allClients-table">
                <thead>
                  <tr>
                    <th>Client Profile</th>
                    <th>Contact Details</th>
                    <th>Total Bookings</th>
                    <th>Lifetime Revenue</th>
                    <th>Joined Date</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map((client) => (
                    <tr key={client.id}>
                      <td>
                        <div className="client-profile-cell">
                          <img
                            src={client.avatar}
                            alt={client.name}
                            className="client-table-avatar"
                          />
                          <div className="client-title-meta">
                            <strong className="client-primary-name">
                              {client.name}
                            </strong>
                            <small className="client-uid-tag">
                              {client.id}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="client-contact-meta">
                          <span>{client.email}</span>
                          <small>{client.phone}</small>
                        </div>
                      </td>
                      <td>
                        <span className="client-count-badge">
                          {client.totalBookings} Events
                        </span>
                      </td>
                      <td className="gold-text-value">
                        ₹{client.totalSpent.toLocaleString()}
                      </td>
                      <td>{client.joinedDate}</td>
                      <td>
                        <div className="allClients-actions">
                          <button
                            className="client-action-btn view-btn"
                            onClick={() => setSelectedClient(client)}
                            title="Inspect Profile"
                          >
                            <Eye size={16} />&nbsp;  View
                          </button>
                          <button
  className={`client-action-btn toggle-btn ${
    client.status === "Active" ? "suspend" : "activate"
  }`}
  onClick={() => handleToggleStatus(client.id)}
>
  {client.status === "Active" ? (
    <>
      <Ban size={16} />&nbsp;
      Suspend
    </>
  ) : (
    <>
      <UserCheck size={16} />&nbsp;
      Activate
    </>
  )}
</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Profile Detail Manifest Lightbox Modal */}
          {selectedClient && (
            <div
              className="clientModal-overlay"
              onClick={() => setSelectedClient(null)}
            >
              <div
                className="clientModal-card"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="clientModal-header">
                  <h3>Client Profile Manifest</h3>
                  <button
                    className="closeModal-btn"
                    onClick={() => setSelectedClient(null)}
                  >
                    &times;
                  </button>
                </div>

                <div className="clientModal-body">
                  {/* Profile Card Summary Row */}
                  <div className="clientModal-hero">
                    <img
                      src={selectedClient.avatar}
                      alt={selectedClient.name}
                    />
                    <div>
                      <h4>{selectedClient.name}</h4>
                      <p>
                        {selectedClient.email} | {selectedClient.phone}
                      </p>
                      <small className="client-uid-tag">
                        {selectedClient.id}
                      </small>
                      <span
                        className={`status-pill-badge ${selectedClient.status.toLowerCase()}`}
                      >
                        {selectedClient.status}
                      </span>
                    </div>
                  </div>

                  {/* Aggregated Performance Metric Grid Cards */}
                  <div className="clientModal-metricsGrid">
                    <div className="metric-box">
                      <span className="metric-title">Total Bookings</span>
                      <span className="metric-value">
                        {selectedClient.totalBookings}
                      </span>
                    </div>
                    <div className="metric-box">
                      <span className="metric-title">
                        Total Capital Invested
                      </span>
                      <span className="metric-value gold-text-value">
                        ₹{selectedClient.totalSpent.toLocaleString()}
                      </span>
                    </div>
                    <div className="metric-box">
                      <span className="metric-title">Customer Since</span>
                      <span
                        className="metric-value"
                        style={{ fontSize: "1.1rem" }}
                      >
                        {selectedClient.joinedDate}
                      </span>
                    </div>
                  </div>

                  {/* Cross-Referenced Booking Engine History Module List */}
                  <div className="clientModal-historySection">
                    <h5>System Booking Logs</h5>
                    {selectedClient.history.length === 0 ? (
                      <p className="no-history-txt">
                        This individual hasn't scheduled any Eventura project
                        allocations yet.
                      </p>
                    ) : (
                      <div className="history-list">
                        {selectedClient.history.map((log) => (
                          <div
                            key={log.bookingId}
                            className="history-item-strip"
                          >
                            <div className="history-main-info">
                              <strong>{log.eventName}</strong>
                              <small>
                                {log.bookingId} • {log.date}
                              </small>
                            </div>
                            <div className="history-price-status">
                              <strong>₹{log.amount.toLocaleString()}</strong>
                              <span className="history-status-lbl">
                                {log.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="clientModal-footer">
                  <button
                    className={`client-action-btn toggle-btn ${selectedClient.status === "Active" ? "suspend" : "activate"}`}
                    onClick={() => handleToggleStatus(selectedClient.id)}
                  >
                    {selectedClient.status === "Active"
                      ? "Suspend Account"
                      : "Activate Account"}
                  </button>
                  <button
                    className="clientModal-closeBtn"
                    onClick={() => setSelectedClient(null)}
                  >
                    Close Profile
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </AdminLayout>
    </>
  );
};

export default ManageClients;
