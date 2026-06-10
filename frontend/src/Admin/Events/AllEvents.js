import React from "react";
import {
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import "./AllEvents.css";

const AllEvents = () => {

  const navigate = useNavigate();

  const events = [
    {
      id: 1,
      name: "Beach Wedding",
      category: "Wedding",
      price: "₹50,000",
      status: "Active",
    },
    {
      id: 2,
      name: "Surprise Birthday",
      category: "Birthday",
      price: "₹15,000",
      status: "Active",
    },
    {
      id: 3,
      name: "Corporate Gala",
      category: "Corporate",
      price: "₹80,000",
      status: "Inactive",
    },
  ];

  return (
    <div className="allEvents">

      {/* Header */}
      <div className="allEvents-header">

        <div>
          <h2>All Events</h2>
          <p>Manage all Eventura events</p>
        </div>

        <button className="allEvents-addBtn" onClick={() => navigate('/addEvents')}>
          <Plus size={18} />
          Add Event
        </button>

      </div>

      {/* Search */}
      <div className="allEvents-searchBox">

        <Search size={18} />

        <input
          type="text"
          placeholder="Search events..."
        />

      </div>

      {/* Table */}
      <div className="allEvents-tableWrapper">

        <table className="allEvents-table">

          <thead>
            <tr>
              <th>Event Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {events.map((event) => (
              <tr key={event.id}>

                <td>{event.name}</td>
                <td>{event.category}</td>

                <td>{event.price}</td>

                <td>
                  <span
                    className={
                      event.status === "Active"
                        ? "allEvents-status active"
                        : "allEvents-status inactive"
                    }
                  >
                    {event.status}
                  </span>
                </td>

                <td>
                  <div className="allEvents-actions">

                    <button>
                      <Eye size={16} />
                    </button>

                    <button>
                      <Pencil size={16} />
                    </button>

                    <button>
                      <Trash2 size={16} />
                    </button>

                  </div>
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default AllEvents;