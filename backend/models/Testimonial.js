const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
    // Links this review to the exact booking it's about — lets the
    // dashboard know which bookings still need a review vs which are done.
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', default: null },
    clientName: { type: String, required: true, trim: true },
    eventType: { type: String, required: true, trim: true },
    review: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Testimonial', testimonialSchema);