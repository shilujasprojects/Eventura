const express = require('express');
const router = express.Router();
const {
  getTestimonials,
  getFeaturedTestimonials,
  getTestimonialsByClient,
  createTestimonial,
  toggleFeatured,
} = require('../controllers/testimonialController');

router.get('/', getTestimonials);
router.get('/featured', getFeaturedTestimonials);
router.get('/client/:clientId', getTestimonialsByClient);
router.post('/', createTestimonial);
router.patch('/:id/toggle-featured', toggleFeatured);

module.exports = router;