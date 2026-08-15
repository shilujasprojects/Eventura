const Testimonial = require('../models/Testimonial');
const Client = require('../models/Client');

// @desc   Get all testimonials (admin CMS view — includes non-featured ones)
// @route  GET /api/testimonials
exports.getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: testimonials });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch testimonials', error: error.message });
  }
};

// @desc   Get only admin-featured testimonials (public homepage carousel)
// @route  GET /api/testimonials/featured
exports.getFeaturedTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ featured: true }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: testimonials });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch featured testimonials', error: error.message });
  }
};

// @desc   Get testimonials submitted by one client (client dashboard "My Testimonials")
// @route  GET /api/testimonials/client/:clientId
exports.getTestimonialsByClient = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ client: req.params.clientId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: testimonials });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch your testimonials', error: error.message });
  }
};
// @desc   Client submits a new testimonial — starts hidden (featured: false)
//         until an admin chooses to feature it on the homepage.
// @route  POST /api/testimonials
exports.createTestimonial = async (req, res) => {
  try {
    const { clientId, bookingId, eventType, review, rating } = req.body;

    if (!clientId || !eventType || !review || !rating) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }

    const testimonial = await Testimonial.create({
      client: client._id,
      booking: bookingId || null,
      clientName: client.fullName,
      eventType,
      review,
      rating,
    });

    res.status(201).json({ success: true, data: testimonial });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to submit testimonial', error: error.message });
  }
};
// @desc   Toggle a testimonial's featured (homepage visibility) status
// @route  PATCH /api/testimonials/:id/toggle-featured
exports.toggleFeatured = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    testimonial.featured = !testimonial.featured;
    await testimonial.save();

    res.status(200).json({ success: true, data: testimonial });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update testimonial', error: error.message });
  }
};