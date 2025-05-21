const express = require('express');
const router = express.Router();

// In-memory store (replace with DB in production)
let analysisHistory = [];

// Save analysis result
router.post('/', (req, res) => {
  const { result } = req.body;

  if (!result) {
    return res.status(400).json({ error: "Result data is required." });
  }

  analysisHistory.push({
    timestamp: new Date(),
    result,
  });

  res.status(200).json({ message: "Result saved to history." });
});

// Fetch history
router.get('/', (req, res) => {
  res.status(200).json({ history: analysisHistory });
});

module.exports = router;
