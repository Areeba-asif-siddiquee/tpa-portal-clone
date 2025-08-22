const express = require('express');
const { body } = require('express-validator');
const {
  getCourses,
  getCourse,
  createCourse,
  enrollCourse,
  getUserEnrollments,
  updateProgress,
  getCategories,
  getAllCourses,
  getCoursesCount,
  getMostEnrolledCourses,
  getEnrollmentTrends,
  getDepartmentStats,
  getCompletionRatesByDifficulty,
  getMonthlyTrends
} = require('../controllers/coursesController');
const { verifyToken, requireRole, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Validation rules for course creation
const courseValidation = [
  body('courseName').notEmpty().withMessage('Course name is required'),
  body('description').optional(),
  body('departmentId').optional().isInt().withMessage('Department ID must be a number'),
  body('trainingDomainId').optional().isInt().withMessage('Training domain ID must be a number'),
  body('durationHours').optional().isFloat({ min: 0 }).withMessage('Duration must be a positive number'),
  body('difficultyLevel').optional().isIn(['Beginner', 'Intermediate', 'Advanced']).withMessage('Invalid difficulty level'),
  body('maxParticipants').optional().isInt({ min: 1 }).withMessage('Max participants must be at least 1'),
  body('scheduleStart').optional().isISO8601().withMessage('Invalid start date format'),
  body('scheduleEnd').optional().isISO8601().withMessage('Invalid end date format'),
  body('scheduleType').optional().isIn(['One-time', 'Recurring', 'Self-paced']).withMessage('Invalid schedule type'),
  body('deliveryMethod').optional().isIn(['In-person', 'Online', 'Hybrid']).withMessage('Invalid delivery method'),
  body('status').optional().isIn(['Draft', 'Published', 'Active', 'Completed', 'Cancelled']).withMessage('Invalid status')
];

// Public routes (with optional authentication)
// router.get('/', optionalAuth, getCourses);
router.get('/', optionalAuth, getAllCourses);
router.get('/count', optionalAuth, getCoursesCount);
// router.get('/', optionalAuth, temp);
router.get('/categories', getCategories);

// Protected routes - User-specific routes (must come before /:id routes)
router.get('/my-enrollments', verifyToken, getUserEnrollments);

// Public/Protected routes - Specific course routes
router.get('/:id', optionalAuth, getCourse);
router.post('/:id/enroll', verifyToken, enrollCourse);
router.put('/:id/progress', verifyToken, updateProgress);
// Analytics routes (accessible to all authenticated users)
router.get('/analytics/most-enrolled', verifyToken, getMostEnrolledCourses);
router.get('/analytics/enrollment-trends', verifyToken, getEnrollmentTrends);
router.get('/analytics/department-stats', verifyToken, getDepartmentStats);
router.get('/analytics/completion-rates', verifyToken, getCompletionRatesByDifficulty);
router.get('/analytics/monthly-trends', verifyToken, getMonthlyTrends);

// Admin/Manager only routes
router.post('/', verifyToken, requireRole(['Admin', 'SystemAdmin', 'Manager']), courseValidation, createCourse);

module.exports = router;
