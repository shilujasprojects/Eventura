import React, { useState, useEffect, useRef } from "react";
import {
  Menu,
  Bell,
  Search,
  Settings,
  Loader2,
  X
} from "lucide-react";
import axios from "axios";
import "./Admin.css";
import { useNavigate, useSearchParams } from "react-router-dom";

const AdminNavbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchText, setSearchText] = useState(searchParams.get("search") || "");
  const [adminName, setAdminName] = useState("Admin");
  
  // New States for Search Results
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const searchRef = useRef(null);

  useEffect(() => {
    const fetchAdminName = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/settings");
        const name = res.data?.data?.account?.adminName;
        if (name) setAdminName(name);
      } catch (error) {
        console.error("Failed to load admin profile:", error.message);
      }
    };
    fetchAdminName();
  }, []);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced API Call
  useEffect(() => {
    const timer = setTimeout(async () => {
      const params = new URLSearchParams(searchParams);
      
      if (searchText.trim().length >= 2) {
        params.set("search", searchText.trim());
        setSearchParams(params, { replace: true });
        
        setIsSearching(true);
        setShowDropdown(true);
        try {
          const res = await axios.get(`http://localhost:5000/api/dashboard/search?q=${searchText.trim()}`);
          setSearchResults(res.data.data);
        } catch (error) {
          console.error("Search failed", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        params.delete("search");
        setSearchParams(params, { replace: true });
        setSearchResults(null);
        setShowDropdown(false);
      }
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  const getInitials = (name) => {
    if (!name) return "AD";
    return name.trim().split(/\s+/).map((word) => word[0]).join("").toUpperCase().slice(0, 2);
  };

  const clearSearch = () => {
    setSearchText("");
    setSearchResults(null);
    setShowDropdown(false);
  };

  return (
    <nav className="admin-navbar">
      {/* Left Side */}
      <div className="navbar-left">
        <div className="navbar-left-top">
          <button className="hamburger-btn" onClick={onMenuClick}>
            <Menu size={22} />
          </button>
          <h2>Dashboard</h2>
        </div>
        <p>Welcome back, {adminName} 👋</p>
      </div>

      {/* Right Side */}
      <div className="navbar-right">
        
        {/* Search Container */}
        <div className="search-container" ref={searchRef}>
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onFocus={() => {
                if (searchText.trim().length >= 2) setShowDropdown(true);
              }}
            />
            {searchText && (
              <button className="clear-search-btn" onClick={clearSearch}>
                <X size={16} />
              </button>
            )}
          </div>

          {/* Search Dropdown Results */}
          {showDropdown && (
            <div className="search-dropdown">
              {isSearching ? (
                <div className="search-loading">
                  <Loader2 size={20} className="spinner" />
                  <span>Searching...</span>
                </div>
              ) : searchResults ? (
                <div className="search-results-wrapper">
                  
                  {/* Clients */}
                  {searchResults.clients?.length > 0 && (
                    <div className="search-category">
                      <h6>Clients</h6>
                      {searchResults.clients.map(client => (
                        <div key={client._id} className="search-item" onClick={() => navigate(`/admin/clients/${client._id}`)}>
                          <strong>{client.fullName}</strong>
                          <span>{client.clientId} • {client.phone || client.email}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Bookings */}
                  {searchResults.bookings?.length > 0 && (
                    <div className="search-category">
                      <h6>Bookings</h6>
                      {searchResults.bookings.map(booking => (
                        <div key={booking._id} className="search-item" onClick={() => navigate(`/admin/bookings/${booking._id}`)}>
                          <strong>{booking.bookingId}</strong>
                          <span>{booking.fullName} • {booking.city}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Transactions */}
                  {searchResults.transactions?.length > 0 && (
                    <div className="search-category">
                      <h6>Transactions</h6>
                      {searchResults.transactions.map(txn => (
                        <div key={txn._id} className="search-item" onClick={() => navigate(`/admin/payments/${txn._id}`)}>
                          <strong>{txn.transactionId}</strong>
                          <span>₹{txn.amount} • {txn.referenceNumber}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Empty State */}
                  {!searchResults.clients?.length && !searchResults.bookings?.length && !searchResults.transactions?.length && !searchResults.inquiries?.length && (
                    <div className="search-no-results">
                      No results found for "{searchText}"
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          )}
        </div>

        <button className="icon-btn" onClick={() => navigate('/admin/notifications')}>
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>

        <button className="icon-btn" onClick={() => navigate('/settings')}>
          <Settings size={20} />
        </button>

        <div className="profile-section">
          <div className="profile-avatar">{getInitials(adminName)}</div>
          <div className="profile-details">
            <h6>{adminName}</h6>
            <span>Super Admin</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;