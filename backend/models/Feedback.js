const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  category: {
    type: String,
    required: [true, 'Please add a category'],
  },
  message: {
    type: String,
    required: [true, 'Please add a message'],
  },
}, {
  timestamps: true,
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
