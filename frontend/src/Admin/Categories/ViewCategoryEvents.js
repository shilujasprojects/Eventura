import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Pencil,
  CalendarDays,
  FolderOpen,
  CheckCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./CategoryEvents.css";
import AdminLayout from "../../Pages/Admin/Layout/AdminLayout";

const ViewCategoryEvents = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [category, setCategory] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/category/view-category/${id}`
        );
        setCategory(res.data.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load category.");
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [id]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const imageUrl = category?.image
    ? `http://localhost:5000/uploads/${category.image}`
    : null;

  if (loading) {
    return (
      <AdminLayout>
        <p className="view-loading">Loading...</p>
      </AdminLayout>
    );
  }

  if (!category) {
    return (
      <AdminLayout>
        <p className="view-loading">Category not found.</p>
      </AdminLayout>
    );
  }

  return (
    <>
      <AdminLayout>
        <div className="viewCategory">
          {/* Header */}
          <div className="viewCategory-header">
            <div>
              <h2>{category.categoryName}</h2>
              <p>Category Details</p>
            </div>
            <div className="viewCategory-headerActions">
              <span
                className={`viewCategory-status ${
                  category.status === "Active" ? "active" : "inactive"
                }`}
              >
                {category.status}
              </span>
              <button
                className="viewCategory-backBtn"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft size={18} />
                Back
              </button>
              <button
                className="viewCategory-editBtn"
                onClick={() => navigate(`/editCategoryEvent/${category._id}`)}
              >
                <Pencil size={18} />
                Edit
              </button>
            </div>
          </div>

          {/* Banner Image */}
          <div className="viewCategory-bannerCard">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={category.categoryName}
                className="viewCategory-banner-img"
                onClick={() => setLightboxOpen(true)}
                title="Click to enlarge"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
            ) : null}
            <div
              className="viewCategory-no-image-banner"
              style={{ display: imageUrl ? "none" : "flex" }}
            >
              No Image Available
            </div>
          </div>

          {/* Information */}
          <div className="viewCategory-infoCard">
            <h3>Category Information</h3>
            <div className="viewCategory-infoGrid">
              <div className="infoBox">
                <FolderOpen size={20} />
                <span>Category Name</span>
                <strong>{category.categoryName}</strong>
              </div>
              <div className="infoBox">
                <CheckCircle size={20} />
                <span>Status</span>
                <strong>{category.status}</strong>
              </div>
              <div className="infoBox">
                <CalendarDays size={20} />
                <span>Created Date</span>
                <strong>{formatDate(category.createdAt)}</strong>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="viewCategory-descriptionCard">
            <h3>Description</h3>
            <p>{category.description}</p>
          </div>
        </div>

        {/* Lightbox */}
        {lightboxOpen && imageUrl && (
          <div
            className="lightbox-overlay"
            onClick={() => setLightboxOpen(false)}
          >
            <div className="lightbox-box" onClick={(e) => e.stopPropagation()}>
              <button
                className="lightbox-close"
                onClick={() => setLightboxOpen(false)}
              >
                ✕
              </button>
              <img src={imageUrl} alt={category.categoryName} />
            </div>
          </div>
        )}

        <ToastContainer position="top-right" autoClose={3000} />
      </AdminLayout>
    </>
  );
};

export default ViewCategoryEvents;

// import React, { useEffect, useState } from "react";
// import { ArrowLeft, Pencil, Tag, FileText } from "lucide-react";
// import { useNavigate, useParams } from "react-router-dom";
// import { toast } from "react-toastify";
// import axios from "axios";
// import "./CategoryEvents.css";
// import AdminLayout from "../../Pages/Admin/Layout/AdminLayout";

// const ViewCategory = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const [category, setCategory] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchCategory = async () => {
//       try {
//         const res = await axios.get(`/api/category/${id}`);
//         setCategory(res.data);
//       } catch (err) {
//         toast.error("Failed to load category.");
//         navigate("/adminCategories");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCategory();
//   }, [id, navigate]);

//   if (loading) {
//     return (
//       <AdminLayout>
//         <div className="viewCategory-loading">Loading...</div>
//       </AdminLayout>
//     );
//   }

//   if (!category) return null;

//   return (
//     <AdminLayout>
//       <div className="viewCategory">
//         <div className="viewCategory-header">
//           <div>
//             <h2>{category.categoryName}</h2>
//             <p>Category Details</p>
//           </div>

//           <div className="viewCategory-headerActions">
//             <button
//               className="viewCategory-backBtn"
//               onClick={() => navigate("/adminCategories")}
//             >
//               <ArrowLeft size={18} />
//               Back
//             </button>
//             <button
//               className="viewCategory-editBtn"
//               onClick={() => navigate(`/editCategory/${category._id}`)}
//             >
//               <Pencil size={18} />
//               Edit Category
//             </button>
//           </div>
//         </div>

//         <div className="viewCategory-topGrid">
//           <div className="viewCategory-imageCard">
//             <img
//               src={`${process.env.REACT_APP_API_BASE_URL}/uploads/${category.image}`}
//               alt={category.categoryName}
//             />
//           </div>

//           <div className="viewCategory-detailsCard">
//             <div className="viewCategory-cardHeader">
//               <h3>Category Information</h3>
//               <span
//                 className={`viewCategory-status ${
//                   category.status === "Active" ? "active" : "inactive"
//                 }`}
//               >
//                 {category.status}
//               </span>
//             </div>

//             <div className="viewCategory-info">
//               <div className="viewCategory-infoItem">
//                 <Tag size={18} />
//                 <span>{category.categoryName}</span>
//               </div>
//               <div className="viewCategory-infoItem">
//                 <FileText size={18} />
//                 <span>
//                   Created{" "}
//                   {new Date(category.createdAt).toLocaleDateString("en-IN", {
//                     day: "2-digit",
//                     month: "short",
//                     year: "numeric",
//                   })}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="viewCategory-card">
//           <h3>Description</h3>
//           <p>{category.description}</p>
//         </div>
//       </div>
//     </AdminLayout>
//   );
// };

// export default ViewCategory;