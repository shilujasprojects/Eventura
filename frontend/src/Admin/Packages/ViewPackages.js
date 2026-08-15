import React, { useState, useEffect } from "react";
import {
  Package,
  Tag,
  IndianRupee,
  CheckCircle,
  ArrowLeft,
  Pencil,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

import "./Packages.css";
import AdminLayout from "../../Pages/Admin/Layout/AdminLayout";

const ViewPackages = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPackage();
  }, [id]);

  const fetchPackage = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/packages/${id}`);
      setPkg(res.data.data);
    } catch {
      toast.error("Failed to load package.");
      navigate("/adminPackages");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="viewPackage">
          <p style={{ color: "#fff7ee" }}>Loading package...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!pkg) return null;
  const originalPrice = Number(pkg.basePrice || 0);
  const discountType = pkg.packageDiscount?.type || "";
  const discountValue = Number(pkg.packageDiscount?.value || 0);

  let finalPrice = originalPrice;

  if (discountType === "Percentage") {
    finalPrice = originalPrice - (originalPrice * discountValue) / 100;
  } else if (discountType === "Flat") {
    finalPrice = originalPrice - discountValue;
  }

  finalPrice = Math.max(0, finalPrice);

  return (
    <AdminLayout>
      <div className="viewPackage">
        <div className="viewPackage-header">
          <div>
            <h2>{pkg.packageName}</h2>
            <p>Package Details & Included Services</p>
          </div>

          <div className="viewPackage-headerActions">
            <button
              className="viewPackage-backBtn"
              onClick={() => navigate("/adminPackages")}
            >
              <ArrowLeft size={18} /> Back
            </button>
            <button
              className="viewPackage-editBtn"
              onClick={() => navigate(`/editPackage/${pkg._id}`)}
            >
              <Pencil size={18} /> Edit Package
            </button>
          </div>
        </div>

        <div className="viewPackage-detailsCard">
          <div className="viewPackage-cardHeader">
            <h2>Package Information</h2>
            <span
              className={`viewPackage-status ${pkg.status === "Active" ? "active" : "inactive"}`}
            >
              {pkg.status}
            </span>
          </div>

          <div className="viewPackage-info">
            <div className="viewPackage-infoItem">
              <Package size={18} />
              <span>{pkg.packageName}</span>
            </div>
            <div className="viewPackage-infoItem">
              <Tag size={18} />
              <span>{pkg.category?.categoryName}</span>
            </div>
            <div className="viewPackage-infoItem">
              <CheckCircle size={18} />
              <span>{pkg.status}</span>
            </div>
            <div className="viewPackage-infoItem">
              <IndianRupee size={18} />
              <span>Base Price : {originalPrice.toLocaleString()}</span>
            </div>
            <div className="viewPackage-infoItem">
              <IndianRupee size={18} />
              <span>
                Discount :
                {discountValue > 0
                  ? discountType === "Percentage"
                    ? ` ${discountValue}%`
                    : ` ₹${discountValue.toLocaleString()}`
                  : " None"}
              </span>
            </div>
            <div className="viewPackage-infoItem">
              <IndianRupee size={18} />
              <span>
                Final Price : <strong>{finalPrice.toLocaleString()}</strong>
              </span>
            </div>
          </div>
        </div>

        <div className="viewPackage-details">
                  <div className="viewPackage-card">
          <h3>Description</h3>
          <p>{pkg.description || "No description provided."}</p>
        </div>

        {pkg.tags?.length > 0 && (
          <div className="viewPackage-card">
            <h3>Tags</h3>
            <div className="viewPackage-services">
              {pkg.tags.map((tag, index) => (
                <span key={index} className="viewPackage-tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="viewPackage-card">
          <h3>Included Services</h3>
          <div className="viewPackage-services">
            {pkg.services.map((s, index) => (
              <span
                key={index}
                className={`viewPackage-service ${s.isOptional ? "optional" : ""}`}
              >
                {s.service?.serviceName}
              </span>
            ))}
          </div>
        </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </AdminLayout>
  );
};

export default ViewPackages;
