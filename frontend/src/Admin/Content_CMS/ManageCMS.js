import React, { useState } from 'react';
import { 
  Edit, 
  Save, 
  Plus, 
  Trash2, 
  Image, 
  FileText, 
  HelpCircle, 
  MessageSquare, 
  Check, 
  X, 
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import AdminLayout from '../../Pages/Admin/Layout/AdminLayout';
import './CMS.css';

// Core CMS Mock Database matching Eventura homepage sections
const INITIAL_CMS_BANNER = {
  heroTitle: "Crafting Unforgettable Indian & Heritage Celebrations",
  heroSubtitle: "Your premium gateway to book heritage weddings, corporate conclaves, and theme parties across Kerala.",
  ctaText: "Explore Event Packages",
  promoDiscount: "Up to 15% off on first heritage wedding bookings this season"
};

const INITIAL_CMS_FAQS = [
  { id: 1, question: "How early should we book an event with Eventura?", answer: "We recommend booking at least 3 to 6 months in advance for large events like heritage weddings to secure the best partner vendors." },
  { id: 2, question: "Can we customize the predefined packages?", answer: "Yes! Eventura is highly modular. You can pick any core package and select standalone extra services based on your requirement." }
];

const INITIAL_CMS_TESTIMONIALS = [
  { id: 101, clientName: "Rahul & Priyanka", eventType: "Heritage Wedding", review: "Elite Stage Decorators and Malabar Catering made our heritage wedding absolute perfection. Eventura made bookings simple!", rating: 5, featured: true },
  { id: 102, clientName: "Fahad Rahman", eventType: "Corporate Gala", review: "Excellent sound engineering and stage setup. Highly recommend for corporate meetups.", rating: 4, featured: true },
  { id: 103, clientName: "Meera Nair", eventType: "Theme Birthday Party", review: "The kids zone setup was amazing, but food delivery was delayed by 15 minutes. Decent experience overall.", rating: 3, featured: false }
];

const ManageCMS = () => {
  const [activeSubTab, setActiveSubTab] = useState("Hero Banner"); // Options: Hero Banner, Dynamic FAQs, Client Testimonials
  const [bannerState, setBannerState] = useState(INITIAL_CMS_BANNER);
  const [isEditingBanner, setIsEditingBanner] = useState(false);
  
  const [faqList, setFaqList] = useState(INITIAL_CMS_FAQS);
  const [newFaq, setNewFaq] = useState({ question: "", answer: "" });
  const [editingFaqId, setEditingFaqId] = useState(null);
  const [editingFaqData, setEditingFaqData] = useState({ question: "", answer: "" });

  const [testimonials, setTestimonials] = useState(INITIAL_CMS_TESTIMONIALS);

  // Professional UI Toast Feedback State (No window alert alerts)
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const triggerToast = (msg, type = "success") => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3500);
  };

  // Handle updates to Home Hero Section fields
  const handleBannerSave = (e) => {
    e.preventDefault();
    setIsEditingBanner(false);
    triggerToast("Homepage Hero Banner updated successfully in database!");
  };

  const handleBannerChange = (e) => {
    const { name, value } = e.target;
    setBannerState(prev => ({ ...prev, [name]: value }));
  };

  // Create New FAQ Item
  const handleAddFaq = (e) => {
    e.preventDefault();
    if (!newFaq.question.trim() || !newFaq.answer.trim()) {
      triggerToast("Please fill in both the FAQ Question and Answer.", "error");
      return;
    }
    const createdItem = {
      id: Date.now(),
      question: newFaq.question,
      answer: newFaq.answer
    };
    setFaqList(prev => [...prev, createdItem]);
    setNewFaq({ question: "", answer: "" });
    triggerToast("New FAQ question published successfully!");
  };

  // Trigger FAQ Edit Mode
  const startEditingFaq = (faq) => {
    setEditingFaqId(faq.id);
    setEditingFaqData({ question: faq.question, answer: faq.answer });
  };

  // Save Modified FAQ Item
  const handleSaveFaqEdit = (id) => {
    if (!editingFaqData.question.trim() || !editingFaqData.answer.trim()) {
      triggerToast("Fields cannot be left blank.", "error");
      return;
    }
    setFaqList(prev => prev.map(item => 
      item.id === id ? { ...item, question: editingFaqData.question, answer: editingFaqData.answer } : item
    ));
    setEditingFaqId(null);
    triggerToast("FAQ record updated successfully!");
  };

  // Remove FAQ Item
  const handleDeleteFaq = (id) => {
    setFaqList(prev => prev.filter(item => item.id !== id));
    triggerToast("FAQ question has been permanently deleted.", "error");
  };

  // Toggle Featured status of testimonials on Homepage
  const handleToggleTestimonialFeatured = (id) => {
    setTestimonials(prev => prev.map(item => {
      if (item.id === id) {
        const nextState = !item.featured;
        triggerToast(nextState ? `Review featured on home layout!` : `Review hidden from landing layout.`);
        return { ...item, featured: nextState };
      }
      return item;
    }));
  };

  return (
    <AdminLayout>
      <div className="cmsPage">
        {/* Module Success/Error Feedback Banner */}
        {toast.show && (
          <div className={`cms-toast ${toast.type}`}>
            <AlertCircle size={16} />
            <span>{toast.message}</span>
          </div>
        )}

        {/* CMS Title Module Header */}
        <div className="cmsPage-header">
          <div>
            <h2>Website Content Manager (CMS)</h2>
            <p>Alter banner copy, manage operational FAQs, and control testimonial layouts on the homepage.</p>
          </div>
        </div>

        {/* Content Navigation Tabs */}
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
        </div>

        {/* Tab Content Display Area */}
        <div className="cmsPage-contentWrapper">
          
          {/* VIEW TAB 1: HERO BANNER EDITING */}
          {activeSubTab === "Hero Banner" && (
            <div className="cms-card">
              <div className="cms-cardHeader">
                <FileText className="gold-icon" size={20} />
                <h3>Homepage Hero Customization</h3>
              </div>
              
              <form onSubmit={handleBannerSave} className="cms-form">
                <div className="cms-formRow">
                  <div className="cms-formGroup full-width">
                    <label>Main Slogan / Hero Title Headline</label>
                    <input 
                      type="text" 
                      name="heroTitle" 
                      value={bannerState.heroTitle}
                      onChange={handleBannerChange}
                      disabled={!isEditingBanner}
                    />
                  </div>
                </div>

                <div className="cms-formRow">
                  <div className="cms-formGroup full-width">
                    <label>Hero Description / Subheading Paragraph</label>
                    <textarea 
                      name="heroSubtitle" 
                      rows={3}
                      value={bannerState.heroSubtitle}
                      onChange={handleBannerChange}
                      disabled={!isEditingBanner}
                    />
                  </div>
                </div>

                <div className="cms-formRow split-2">
                  <div className="cms-formGroup">
                    <label>CTA Redirect Button Text</label>
                    <input 
                      type="text" 
                      name="ctaText" 
                      value={bannerState.ctaText}
                      onChange={handleBannerChange}
                      disabled={!isEditingBanner}
                    />
                  </div>
                  <div className="cms-formGroup">
                    <label>Discount Strip Notification Slogan</label>
                    <input 
                      type="text" 
                      name="promoDiscount" 
                      value={bannerState.promoDiscount}
                      onChange={handleBannerChange}
                      disabled={!isEditingBanner}
                    />
                  </div>
                </div>

                {/* CMS Form CTA Buttons */}
                <div className="cms-btnGroup">
                  {!isEditingBanner ? (
                    <button 
                      type="button" 
                      className="cms-btn edit" 
                      onClick={() => setIsEditingBanner(true)}
                    >
                      <Edit size={16} />
                      <span>Unlock Editing Canvas</span>
                    </button>
                  ) : (
                    <>
                      <button 
                        type="button" 
                        className="cms-btn cancel" 
                        onClick={() => {
                          setBannerState(INITIAL_CMS_BANNER);
                          setIsEditingBanner(false);
                        }}
                      >
                        Cancel Changes
                      </button>
                      <button type="submit" className="cms-btn save">
                        <Save size={16} />
                        <span>Publish New Copy</span>
                      </button>
                    </>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* VIEW TAB 2: FAQ MANAGER */}
          {activeSubTab === "Dynamic FAQs" && (
            <div className="cms-faqSplit">
              
              {/* Left Column: Form to publish new FAQ */}
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
                      value={newFaq.question}
                      onChange={(e) => setNewFaq(prev => ({ ...prev, question: e.target.value }))}
                    />
                  </div>
                  <div className="cms-formGroup">
                    <label>Comprehensive Answer *</label>
                    <textarea 
                      rows={4}
                      placeholder="e.g. Yes, you can hire external caterers..."
                      value={newFaq.answer}
                      onChange={(e) => setNewFaq(prev => ({ ...prev, answer: e.target.value }))}
                    />
                  </div>
                  <button type="submit" className="cms-btn save full-width">
                    <Plus size={16} />
                    <span>Publish Help FAQ</span>
                  </button>
                </form>
              </div>

              {/* Right Column: Active FAQs Listing Grid with In-place Editing */}
              <div className="cms-faqListContainer">
                {faqList.map((faq) => (
                  <div key={faq.id} className="faq-manageCard">
                    {editingFaqId === faq.id ? (
                      /* FAQ Inline Edit Form Form */
                      <div className="faq-editing-canvas">
                        <div className="cms-formGroup">
                          <label>Modify Question</label>
                          <input 
                            type="text" 
                            value={editingFaqData.question}
                            onChange={(e) => setEditingFaqData(prev => ({ ...prev, question: e.target.value }))}
                          />
                        </div>
                        <div className="cms-formGroup" style={{ marginTop: '10px' }}>
                          <label>Modify Answer</label>
                          <textarea 
                            rows={3}
                            value={editingFaqData.answer}
                            onChange={(e) => setEditingFaqData(prev => ({ ...prev, answer: e.target.value }))}
                          />
                        </div>
                        <div className="faq-actions-row" style={{ marginTop: '12px' }}>
                          <button className="cms-btn save-small" onClick={() => handleSaveFaqEdit(faq.id)}>
                            <Check size={14} /> Save
                          </button>
                          <button className="cms-btn cancel-small" onClick={() => setEditingFaqId(null)}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Normal Read-Only FAQ Card */
                      <>
                        <div className="faq-headerRow">
                          <h4>Question: {faq.question}</h4>
                          <div className="faq-cardControls">
                            <button className="icon-control-btn edit" onClick={() => startEditingFaq(faq)} title="Edit FAQ">
                              <Edit size={14} />
                            </button>
                            <button className="icon-control-btn delete" onClick={() => handleDeleteFaq(faq.id)} title="Delete FAQ">
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
              {testimonials.map((testi) => (
                <div key={testi.id} className={`testimonial-card ${testi.featured ? 'featured' : ''}`}>
                  <div className="testimonial-header">
                    <div>
                      <h4>{testi.clientName}</h4>
                      <span className="event-tag">{testi.eventType}</span>
                    </div>
                    {/* Visual Rating Indicator stars count mapping */}
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
                      onClick={() => handleToggleTestimonialFeatured(testi.id)}
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

        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageCMS;