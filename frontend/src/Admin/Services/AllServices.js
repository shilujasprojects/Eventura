import React from "react";
import { Search, Plus, Eye, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import "./AllServices.css";

const AllServices = () => {
  const navigate = useNavigate();

  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete Service?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("Delete:", id);

        Swal.fire("Deleted!", "Service has been deleted.", "success");
      }
    });
  };

  const services = [
    {
      id: 1,
      name: "Photography",
      price: "₹10,000",
      status: "Active",
    },
    {
      id: 2,
      name: "Catering",
      price: "₹35,000",
      status: "Active",
    },
    {
      id: 3,
      name: "Decoration",
      price: "₹20,000",
      status: "Inactive",
    },
  ];

  return (
    <div className="allServices">
      <div className="allServices-header">
        <div>
          <h2>All Services</h2>
          <p>Manage all services</p>
        </div>

        <button
          className="allServices-addBtn"
          onClick={() => navigate("/addService")}
        >
          <Plus size={18} />
          Add Service
        </button>
      </div>

      <div className="allServices-searchBox">
        <Search size={18} />

        <input type="text" placeholder="Search services..." />
      </div>

      <div className="allServices-tableWrapper">
        <table className="allServices-table">
          <thead>
            <tr>
              <th>Service Name</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {services.map((service) => (
              <tr key={service.id}>
                <td>{service.name}</td>

                <td>{service.price}</td>

                <td>
                  <span
                    className={
                      service.status === "Active"
                        ? "allServices-status active"
                        : "allServices-status inactive"
                    }
                  >
                    {service.status}
                  </span>
                </td>

                <td>
                  <div className="allServices-actions">
                    <button
                      onClick={() => navigate(`/viewService/${service.id}`)}
                    >
                      <Eye size={16} />
                    </button>

                    <button
                      onClick={() => navigate(`/editService/${service.id}`)}
                    >
                      <Pencil size={16} />
                    </button>

                    <button onClick={() => handleDelete(service.id)}>
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

export default AllServices;
