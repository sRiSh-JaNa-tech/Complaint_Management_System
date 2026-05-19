const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST api/ai/analyze
// @desc    Analyze complaint using AI
router.post('/analyze', authMiddleware, aiController.analyzeComplaint);

module.exports = router;
