const Faq = require('../models/Faq');

// @desc   Get all FAQs
// @route  GET /api/faqs
exports.getFaqs = async (req, res) => {
  try {
    const faqs = await Faq.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: faqs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch FAQs', error: error.message });
  }
};

// @desc   Create a new FAQ
// @route  POST /api/faqs
exports.createFaq = async (req, res) => {
  try {
    const { question, answer } = req.body;

    if (!question?.trim() || !answer?.trim()) {
      return res.status(400).json({ success: false, message: 'Question and answer are required' });
    }

    const faq = await Faq.create({ question, answer });
    res.status(201).json({ success: true, data: faq });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create FAQ', error: error.message });
  }
};

// @desc   Update an existing FAQ
// @route  PUT /api/faqs/:id
exports.updateFaq = async (req, res) => {
  try {
    const { question, answer } = req.body;

    if (!question?.trim() || !answer?.trim()) {
      return res.status(400).json({ success: false, message: 'Question and answer are required' });
    }

    const faq = await Faq.findByIdAndUpdate(
      req.params.id,
      { question, answer },
      { new: true, runValidators: true }
    );

    if (!faq) {
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    }

    res.status(200).json({ success: true, data: faq });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update FAQ', error: error.message });
  }
};

// @desc   Delete a FAQ
// @route  DELETE /api/faqs/:id
exports.deleteFaq = async (req, res) => {
  try {
    const faq = await Faq.findByIdAndDelete(req.params.id);

    if (!faq) {
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    }

    res.status(200).json({ success: true, data: faq });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete FAQ', error: error.message });
  }
};