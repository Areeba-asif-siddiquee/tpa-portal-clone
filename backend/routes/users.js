const express = require('express');
const {
  getUsers,
  getUser,
  updateUser,
  getDashboardData
} = require('../controllers/usersController');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get dashboard data for current user
router.get('/dashboard', verifyToken, getDashboardData);

// Admin only routes
router.get('/', verifyToken, requireRole(['Admin', 'SystemAdmin']), getUsers);
router.get('/:id', verifyToken, requireRole(['Admin', 'SystemAdmin', 'Manager']), getUser);
router.put('/:id', verifyToken, requireRole(['Admin', 'SystemAdmin']), updateUser);

module.exports = router;
