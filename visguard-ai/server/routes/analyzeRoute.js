const express = require('express');
const router = express.Router();

// Dummy analysis route
router.post('/', (req, res) => {
  res.json({ message: 'Analysis complete', data: {} });
});

module.exports = router;
