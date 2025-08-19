const express = require('express');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Get training domains
router.get('/domains', verifyToken, (req, res) => {
  res.json({
    success: true,
    message: 'Training domains endpoint - implementation pending',
    data: []
  });
});

// Get user training needs
router.get('/needs', verifyToken, (req, res) => {
  res.json({
    success: true,
    message: 'Training needs endpoint - implementation pending',
    data: []
  });
});

module.exports = router;
