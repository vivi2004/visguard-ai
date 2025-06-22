const express = require('express');
const router = express.Router();
const { handleAnalysis } = require('../controllers/analyzeController');

// POST /api/analyze - Analyze image(caption and detection)
router.post('/', handleAnalysis);

module.exports = router;
