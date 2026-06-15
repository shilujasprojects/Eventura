import React from "react";
import {
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import "./CategoryEvents.css";
import AdminLayout from "../../Pages/Admin/Layout/AdminLayout";

const AllCategoryEvents = () => {
  const navigate = useNavigate();

  const categories = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed",
      name: "Wedding",
      description: "Luxury wedding planning services",
      status: "Active",
      createdAt: "10 Jun 2026",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3",
      name: "Birthday",
      description: "Birthday party arrangements",
      status: "Active",
      createdAt: "08 Jun 2026",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1511578314322-379afb476865",
      name: "Corporate",
      description: "Corporate event management",
      status: "Inactive",
      createdAt: "05 Jun 2026",
    },
  ];

  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete Category?",
      text: "This category will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("Delete Category:", id);

        Swal.fire({
          icon: "success",
          title: "Deleted",
          text: "Category deleted successfully.",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  return (
   <>
    <AdminLayout>
         <div className="allCategory">

      <div className="allCategory-header">

        <div>
          <h2>Event Categories</h2>
          <p>Manage all event categories</p>
        </div>

        <button
          className="allCategory-addBtn"
          onClick={() => navigate("/addCategoryEvent")}
        >
          <Plus size={18} />
          Add Category
        </button>

      </div>

      <div className="allCategory-searchBox">

        <Search size={18} />

        <input
          type="text"
          placeholder="Search categories..."
        />

      </div>

      <div className="allCategory-tableWrapper">

        <table className="allCategory-table">

          <thead>
            <tr>
              <th>Image</th>
              <th>Category Name</th>
              <th>Description</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {categories.map((category) => (
              <tr key={category.id}>

                <td>
                  <img
                    src={category.image}
                    alt={category.name}
                    className="allCategory-image"
                  />
                </td>

                <td>{category.name}</td>

                <td>{category.description}</td>

                <td>
                  <span
                    className={
                      category.status === "Active"
                        ? "allCategory-status active"
                        : "allCategory-status inactive"
                    }
                  >
                    {category.status}
                  </span>
                </td>

                <td>{category.createdAt}</td>

                <td>

                  <div className="allCategory-actions">

                    <button
                      onClick={() =>
                        navigate(`/viewCategoryEvent/${category.id}`)
                      }
                    >
                      <Eye size={16} />
                    </button>

                    <button
                      onClick={() =>
                        navigate(`/editCategoryEvent/${category.id}`)
                      }
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(category.id)
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
   </>
  );
};

export default AllCategoryEvents;