const express = require('express');
const router = express.Router();
const { submitFeedback } = require('../controllers/feedbackController');

router.route('/').post(submitFeedback);

module.exports = router;
