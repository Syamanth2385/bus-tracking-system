const Feedback = require('../models/Feedback');

// @desc    Submit new feedback
// @route   POST /api/feedback
// @access  Public
const submitFeedback = async (req, res) => {
  try {
    const { category, message } = req.body;

    if (!category || !message) {
      return res.status(400).json({ message: 'Please provide both category and message' });
    }

    const feedback = await Feedback.create({
      category,
      message,
    });

    res.status(201).json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  submitFeedback,
};
