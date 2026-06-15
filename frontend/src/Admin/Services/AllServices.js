import React from "react";
import {
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import "./Services.css";
import AdminLayout from "../../Pages/Admin/Layout/AdminLayout";

const AllServices = () => {
  const navigate = useNavigate();

  const services = [
    {
      id: 1,
      image: "https://picsum.photos/80?1",
      name: "Photography",
      category: "Media",
      description: "Professional wedding photography",
      price: "₹10,000",
      galleryCount: 12,
      status: "Active",
      createdAt: "10 Jun 2026",
    },
    {
      id: 2,
      image: "https://picsum.photos/80?2",
      name: "Catering",
      category: "Food",
      description: "Premium catering service",
      price: "₹35,000",
      galleryCount: 8,
      status: "Active",
      createdAt: "08 Jun 2026",
    },
    {
      id: 3,
      image: "https://picsum.photos/80?3",
      name: "Decoration",
      category: "Decor",
      description: "Luxury event decoration",
      price: "₹20,000",
      galleryCount: 15,
      status: "Inactive",
      createdAt: "05 Jun 2026",
    },
  ];

  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete Service?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(id);

        Swal.fire(
          "Deleted!",
          "Service deleted successfully.",
          "success"
        );
      }
    });
  };

  return (
    <AdminLayout>
      <div className="allServices">

      <div className="allServices-header">

        <div>
          <h2>All Services</h2>
          <p>Manage all Eventura services</p>
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

        <input
          type="text"
          placeholder="Search services..."
        />

      </div>

      <div className="allServices-tableWrapper">

        <table className="allServices-table">

          <thead>
            <tr>
              <th>Image</th>
              <th>Service</th>
              <th>Description</th>
              <th>Price</th>
              <th>Gallery</th>
              <th>Status</th>
              <th>CreatedAt</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {services.map((service) => (
              <tr key={service.id}>

                <td>
                  <img
                    src={service.image}
                    alt={service.name}
                    className="allServices-image"
                  />
                </td>

                <td>
                  <div className="allServices-serviceInfo">
                    <h4>{service.name}</h4>
                  </div>
                </td>

                

                <td className="allServices-description">
                  {service.description}
                </td>

                <td>{service.price}</td>

                <td>
                  <span className="allServices-galleryBadge">
                    {service.galleryCount} Images
                  </span>
                </td>

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

                <td>{service.createdAt}</td>

                <td>

                  <div className="allServices-actions">

                    <button
                      onClick={() =>
                        navigate(`/viewService/${service.id}`)
                      }
                    >
                      <Eye size={16} />
                    </button>

                    <button
                      onClick={() =>
                        navigate(`/editService/${service.id}`)
                      }
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(service.id)
                      }
                    >
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
  );
};

export default AllServices;