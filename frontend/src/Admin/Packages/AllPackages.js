import React from "react";
import {
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import "./AllPackages.css";
import { useNavigate } from "react-router-dom";

const AllPackages = () => {
  const packages = [
    {
      id: 1,
      name: "Royal Wedding Package",
      category: "Wedding",
      services: 8,
      price: "₹75,000",
      status: "Active",
    },
    {
      id: 2,
      name: "Birthday Premium",
      category: "Birthday",
      services: 5,
      price: "₹25,000",
      status: "Active",
    },
    {
      id: 3,
      name: "Corporate Elite",
      category: "Corporate",
      services: 10,
      price: "₹1,20,000",
      status: "Inactive",
    },
  ];

  const navigate = useNavigate();

  return (
    <div className="allPackages">

      {/* Header */}

      <div className="allPackages-header">

        <div>
          <h2>All Packages</h2>
          <p>Manage all event packages</p>
        </div>

        <button className="allPackages-addBtn" onClick={() =>navigate('/addPackage')}>
          <Plus size={18} />
          Add Package
        </button>

      </div>

      {/* Search */}

      <div className="allPackages-searchBox">

        <Search size={18} />

        <input
          type="text"
          placeholder="Search packages..."
        />

      </div>

      {/* Table */}

      <div className="allPackages-tableWrapper mt-3">

        <table className="allPackages-table">

          <thead>

            <tr>
              <th>Package Name</th>
              <th>Category</th>
              <th>Services</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>

          </thead>

          <tbody>

            {packages.map((pkg) => (
              <tr key={pkg.id}>

                <td>{pkg.name}</td>

                <td>{pkg.category}</td>

                <td>{pkg.services} Services</td>

                <td>{pkg.price}</td>

                <td>

                  <span
                    className={
                      pkg.status === "Active"
                        ? "allPackages-status active"
                        : "allPackages-status inactive"
                    }
                  >
                    {pkg.status}
                  </span>

                </td>

                <td>

                  <div className="allPackages-actions">

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

export default AllPackages;