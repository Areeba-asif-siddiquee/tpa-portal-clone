const express = require('express');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get all surveys
router.get('/', verifyToken, (req, res) => {
  res.json({
    success: true,
    message: 'Surveys endpoint - implementation pending',
    data: []
  });
});

// Create survey (Admin only)
router.post('/', verifyToken, requireRole(['Admin', 'SystemAdmin']), (req, res) => {
  res.json({
    success: true,
    message: 'Create survey endpoint - implementation pending'
  });
});

module.exports = router;
