const { query } = require('../config/database');
const { validationResult } = require('express-validator');

// Get all courses with filtering, search, and pagination
const getCourses = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      department,
      domain,
      status,
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = req.query;

    // Validate and sanitize sortBy and sortOrder
    const validSortBy = ['created_at', 'course_name', 'course_code', 'status'];
    const validSortOrder = ['ASC', 'DESC'];

    const sortBySafe = validSortBy.includes(sortBy) ? sortBy : 'created_at';
    const sortOrderSafe = validSortOrder.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';

    // Parse page and limit to integers safely
    const pageInt = parseInt(page, 10);
    const limitInt = parseInt(limit, 10);
    const offset = (pageInt > 0 ? pageInt : 1 - 1) * (limitInt > 0 ? limitInt : 10);

    let whereClause = 'WHERE 1=1';
    const queryParams = [];

    // Search functionality
    if (search) {
      whereClause += ' AND (c.course_name LIKE ? OR c.description LIKE ? OR c.course_code LIKE ?)';
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm);
    }

    // Filter by department
    if (department) {
      whereClause += ' AND c.department_id = ?';
      queryParams.push(department);
    }

    // Filter by domain
    if (domain) {
      whereClause += ' AND c.training_domain_id = ?';
      queryParams.push(domain);
    }

    // Filter by status
    if (status) {
      whereClause += ' AND c.status = ?';
      queryParams.push(status);
    }

    // Role-based filtering for Employee role
    if (req?.user?.roleName === 'Employee') {
      whereClause += ' AND c.status IN ("Published", "Active")';
    }

    const coursesQuery = `
      SELECT 
        c.*,
        d.department_name,
        td.domain_name,
        CONCAT(instructor.first_name, ' ', instructor.last_name) as instructor_name,
        CONCAT(creator.first_name, ' ', creator.last_name) as created_by_name,
        (SELECT COUNT(*) FROM course_enrollments ce WHERE ce.course_id = c.id) as total_enrollments,
        (SELECT COUNT(*) FROM course_enrollments ce WHERE ce.course_id = c.id AND ce.completion_status = 'Completed') as completed_enrollments
      FROM courses c
      LEFT JOIN departments d ON c.department_id = d.id
      LEFT JOIN training_domains td ON c.training_domain_id = td.id
      LEFT JOIN users instructor ON c.instructor_id = instructor.id
      LEFT JOIN users creator ON c.created_by = creator.id
      ${whereClause}
      ORDER BY c.${sortBySafe} ${sortOrderSafe}
      LIMIT ? OFFSET ?
    `;

    queryParams.push(limitInt, offset);

    const courses = await query(coursesQuery, queryParams);
    const countQuery = `
      SELECT COUNT(*) as total
      FROM courses c
      ${whereClause}
    `;

    const countParams = queryParams.slice(0, -2);
    const totalResult = await query(countQuery, countParams);
    const total = totalResult[0].total;

    res.json({
      success: true,
      data: {
        courses,
        pagination: {
          page: pageInt,
          limit: limitInt,
          total,
          totalPages: Math.ceil(total / limitInt)
        }
      }
    });

  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch courses'
    });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const getCoursesQuery = 'SELECT * FROM courses ORDER BY created_at DESC';
    const courses = await query(getCoursesQuery);
    res.status(200).json({
      success: true,
      data: {
        courses,
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch all courses'
    })
  }
}

const getCoursesCount = async (req, res) => {
  try {
    const countQuery = 'SELECT COUNT(*) as total FROM courses';
    const result = await query(countQuery);
    const total = result[0].total;

    res.json({
      success: true,
      data: {
        totalCourses: total
      }
    });
  } catch (error) {
       res.status(500).json({
      success: false,
      message: 'Failed to fetch courses count'
    })
  }
}

// Get single course by ID
const getCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const courseQuery = `
      SELECT 
        c.*,
        d.department_name,
        td.domain_name,
        CONCAT(instructor.first_name, ' ', instructor.last_name) as instructor_name,
        instructor.email as instructor_email,
        CONCAT(creator.first_name, ' ', creator.last_name) as created_by_name
      FROM courses c
      LEFT JOIN departments d ON c.department_id = d.id
      LEFT JOIN training_domains td ON c.training_domain_id = td.id
      LEFT JOIN users instructor ON c.instructor_id = instructor.id
      LEFT JOIN users creator ON c.created_by = creator.id
      WHERE c.id = ?
    `;

    const courses = await query(courseQuery, [id]);

    if (courses.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const course = courses[0];

    // Get enrollment info if user is logged in
    let enrollmentStatus = null;
    if (req.user) {
      const enrollmentQuery = `
        SELECT completion_status, progress_percentage, enrollment_date, final_score
        FROM course_enrollments 
        WHERE course_id = ? AND user_id = ?
      `;
      const enrollment = await query(enrollmentQuery, [id, req.user.id]);
      enrollmentStatus = enrollment.length > 0 ? enrollment[0] : null;
    }

    res.json({
      success: true,
      data: {
        course,
        enrollmentStatus
      }
    });

  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch course'
    });
  }
};

// Create new course (Admin/Manager only)
const createCourse = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      courseName,
      courseCode,
      description,
      departmentId,
      trainingDomainId,
      durationHours,
      difficultyLevel,
      prerequisites,
      learningObjectives,
      instructorId,
      maxParticipants,
      scheduleStart,
      scheduleEnd,
      scheduleType,
      location,
      deliveryMethod,
      status,
      tags
    } = req.body;

    // Check if course code already exists
    const existingCourse = await query(
      'SELECT id FROM courses WHERE course_code = ?',
      [courseCode]
    );

    if (existingCourse.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Course code already exists'
      });
    }

    const createQuery = `
      INSERT INTO courses (
        course_name, course_code, description, department_id, training_domain_id,
        duration_hours, difficulty_level, prerequisites, learning_objectives,
        instructor_id, max_participants, schedule_start, schedule_end,
        schedule_type, location, delivery_method, status, tags, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await query(createQuery, [
      courseName, courseCode, description, departmentId, trainingDomainId,
      durationHours, difficultyLevel, prerequisites, learningObjectives,
      instructorId, maxParticipants, scheduleStart, scheduleEnd,
      scheduleType, location, deliveryMethod, status, tags, req.user.userId
    ]);

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: {
        courseId: result.insertId
      }
    });

  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create course'
    });
  }
};

// Enroll in course
const enrollCourse = async (req, res) => {
  try {
    const { id: courseId } = req.params;
    const userId = req.user.userId;

    // Check if course exists and is available
    const courseQuery = `
      SELECT id, course_name, max_participants, status
      FROM courses 
      WHERE id = ? AND status IN ('Published', 'Active')
    `;
    const courses = await query(courseQuery, [courseId]);

    if (courses.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Course not found or not available for enrollment'
      });
    }

    const course = courses[0];

    // Check if user is already enrolled
    const existingEnrollment = await query(
      'SELECT id FROM course_enrollments WHERE course_id = ? AND user_id = ?',
      [courseId, userId]
    );

    if (existingEnrollment.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this course'
      });
    }

    // Check enrollment capacity
    if (course.max_participants) {
      const currentEnrollments = await query(
        'SELECT COUNT(*) as count FROM course_enrollments WHERE course_id = ?',
        [courseId]
      );
      
      if (currentEnrollments[0].count >= course.max_participants) {
        return res.status(400).json({
          success: false,
          message: 'Course is full'
        });
      }
    }

    // Enroll the user
    const enrollQuery = `
      INSERT INTO course_enrollments (
        user_id, course_id, enrollment_date, completion_status, progress_percentage
      ) VALUES (?, ?, NOW(), 'Enrolled', 0)
    `;

    await query(enrollQuery, [userId, courseId]);

    res.status(201).json({
      success: true,
      message: 'Successfully enrolled in course'
    });

  } catch (error) {
    console.error('Enroll course error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to enroll in course'
    });
  }
};

// Get user's enrollments
const getUserEnrollments = async (req, res) => {
  try {
    const userId = req.user.userId;

    const enrollmentsQuery = `
      SELECT 
        ce.*,
        c.course_name,
        c.course_code,
        c.description as course_description,
        c.duration_hours,
        c.difficulty_level,
        d.department_name,
        td.domain_name
      FROM course_enrollments ce
      JOIN courses c ON ce.course_id = c.id
      LEFT JOIN departments d ON c.department_id = d.id
      LEFT JOIN training_domains td ON c.training_domain_id = td.id
      WHERE ce.user_id = ?
      ORDER BY ce.enrollment_date DESC
    `;

    const enrollments = await query(enrollmentsQuery, [userId]);

    res.json({
      success: true,
      data: {
        enrollments
      }
    });

  } catch (error) {
    console.error('Get user enrollments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch enrollments'
    });
  }
};

// Update course progress
const updateProgress = async (req, res) => {
  try {
    const { id: courseId } = req.params;
    const { progressPercentage, completionStatus, finalScore } = req.body;
    const userId = req.user.userId;

    // Check if user is enrolled
    const enrollmentCheck = await query(
      'SELECT id FROM course_enrollments WHERE course_id = ? AND user_id = ?',
      [courseId, userId]
    );

    if (enrollmentCheck.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    const updateFields = [];
    const updateValues = [];

    if (progressPercentage !== undefined) {
      updateFields.push('progress_percentage = ?');
      updateValues.push(progressPercentage);
    }

    if (completionStatus) {
      updateFields.push('completion_status = ?');
      updateValues.push(completionStatus);
    }

    if (finalScore !== undefined) {
      updateFields.push('final_score = ?');
      updateValues.push(finalScore);
    }

    if (completionStatus === 'Completed') {
      updateFields.push('completion_date = NOW()');
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update'
      });
    }

    updateValues.push(courseId, userId);

    const updateQuery = `
      UPDATE course_enrollments 
      SET ${updateFields.join(', ')}
      WHERE course_id = ? AND user_id = ?
    `;

    await query(updateQuery, updateValues);

    res.json({
      success: true,
      message: 'Progress updated successfully'
    });

  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update progress'
    });
  }
};

// Get course categories
const getCategories = async (req, res) => {
  try {
    const categories = await query('SELECT * FROM course_categories ORDER BY category_name');
    
    res.json({
      success: true,
      data: {
        categories
      }
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories'
    });
  }
};

// Get most enrolled courses for graph
const getMostEnrolledCourses = async (req, res) => {
  try {
    const queryStr = `
      SELECT c.course_name, COUNT(ce.user_id) as enrolled_count
      FROM courses c
      LEFT JOIN course_enrollments ce ON ce.course_id = c.id
      GROUP BY c.id
      ORDER BY enrolled_count DESC
      LIMIT 10
    `;
    const results = await query(queryStr);
    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('Most enrolled courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch most enrolled courses'
    });
  }
};

// Get course enrollment trends over time
const getEnrollmentTrends = async (req, res) => {
  try {
    const { period = 'month', limit = 12 } = req.query;
    
    let dateFormat, groupBy;
    switch (period) {
      case 'week':
        dateFormat = '%Y-Week %u';
        groupBy = 'YEARWEEK(ce.enrollment_date)';
        break;
      case 'month':
        dateFormat = '%Y-%m';
        groupBy = 'DATE_FORMAT(ce.enrollment_date, "%Y-%m")';
        break;
      case 'quarter':
        dateFormat = '%Y-Q%q';
        groupBy = 'CONCAT(YEAR(ce.enrollment_date), "-Q", QUARTER(ce.enrollment_date))';
        break;
      default:
        dateFormat = '%Y-%m';
        groupBy = 'DATE_FORMAT(ce.enrollment_date, "%Y-%m")';
    }

    const trendsQuery = `
      SELECT 
        ${groupBy} as period,
        DATE_FORMAT(ce.enrollment_date, '${dateFormat}') as period_label,
        COUNT(ce.id) as enrollments,
        COUNT(CASE WHEN ce.completion_status = 'Completed' THEN 1 END) as completions,
        AVG(ce.progress_percentage) as avg_progress
      FROM course_enrollments ce
      WHERE ce.enrollment_date >= DATE_SUB(NOW(), INTERVAL ${parseInt(limit)} ${period.toUpperCase()})
      GROUP BY ${groupBy}
      ORDER BY period DESC
      LIMIT ?
    `;

    const trends = await query(trendsQuery, [parseInt(limit)]);
    
    res.json({
      success: true,
      data: trends.reverse() // Reverse to get chronological order
    });
  } catch (error) {
    console.error('Get enrollment trends error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch enrollment trends'
    });
  }
};

// Get department-wise course statistics
const getDepartmentStats = async (req, res) => {
  try {
    const statsQuery = `
      SELECT 
        d.department_name,
        COUNT(DISTINCT c.id) as total_courses,
        COUNT(ce.id) as total_enrollments,
        COUNT(CASE WHEN ce.completion_status = 'Completed' THEN 1 END) as completions,
        AVG(ce.progress_percentage) as avg_progress,
        COUNT(CASE WHEN c.status = 'Active' THEN 1 END) as active_courses
      FROM departments d
      LEFT JOIN courses c ON d.id = c.department_id
      LEFT JOIN course_enrollments ce ON c.id = ce.course_id
      GROUP BY d.id, d.department_name
      ORDER BY total_enrollments DESC
    `;

    const stats = await query(statsQuery);
    
    // stats = stats.map(stat => ({
    //   ...stat,
    //   completed: stat.completions
    // }));

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get department stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch department statistics'
    });
  }
};

// Get course completion rates by difficulty level
const getCompletionRatesByDifficulty = async (req, res) => {
  try {
    const ratesQuery = `
      SELECT 
        c.difficulty_level,
        COUNT(ce.id) as total_enrollments,
        COUNT(CASE WHEN ce.completion_status = 'Completed' THEN 1 END) as completions,
        ROUND(
          (COUNT(CASE WHEN ce.completion_status = 'Completed' THEN 1 END) / COUNT(ce.id)) * 100, 2
        ) as completion_rate
      FROM courses c
      LEFT JOIN course_enrollments ce ON c.id = ce.course_id
      WHERE ce.id IS NOT NULL
      GROUP BY c.difficulty_level
      ORDER BY completion_rate DESC
    `;

    const rates = await query(ratesQuery);
    
    // rates = rates.map(rate => ({
    //   ...rate,
    //   completed: rate.completions
    // }));

    res.json({
      success: true,
      data: rates
    });
  } catch (error) {
    console.error('Get completion rates error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch completion rates'
    });
  }
};

// Get monthly enrollment vs completion trends
const getMonthlyTrends = async (req, res) => {
  try {
    const trendsQuery = `
      SELECT 
        DATE_FORMAT(ce.enrollment_date, '%Y-%m') as month,
        DATE_FORMAT(ce.enrollment_date, '%M %Y') as month_label,
        COUNT(ce.id) as enrollments,
        COUNT(CASE WHEN ce.completion_status = 'Completed' THEN 1 END) as completions,
        COUNT(CASE WHEN ce.completion_status = 'In Progress' THEN 1 END) as in_progress,
        AVG(ce.progress_percentage) as avg_progress
      FROM course_enrollments ce
      WHERE ce.enrollment_date >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(ce.enrollment_date, '%Y-%m')
      ORDER BY month ASC
    `;

    const trends = await query(trendsQuery);
    
    res.json({
      success: true,
      data: trends
    });
  } catch (error) {
    console.error('Get monthly trends error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch monthly trends'
    });
  }
};


module.exports = {
  getCourses,
  getAllCourses,
  getCourse,
  createCourse,
  enrollCourse,
  getUserEnrollments,
  updateProgress,
  getCategories,
  getCoursesCount,
  getMostEnrolledCourses,
  getEnrollmentTrends,
  getDepartmentStats,
  getCompletionRatesByDifficulty,
  getMonthlyTrends
};



