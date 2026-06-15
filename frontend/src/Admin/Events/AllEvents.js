import React from "react";
import { Search, Plus, Eye, Pencil, Trash2 } from "lucide-react";

import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import "./Events.css";
import AdminLayout from "../../Pages/Admin/Layout/AdminLayout";

const AllEvents = () => {
  const navigate = useNavigate();

  const events = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed",
      name: "Beach Wedding",
      category: "Wedding",
      packages: 4,
      price: "₹50,000",
      status: "Active",
      createdAt: "10 Jun 2026",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3",
      name: "Surprise Birthday",
      category: "Birthday",
      packages: 2,
      price: "₹15,000",
      status: "Active",
      createdAt: "08 Jun 2026",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865",
      name: "Corporate Gala",
      category: "Corporate",
      packages: 6,
      price: "₹80,000",
      status: "Inactive",
      createdAt: "05 Jun 2026",
    },
  ];

  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete Event?",
      text: "This event will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("Delete Event:", id);

        Swal.fire({
          icon: "success",
          title: "Deleted",
          text: "Event deleted successfully.",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  return (
    <>
      <AdminLayout>
        <div className="allEvents">
          <div className="allEvents-header">
            <div>
              <h2>All Events</h2>
              <p>Manage all Eventura events</p>
            </div>

            <button
              className="allEvents-addBtn"
              onClick={() => navigate("/addEvents")}
            >
              <Plus size={18} />
              Add Event
            </button>
          </div>

          <div className="allEvents-searchBox">
            <Search size={18} />

            <input type="text" placeholder="Search events..." />
          </div>

          <div className="allEvents-tableWrapper">
            <table className="allEvents-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Event Name</th>
                  <th>Category</th>
                  <th>Packages</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>CreatedAt</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {events.map((event) => (
                  <tr key={event.id}>
                    <td>
                      <img
                        src={event.image}
                        alt={event.name}
                        className="allEvents-image"
                      />
                    </td>

                    <td>{event.name}</td>

                    <td>{event.category}</td>

                    <td>
                      <span className="allEvents-packageCount">
                        {event.packages} Packages
                      </span>
                    </td>

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

                    <td>{event.createdAt}</td>

                    <td>
                      <div className="allEvents-actions">
                        <button
                          onClick={() => navigate(`/viewEvents/${event.id}`)}
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          onClick={() => navigate(`/editEvents/${event.id}`)}
                        >
                          <Pencil size={16} />
                        </button>

                        <button onClick={() => handleDelete(event.id)}>
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
      </AdminLayout>
    </>
  );
};

export default AllEvents;
