import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { toast, ToastContainer } from 'react-toastify';
import {
  Edit,
  Save,
  Plus,
  Trash2,
  Image,
  FileText,
  HelpCircle,
  MessageSquare,
  Mail,
  Search,
  Check,
  Eye,
  EyeOff,
  Upload,
  X,
  Trash2Icon
} from 'lucide-react';
import AdminLayout from '../../Pages/Admin/Layout/AdminLayout';
import './CMS.css';

const BASE_URL = 'http://localhost:5000';
const MAX_HERO_IMAGES = 4;

// ---------- VALIDATION RULES ----------
// Kept in one place so every field's limits are easy to find and tweak.
const bannerRules = {
  heroTitle: { label: 'Hero title', min: 10, max: 100 },
  heroSubtitle: { label: 'Hero subtitle', min: 20, max: 300 },
  ctaText: { label: 'CTA button text', min: 3, max: 30 },
  promoDiscount: { label: 'Promo discount line', min: 5, max: 120 },
};

const validateBannerField = (name, value) => {
  const rule = bannerRules[name];
  if (!rule) return '';
  const trimmed = (value || '').trim();
  if (!trimmed) return `${rule.label} is required.`;
  if (trimmed.length < rule.min) return `${rule.label} must be at least ${rule.min} characters.`;
  if (trimmed.length > rule.max) return `${rule.label} must be under ${rule.max} characters.`;
  return '';
};

const validateFaqField = (name, value) => {
  const trimmed = (value || '').trim();
  if (name === 'question') {
    if (!trimmed) return 'Question is required.';
    if (trimmed.length < 10) return 'Question must be at least 10 characters.';
    if (trimmed.length > 200) return 'Question must be under 200 characters.';
  }
  if (name === 'answer') {
    if (!trimmed) return 'Answer is required.';
    if (trimmed.length < 20) return 'Answer must be at least 20 characters.';
    if (trimmed.length > 1000) return 'Answer must be under 1000 characters.';
  }
  return '';
};

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png'];

const formatSubscriberDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const ManageCMS = () => {
  const [activeSubTab, setActiveSubTab] = useState("Hero Banner");
  const [pageLoading, setPageLoading] = useState(true);

  // Hero Banner state
  const [bannerState, setBannerState] = useState(null);
  const [bannerDraft, setBannerDraft] = useState(null);
  const [isEditingBanner, setIsEditingBanner] = useState(false);
  const [savingBanner, setSavingBanner] = useState(false);
  const [bannerError, setBannerError] = useState(false);
  const [bannerFieldErrors, setBannerFieldErrors] = useState({});

  // Hero gallery (images) state — lives outside the edit lock so uploads/removals
  // apply immediately, the same way FAQ add/delete does.
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  // FAQ state
  const [faqList, setFaqList] = useState([]);
  const [newFaq, setNewFaq] = useState({ question: "", answer: "" });
  const [newFaqErrors, setNewFaqErrors] = useState({ question: "", answer: "" });
  const [addingFaq, setAddingFaq] = useState(false);
  const [editingFaqId, setEditingFaqId] = useState(null);
  const [editingFaqData, setEditingFaqData] = useState({ question: "", answer: "" });
  const [editingFaqErrors, setEditingFaqErrors] = useState({ question: "", answer: "" });

  // Testimonials state
  const [testimonials, setTestimonials] = useState([]);

  // Newsletter Subscribers state
  const [newsletterList, setNewsletterList] = useState([]);
  const [newsletterTotalSubscribed, setNewsletterTotalSubscribed] = useState(0);
  const [newsletterSearch, setNewsletterSearch] = useState("");
  const [newsletterPage, setNewsletterPage] = useState(1);
  const [newsletterTotalPages, setNewsletterTotalPages] = useState(1);
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [updatingSubscriberId, setUpdatingSubscriberId] = useState(null);

  const fetchBanner = async () => {
    try {
      const res = await axiosInstance.get("/api/banner");
      setBannerState(res.data.data);
      setBannerError(false);
    } catch (error) {
      setBannerError(true);
      toast.error("Failed to load hero banner content.");
    }
  };

  const fetchFaqs = async () => {
    try {
      const res = await axiosInstance.get("/api/faqs");
      setFaqList(res.data.data);
    } catch (error) {
      toast.error("Failed to load FAQs.");
    }
  };

  const fetchTestimonials = async () => {
    try {
      const res = await axiosInstance.get("/api/testimonials");
      setTestimonials(res.data.data);
    } catch (error) {
      toast.error("Failed to load testimonials.");
    }
  };

  const fetchNewsletter = async (page = 1, search = "") => {
    setNewsletterLoading(true);
    try {
      const res = await axiosInstance.get("/api/newsletter", {
        params: { page, limit: 10, search: search || undefined },
      });
      setNewsletterList(res.data.data);
      setNewsletterTotalSubscribed(res.data.totalSubscribed);
      setNewsletterTotalPages(res.data.totalPages);
      setNewsletterPage(res.data.page);
    } catch (error) {
      toast.error("Failed to load newsletter subscribers.");
    } finally {
      setNewsletterLoading(false);
    }
  };

  // Fetch all CMS content once when the page loads.
  // Using allSettled instead of all — one failing request shouldn't block the others.
  useEffect(() => {
    const fetchAllContent = async () => {
      await Promise.allSettled([fetchBanner(), fetchFaqs(), fetchTestimonials(), fetchNewsletter()]);
      setPageLoading(false);
    };

    fetchAllContent();
  }, []);

  // Close the image preview with the Escape key
  useEffect(() => {
    if (!previewImage) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setPreviewImage(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [previewImage]);

  // ---------- HERO BANNER (TEXT FIELDS) ----------
  const handleBannerChange = (e) => {
    const { name, value } = e.target;
    setBannerDraft(prev => ({ ...prev, [name]: value }));
    setBannerFieldErrors(prev => ({ ...prev, [name]: validateBannerField(name, value) }));
  };

  const handleBannerSave = async (e) => {
    e.preventDefault();

    const errors = {};
    Object.keys(bannerRules).forEach((field) => {
      errors[field] = validateBannerField(field, bannerDraft[field]);
    });
    setBannerFieldErrors(errors);

    const hasErrors = Object.values(errors).some(Boolean);
    if (hasErrors) {
      toast.error("Please fix the highlighted fields before publishing.");
      return;
    }

    setSavingBanner(true);
    try {
      const res = await axiosInstance.put("/api/banner", bannerDraft);
      setBannerState(res.data.data);
      setIsEditingBanner(false);
      toast.success("Homepage hero banner updated successfully!");
    } catch (error) {
      toast.error("Failed to update banner. Please try again.");
    } finally {
      setSavingBanner(false);
    }
  };

  // ---------- HERO GALLERY (IMAGES) ----------
  const uploadOneImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const res = await axiosInstance.post("/api/banner/upload-image", formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    setBannerState(res.data.data);
  };

  const handleFiles = async (fileList) => {
    const files = Array.from(fileList || []);
    if (files.length === 0) return;

    const currentCount = bannerState?.images?.length || 0;
    const remainingSlots = MAX_HERO_IMAGES - currentCount;

    if (remainingSlots <= 0) {
      toast.error(`You can only have up to ${MAX_HERO_IMAGES} hero images. Remove one first.`);
      return;
    }

    const validFiles = files.filter((file) => ACCEPTED_IMAGE_TYPES.includes(file.type));
    if (validFiles.length < files.length) {
      toast.error("Only JPEG and PNG images are accepted.");
    }

    const filesToUpload = validFiles.slice(0, remainingSlots);
    if (validFiles.length > remainingSlots) {
      toast.error(`Only ${remainingSlots} more image(s) can be added — the rest were skipped.`);
    }

    if (filesToUpload.length === 0) return;

    setUploadingImage(true);
    try {
      // Uploaded one at a time since the backend accepts a single file per request
      for (const file of filesToUpload) {
        await uploadOneImage(file);
      }
      toast.success("Hero image(s) uploaded successfully!");
    } catch (error) {
      toast.error("Failed to upload one or more images. Please try again.");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleFileInputChange = (e) => handleFiles(e.target.files);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDeleteImage = async (filename) => {
    try {
      const res = await axiosInstance.delete(`/api/banner/image/${filename}`);
      setBannerState(res.data.data);
      toast.success("Hero image removed.");
    } catch (error) {
      toast.error("Failed to remove image. Please try again.");
    }
  };

  // ---------- FAQs ----------
  const handleNewFaqChange = (field, value) => {
    setNewFaq(prev => ({ ...prev, [field]: value }));
    setNewFaqErrors(prev => ({ ...prev, [field]: validateFaqField(field, value) }));
  };

  const handleAddFaq = async (e) => {
    e.preventDefault();

    const errors = {
      question: validateFaqField('question', newFaq.question),
      answer: validateFaqField('answer', newFaq.answer),
    };
    setNewFaqErrors(errors);

    if (errors.question || errors.answer) {
      toast.error("Please fix the highlighted fields before publishing.");
      return;
    }

    setAddingFaq(true);
    try {
      const res = await axiosInstance.post("/api/faqs", newFaq);
      setFaqList(prev => [res.data.data, ...prev]);
      setNewFaq({ question: "", answer: "" });
      setNewFaqErrors({ question: "", answer: "" });
      toast.success("New FAQ published successfully!");
    } catch (error) {
      toast.error("Failed to publish FAQ. Please try again.");
    } finally {
      setAddingFaq(false);
    }
  };

  const startEditingFaq = (faq) => {
    setEditingFaqId(faq._id);
    setEditingFaqData({ question: faq.question, answer: faq.answer });
    setEditingFaqErrors({ question: "", answer: "" });
  };

  const handleEditingFaqChange = (field, value) => {
    setEditingFaqData(prev => ({ ...prev, [field]: value }));
    setEditingFaqErrors(prev => ({ ...prev, [field]: validateFaqField(field, value) }));
  };

  const handleSaveFaqEdit = async (id) => {
    const errors = {
      question: validateFaqField('question', editingFaqData.question),
      answer: validateFaqField('answer', editingFaqData.answer),
    };
    setEditingFaqErrors(errors);

    if (errors.question || errors.answer) {
      toast.error("Please fix the highlighted fields before saving.");
      return;
    }

    try {
      const res = await axiosInstance.put(`/api/faqs/${id}`, editingFaqData);
      setFaqList(prev => prev.map(item => (item._id === id ? res.data.data : item)));
      setEditingFaqId(null);
      toast.success("FAQ updated successfully!");
    } catch (error) {
      toast.error("Failed to update FAQ. Please try again.");
    }
  };

  const handleDeleteFaq = async (id) => {
    try {
      await axiosInstance.delete(`/api/faqs/${id}`);
      setFaqList(prev => prev.filter(item => item._id !== id));
      toast.success("FAQ deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete FAQ. Please try again.");
    }
  };

  // ---------- TESTIMONIALS ----------
  const handleToggleTestimonialFeatured = async (id) => {
    try {
      const res = await axiosInstance.patch(`/api/testimonials/${id}/toggle-featured`);
      setTestimonials(prev => prev.map(item => (item._id === id ? res.data.data : item)));
      toast.success(res.data.data.featured ? "Review featured on home layout!" : "Review hidden from landing layout.");
    } catch (error) {
      toast.error("Failed to update testimonial. Please try again.");
    }
  };

  // ---------- NEWSLETTER SUBSCRIBERS ----------
  const handleNewsletterSearch = (e) => {
    e.preventDefault();
    fetchNewsletter(1, newsletterSearch);
  };

  const handleToggleSubscriberStatus = async (subscriber) => {
    const newStatus = subscriber.status === "Subscribed" ? "Unsubscribed" : "Subscribed";
    setUpdatingSubscriberId(subscriber._id);
    try {
      const res = await axiosInstance.patch(`/api/newsletter/${subscriber._id}/status`, { status: newStatus });
      setNewsletterList(prev => prev.map(item => (item._id === subscriber._id ? res.data.data : item)));
      setNewsletterTotalSubscribed(prev => (newStatus === "Subscribed" ? prev + 1 : Math.max(prev - 1, 0)));
      toast.success(`Subscriber marked as ${newStatus}.`);
    } catch (error) {
      toast.error("Failed to update subscriber status. Please try again.");
    } finally {
      setUpdatingSubscriberId(null);
    }
  };

  const handleDeleteSubscriber = async (id, wasSubscribed) => {
    try {
      await axiosInstance.delete(`/api/newsletter/${id}`);
      setNewsletterList(prev => prev.filter(item => item._id !== id));
      if (wasSubscribed) {
        setNewsletterTotalSubscribed(prev => Math.max(prev - 1, 0));
      }
      toast.success("Subscriber deleted.");
    } catch (error) {
      toast.error("Failed to delete subscriber. Please try again.");
    }
  };

  if (pageLoading) {
    return (
      <AdminLayout>
        <div className="cmsPage-loading">Loading CMS content...</div>
      </AdminLayout>
    );
  }

  const heroImages = bannerState?.images || [];
  const galleryFull = heroImages.length >= MAX_HERO_IMAGES;

  return (
    <AdminLayout>
      <div className="cmsPage">
        <div className="cmsPage-header">
          <div>
            <h2>Website Content Manager (CMS)</h2>
            <p>Alter banner copy, manage operational FAQs, control testimonial layouts, and manage newsletter subscribers on the homepage.</p>
          </div>
        </div>

        <div className="cmsPage-tabs">
          <button
            className={activeSubTab === "Hero Banner" ? "tab-btn active" : "tab-btn"}
            onClick={() => setActiveSubTab("Hero Banner")}
          >
            <Image size={16} />
            <span>Hero & Promotional Banners</span>
          </button>
          <button
            className={activeSubTab === "Dynamic FAQs" ? "tab-btn active" : "tab-btn"}
            onClick={() => setActiveSubTab("Dynamic FAQs")}
          >
            <HelpCircle size={16} />
            <span>Dynamic FAQs</span>
          </button>
          <button
            className={activeSubTab === "Client Testimonials" ? "tab-btn active" : "tab-btn"}
            onClick={() => setActiveSubTab("Client Testimonials")}
          >
            <MessageSquare size={16} />
            <span>Homepage Testimonials</span>
          </button>
          <button
            className={activeSubTab === "Newsletter Subscribers" ? "tab-btn active" : "tab-btn"}
            onClick={() => setActiveSubTab("Newsletter Subscribers")}
          >
            <Mail size={16} />
            <span>Newsletter Subscribers</span>
          </button>
        </div>

        <div className="cmsPage-contentWrapper">

          {/* VIEW TAB 1: HERO BANNER EDITING */}
          {activeSubTab === "Hero Banner" && (
            <>
              {/* ---- Hero Gallery Images ---- */}
              <div className="cms-card">
                <div className="cms-cardHeader">
                  <Image className="gold-icon" size={20} />
                  <h3>Hero Gallery Images</h3>
                </div>

                <div
                  className={`cms-imageDropzone ${isDragging ? 'dragging' : ''} ${galleryFull || uploadingImage ? 'disabled' : ''}`}
                  onDragOver={(e) => { e.preventDefault(); if (!galleryFull) setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={galleryFull || uploadingImage ? undefined : handleDrop}
                >
                  <Upload className="upload-icon" size={28} />
                  <h4>Select hero images or drag &amp; drop files</h4>
                  <p>Formats accepted: JPEG, PNG &middot; Max {MAX_HERO_IMAGES} images</p>
                  <button
                    type="button"
                    className="browse-btn"
                    disabled={galleryFull || uploadingImage}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {uploadingImage ? "Uploading..." : "Browse Local Files"}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png"
                    multiple
                    hidden
                    onChange={handleFileInputChange}
                  />
                </div>

                <p className="cms-imgCount">{heroImages.length} / {MAX_HERO_IMAGES} images added</p>

                {heroImages.length > 0 && (
                  <div className="cms-imageGrid">
                    {heroImages.map((filename) => {
                      const url = `${BASE_URL}/uploads/${filename}`;
                      return (
                        <div key={filename} className="cms-imageThumb" onClick={() => setPreviewImage(url)}>
                          <img src={url} alt="Hero gallery" />
                          <button
                            type="button"
                            className="remove-overlay"
                            title="Remove image"
                            onClick={(e) => { e.stopPropagation(); handleDeleteImage(filename); }}
                          >
                            <Trash2Icon size={14} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* ---- Hero Text Content ---- */}
              <div className="cms-card">
                <div className="cms-cardHeader">
                  <FileText className="gold-icon" size={20} />
                  <h3>Homepage Hero Customization</h3>
                </div>

                {bannerError || !bannerState ? (
                  <div className="cms-formGroup">
                    <p className="faq-answer-txt">
                      Couldn't load the hero banner. Make sure the backend server is running, then retry.
                    </p>
                    <button type="button" className="cms-btn edit" onClick={fetchBanner}>
                      Retry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleBannerSave} className="cms-form">
                    <div className="cms-formRow">
                      <div className="cms-formGroup full-width">
                        <label>Main Slogan / Hero Title Headline</label>
                        <input
                          type="text"
                          name="heroTitle"
                          className={bannerFieldErrors.heroTitle ? 'has-error' : ''}
                          value={isEditingBanner ? bannerDraft.heroTitle : bannerState.heroTitle}
                          onChange={handleBannerChange}
                          disabled={!isEditingBanner}
                        />
                        {isEditingBanner && bannerFieldErrors.heroTitle && (
                          <span className="cms-fieldError">{bannerFieldErrors.heroTitle}</span>
                        )}
                      </div>
                    </div>

                    <div className="cms-formRow">
                      <div className="cms-formGroup full-width">
                        <label>Hero Description / Subheading Paragraph</label>
                        <textarea
                          name="heroSubtitle"
                          rows={3}
                          className={bannerFieldErrors.heroSubtitle ? 'has-error' : ''}
                          value={isEditingBanner ? bannerDraft.heroSubtitle : bannerState.heroSubtitle}
                          onChange={handleBannerChange}
                          disabled={!isEditingBanner}
                        />
                        {isEditingBanner && bannerFieldErrors.heroSubtitle && (
                          <span className="cms-fieldError">{bannerFieldErrors.heroSubtitle}</span>
                        )}
                      </div>
                    </div>

                    <div className="cms-formRow split-2">
                      <div className="cms-formGroup">
                        <label>CTA Redirect Button Text</label>
                        <input
                          type="text"
                          name="ctaText"
                          className={bannerFieldErrors.ctaText ? 'has-error' : ''}
                          value={isEditingBanner ? bannerDraft.ctaText : bannerState.ctaText}
                          onChange={handleBannerChange}
                          disabled={!isEditingBanner}
                        />
                        {isEditingBanner && bannerFieldErrors.ctaText && (
                          <span className="cms-fieldError">{bannerFieldErrors.ctaText}</span>
                        )}
                      </div>
                      <div className="cms-formGroup">
                        <label>Discount Strip Notification Slogan</label>
                        <input
                          type="text"
                          name="promoDiscount"
                          className={bannerFieldErrors.promoDiscount ? 'has-error' : ''}
                          value={isEditingBanner ? bannerDraft.promoDiscount : bannerState.promoDiscount}
                          onChange={handleBannerChange}
                          disabled={!isEditingBanner}
                        />
                        {isEditingBanner && bannerFieldErrors.promoDiscount && (
                          <span className="cms-fieldError">{bannerFieldErrors.promoDiscount}</span>
                        )}
                      </div>
                    </div>

                    <div className="cms-btnGroup">
                      {!isEditingBanner ? (
                        <button
                          type="button"
                          className="cms-btn edit"
                          onClick={() => {
                            setBannerDraft(bannerState);
                            setBannerFieldErrors({});
                            setIsEditingBanner(true);
                          }}
                        >
                          <Edit size={16} />
                          <span>Unlock Editing Canvas</span>
                        </button>
                      ) : (
                        <>
                          <button
                            type="button"
                            className="cms-btn cancel"
                            onClick={() => { setIsEditingBanner(false); setBannerFieldErrors({}); }}
                            disabled={savingBanner}
                          >
                            Cancel Changes
                          </button>
                          <button type="submit" className="cms-btn save" disabled={savingBanner}>
                            <Save size={16} />
                            <span>{savingBanner ? "Publishing..." : "Publish New Copy"}</span>
                          </button>
                        </>
                      )}
                    </div>
                  </form>
                )}
              </div>
            </>
          )}

          {/* VIEW TAB 2: FAQ MANAGER */}
          {activeSubTab === "Dynamic FAQs" && (
            <div className="cms-faqSplit">

              <div className="cms-card">
                <div className="cms-cardHeader">
                  <Plus className="gold-icon" size={20} />
                  <h3>Create New Dynamic FAQ</h3>
                </div>
                <form onSubmit={handleAddFaq} className="cms-form">
                  <div className="cms-formGroup">
                    <label>Help Question *</label>
                    <input
                      type="text"
                      placeholder="e.g. Can we bring our own catering team?"
                      className={newFaqErrors.question ? 'has-error' : ''}
                      value={newFaq.question}
                      onChange={(e) => handleNewFaqChange('question', e.target.value)}
                    />
                    {newFaqErrors.question && <span className="cms-fieldError">{newFaqErrors.question}</span>}
                  </div>
                  <div className="cms-formGroup mt-3">
                    <label>Comprehensive Answer *</label>
                    <textarea
                      rows={4}
                      placeholder="e.g. Yes, you can hire external caterers..."
                      className={newFaqErrors.answer ? 'has-error' : ''}
                      value={newFaq.answer}
                      onChange={(e) => handleNewFaqChange('answer', e.target.value)}
                    />
                    {newFaqErrors.answer && <span className="cms-fieldError">{newFaqErrors.answer}</span>}
                  </div>
                  <button type="submit" className="cms-btn save full-width" disabled={addingFaq}>
                    <Plus size={16} />
                    <span>{addingFaq ? "Publishing..." : "Publish Help FAQ"}</span>
                  </button>
                </form>
              </div>

              <div className="cms-faqListContainer">
                {faqList.length === 0 && <p className="faq-answer-txt">No FAQs added yet.</p>}
                {faqList.map((faq) => (
                  <div key={faq._id} className="faq-manageCard">
                    {editingFaqId === faq._id ? (
                      <div className="faq-editing-canvas">
                        <div className="cms-formGroup">
                          <label>Modify Question</label>
                          <input
                            type="text"
                            className={editingFaqErrors.question ? 'has-error' : ''}
                            value={editingFaqData.question}
                            onChange={(e) => handleEditingFaqChange('question', e.target.value)}
                          />
                          {editingFaqErrors.question && <span className="cms-fieldError">{editingFaqErrors.question}</span>}
                        </div>
                        <div className="cms-formGroup" style={{ marginTop: '10px' }}>
                          <label>Modify Answer</label>
                          <textarea
                            rows={3}
                            className={editingFaqErrors.answer ? 'has-error' : ''}
                            value={editingFaqData.answer}
                            onChange={(e) => handleEditingFaqChange('answer', e.target.value)}
                          />
                          {editingFaqErrors.answer && <span className="cms-fieldError">{editingFaqErrors.answer}</span>}
                        </div>
                        <div className="faq-actions-row" style={{ marginTop: '12px' }}>
                          <button className="cms-btn save-small" onClick={() => handleSaveFaqEdit(faq._id)}>
                            <Check size={14} /> Save
                          </button>
                          <button className="cms-btn cancel-small" onClick={() => setEditingFaqId(null)}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="faq-headerRow">
                          <h4>Question: {faq.question}</h4>
                          <div className="faq-cardControls">
                            <button className="icon-control-btn edit" onClick={() => startEditingFaq(faq)} title="Edit FAQ">
                              <Edit size={14} />
                            </button>
                            <button className="icon-control-btn delete" onClick={() => handleDeleteFaq(faq._id)} title="Delete FAQ">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        <p className="faq-answer-txt">{faq.answer}</p>
                      </>
                    )}
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* VIEW TAB 3: CLIENT TESTIMONIALS */}
          {activeSubTab === "Client Testimonials" && (
            <div className="cms-testimonialsGrid">
              {testimonials.length === 0 && <p className="faq-answer-txt">No testimonials yet.</p>}
              {testimonials.map((testi) => (
                <div key={testi._id} className={`testimonial-card ${testi.featured ? 'featured' : ''}`}>
                  <div className="testimonial-header">
                    <div>
                      <h4>{testi.clientName}</h4>
                      <span className="event-tag">{testi.eventType}</span>
                    </div>
                    <div className="testimonial-rating">
                      {Array.from({ length: testi.rating }).map((_, i) => (
                        <span key={i} className="gold-star">★</span>
                      ))}
                    </div>
                  </div>

                  <p className="testimonial-review">"{testi.review}"</p>

                  <div className="testimonial-cardFooter">
                    <span className={`status-pill ${testi.featured ? 'featured' : 'hidden'}`}>
                      {testi.featured ? "Featured on Home" : "Hidden from Landing"}
                    </span>
                    <button
                      className={`btn-toggle-featured ${testi.featured ? 'hide-btn' : 'show-btn'}`}
                      onClick={() => handleToggleTestimonialFeatured(testi._id)}
                    >
                      {testi.featured ? (
                        <>
                          <EyeOff size={14} />
                          <span>Hide Review</span>
                        </>
                      ) : (
                        <>
                          <Eye size={14} />
                          <span>Feature Review</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* VIEW TAB 4: NEWSLETTER SUBSCRIBERS */}
          {activeSubTab === "Newsletter Subscribers" && (
            <div className="cms-card">
              <div className="cms-cardHeader">
                <Mail className="gold-icon" size={20} />
                <h3>Newsletter Subscribers</h3>
              </div>

              <div className="newsletter-statsRow">
                <p className="newsletter-totalCount">
                  Total Subscribers: <strong>{newsletterTotalSubscribed}</strong>
                </p>
                <form className="newsletter-searchForm" onSubmit={handleNewsletterSearch}>
                  <Search size={16} className="newsletter-searchIcon" />
                  <input
                    type="text"
                    placeholder="Search by email..."
                    value={newsletterSearch}
                    onChange={(e) => setNewsletterSearch(e.target.value)}
                  />
                  <button type="submit" className="cms-btn edit">Search</button>
                </form>
              </div>

              {newsletterLoading ? (
                <p className="faq-answer-txt">Loading subscribers...</p>
              ) : newsletterList.length === 0 ? (
                <p className="faq-answer-txt">No subscribers found.</p>
              ) : (
                <>
                  <div className="newsletter-tableWrap">
                    <table className="newsletter-table">
                      <thead>
                        <tr>
                          <th>Email</th>
                          <th>Date</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {newsletterList.map((subscriber) => (
                          <tr key={subscriber._id}>
                            <td>{subscriber.email}</td>
                            <td>{formatSubscriberDate(subscriber.subscribedAt)}</td>
                            <td>
                              <span className={`status-pill ${subscriber.status === "Subscribed" ? "featured" : "hidden"}`}>
                                {subscriber.status}
                              </span>
                            </td>
                            <td>
                              <div className="newsletter-rowActions">
                                <button
                                  className={`btn-toggle-featured ${subscriber.status === "Subscribed" ? "hide-btn" : "show-btn"}`}
                                  onClick={() => handleToggleSubscriberStatus(subscriber)}
                                  disabled={updatingSubscriberId === subscriber._id}
                                >
                                  {subscriber.status === "Subscribed" ? "Unsubscribe" : "Resubscribe"}
                                </button>
                                <button
                                  className="icon-control-btn delete"
                                  title="Delete subscriber"
                                  onClick={() => handleDeleteSubscriber(subscriber._id, subscriber.status === "Subscribed")}
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {newsletterTotalPages > 1 && (
                    <div className="newsletter-pagination">
                      <button
                        className="cms-btn cancel"
                        disabled={newsletterPage <= 1}
                        onClick={() => fetchNewsletter(newsletterPage - 1, newsletterSearch)}
                      >
                        Previous
                      </button>
                      <span>Page {newsletterPage} of {newsletterTotalPages}</span>
                      <button
                        className="cms-btn cancel"
                        disabled={newsletterPage >= newsletterTotalPages}
                        onClick={() => fetchNewsletter(newsletterPage + 1, newsletterSearch)}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

        </div>
      </div>

      {/* ---- Image Preview Lightbox ---- */}
      {previewImage && (
        <div className="cms-lightboxOverlay" onClick={() => setPreviewImage(null)}>
          <div className="cms-lightboxContent" onClick={(e) => e.stopPropagation()}>
            <button className="cms-lightboxClose" onClick={() => setPreviewImage(null)}>
              <X size={18} />
            </button>
            <img src={previewImage} alt="Hero preview" />
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </AdminLayout>
  );
};

export default ManageCMS;