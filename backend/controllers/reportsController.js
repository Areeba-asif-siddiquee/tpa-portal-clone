const { query } = require('../config/database');

// Get comprehensive training reports
const getReports = async (req, res) => {
  try {
    const {
      type = 'overview',
      dateRange = 'last-30-days',
      department,
      role,
      format = 'json'
    } = req.query;

    const userId = req.user.userId;
    const userRole = req.user.roleName;

    let startDate, endDate;
    const now = new Date();
    
    // Calculate date range
    switch (dateRange) {
      case 'last-7-days':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        endDate = now;
        break;
      case 'last-30-days':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        endDate = now;
        break;
      case 'last-90-days':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        endDate = now;
        break;
      case 'last-year':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        endDate = now;
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        endDate = now;
    }

    let reportData = {};

    switch (type) {
      case 'overview':
        reportData = await generateOverviewReport(startDate, endDate, department, userRole, userId);
        break;
      case 'enrollment':
        reportData = await generateEnrollmentReport(startDate, endDate, department, userRole, userId);
        break;
      case 'completion':
        reportData = await generateCompletionReport(startDate, endDate, department, userRole, userId);
        break;
      case 'performance':
        reportData = await generatePerformanceReport(startDate, endDate, department, userRole, userId);
        break;
      case 'course-analytics':
        reportData = await generateCourseAnalytics(startDate, endDate, department, userRole, userId);
        break;
      case 'survey-results':
        reportData = await generateSurveyReport(startDate, endDate, department, userRole, userId);
        break;
      default:
        reportData = await generateOverviewReport(startDate, endDate, department, userRole, userId);
    }

    res.json({
      success: true,
      data: {
        reportType: type,
        dateRange: { startDate, endDate },
        ...reportData
      }
    });

  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate report'
    });
  }
};

// Generate overview report
const generateOverviewReport = async (startDate, endDate, department, userRole, userId) => {
  let departmentFilter = '';
  const params = [startDate, endDate];

  if (department && department !== 'all') {
    departmentFilter = 'AND u.department_id = ?';
    params.push(department);
  }

  // Role-based filtering
  let roleFilter = '';
  if (userRole === 'Manager') {
    roleFilter = 'AND u.manager_id = ?';
    params.push(userId);
  } else if (userRole === 'Employee') {
    roleFilter = 'AND u.id = ?';
    params.push(userId);
  }

  // Get key metrics
  const metricsQuery = `
    SELECT 
      COUNT(DISTINCT ce.id) as total_enrollments,
      COUNT(DISTINCT CASE WHEN ce.completion_status = 'Completed' THEN ce.id END) as completed_enrollments,
      COUNT(DISTINCT CASE WHEN ce.completion_status = 'In Progress' THEN ce.id END) as in_progress_enrollments,
      COUNT(DISTINCT c.id) as active_courses,
      AVG(ce.final_score) as average_score,
      COUNT(DISTINCT u.id) as active_users
    FROM course_enrollments ce
    JOIN courses c ON ce.course_id = c.id
    JOIN users u ON ce.user_id = u.id
    WHERE ce.enrollment_date BETWEEN ? AND ?
    ${departmentFilter}
    ${roleFilter}
  `;

  const metrics = await query(metricsQuery, params);

  // Get enrollment trends
  const trendsQuery = `
    SELECT 
      DATE_FORMAT(ce.enrollment_date, '%Y-%m') as month,
      COUNT(*) as enrollments,
      COUNT(CASE WHEN ce.completion_status = 'Completed' THEN 1 END) as completions
    FROM course_enrollments ce
    JOIN users u ON ce.user_id = u.id
    WHERE ce.enrollment_date BETWEEN ? AND ?
    ${departmentFilter}
    ${roleFilter}
    GROUP BY DATE_FORMAT(ce.enrollment_date, '%Y-%m')
    ORDER BY month
  `;

  const trends = await query(trendsQuery, params);

  // Get department performance
  const departmentQuery = `
    SELECT 
      d.department_name,
      COUNT(DISTINCT ce.id) as total_enrollments,
      COUNT(DISTINCT CASE WHEN ce.completion_status = 'Completed' THEN ce.id END) as completed,
      ROUND(COUNT(DISTINCT CASE WHEN ce.completion_status = 'Completed' THEN ce.id END) * 100.0 / COUNT(DISTINCT ce.id), 2) as completion_rate
    FROM course_enrollments ce
    JOIN users u ON ce.user_id = u.id
    JOIN departments d ON u.department_id = d.id
    WHERE ce.enrollment_date BETWEEN ? AND ?
    ${roleFilter}
    GROUP BY d.id, d.department_name
    ORDER BY completion_rate DESC
  `;

  const deptParams = [startDate, endDate];
  if (userRole === 'Manager') {
    deptParams.push(userId);
  } else if (userRole === 'Employee') {
    deptParams.push(userId);
  }

  const departmentPerformance = await query(departmentQuery, deptParams);

  return {
    metrics: metrics[0] || {},
    trends,
    departmentPerformance
  };
};

// Generate enrollment report
const generateEnrollmentReport = async (startDate, endDate, department, userRole, userId) => {
  let departmentFilter = '';
  const params = [startDate, endDate];

  if (department && department !== 'all') {
    departmentFilter = 'AND u.department_id = ?';
    params.push(department);
  }

  let roleFilter = '';
  if (userRole === 'Manager') {
    roleFilter = 'AND u.manager_id = ?';
    params.push(userId);
  }

  const enrollmentQuery = `
    SELECT 
      ce.id,
      u.first_name,
      u.last_name,
      u.employee_id,
      c.course_name,
      d.department_name,
      ce.enrollment_date,
      ce.completion_status,
      ce.progress_percentage
    FROM course_enrollments ce
    JOIN users u ON ce.user_id = u.id
    JOIN courses c ON ce.course_id = c.id
    JOIN departments d ON u.department_id = d.id
    WHERE ce.enrollment_date BETWEEN ? AND ?
    ${departmentFilter}
    ${roleFilter}
    ORDER BY ce.enrollment_date DESC
  `;

  const enrollments = await query(enrollmentQuery, params);

  return {
    enrollments,
    summary: {
      total: enrollments.length,
      completed: enrollments.filter(e => e.completion_status === 'Completed').length,
      inProgress: enrollments.filter(e => e.completion_status === 'In Progress').length,
      enrolled: enrollments.filter(e => e.completion_status === 'Enrolled').length
    }
  };
};

// Generate completion report
const generateCompletionReport = async (startDate, endDate, department, userRole, userId) => {
  let departmentFilter = '';
  const params = [startDate, endDate];

  if (department && department !== 'all') {
    departmentFilter = 'AND u.department_id = ?';
    params.push(department);
  }

  let roleFilter = '';
  if (userRole === 'Manager') {
    roleFilter = 'AND u.manager_id = ?';
    params.push(userId);
  }

  const completionQuery = `
    SELECT 
      c.course_name,
      COUNT(*) as total_enrolled,
      COUNT(CASE WHEN ce.completion_status = 'Completed' THEN 1 END) as completed,
      AVG(ce.progress_percentage) as avg_progress,
      AVG(ce.final_score) as avg_score
    FROM course_enrollments ce
    JOIN courses c ON ce.course_id = c.id
    JOIN users u ON ce.user_id = u.id
    WHERE ce.enrollment_date BETWEEN ? AND ?
    ${departmentFilter}
    ${roleFilter}
    GROUP BY c.id, c.course_name
    ORDER BY completed DESC
  `;

  const completions = await query(completionQuery, params);

  return {
    courseCompletions: completions,
    summary: {
      totalCourses: completions.length,
      averageCompletionRate: completions.reduce((acc, c) => acc + (c.completed / c.total_enrolled), 0) / completions.length * 100 || 0
    }
  };
};

// Generate performance report
const generatePerformanceReport = async (startDate, endDate, department, userRole, userId) => {
  let departmentFilter = '';
  const params = [startDate, endDate];

  if (department && department !== 'all') {
    departmentFilter = 'AND u.department_id = ?';
    params.push(department);
  }

  let roleFilter = '';
  if (userRole === 'Manager') {
    roleFilter = 'AND u.manager_id = ?';
    params.push(userId);
  }

  const performanceQuery = `
    SELECT 
      u.first_name,
      u.last_name,
      u.employee_id,
      d.department_name,
      COUNT(ce.id) as courses_enrolled,
      COUNT(CASE WHEN ce.completion_status = 'Completed' THEN 1 END) as courses_completed,
      AVG(ce.final_score) as avg_score,
      AVG(ce.progress_percentage) as avg_progress
    FROM users u
    LEFT JOIN course_enrollments ce ON u.id = ce.user_id AND ce.enrollment_date BETWEEN ? AND ?
    LEFT JOIN departments d ON u.department_id = d.id
    WHERE u.is_active = TRUE
    ${departmentFilter.replace('u.department_id', 'u.department_id')}
    ${roleFilter}
    GROUP BY u.id
    ORDER BY courses_completed DESC, avg_score DESC
  `;

  const performance = await query(performanceQuery, params);

  return {
    userPerformance: performance
  };
};

// Generate course analytics
const generateCourseAnalytics = async (startDate, endDate, department, userRole, userId) => {
  const courseQuery = `
    SELECT 
      c.id,
      c.course_name,
      c.difficulty_level,
      COUNT(ce.id) as total_enrollments,
      COUNT(CASE WHEN ce.completion_status = 'Completed' THEN 1 END) as completions,
      AVG(ce.final_score) as avg_score,
      AVG(DATEDIFF(ce.completion_date, ce.enrollment_date)) as avg_completion_days
    FROM courses c
    LEFT JOIN course_enrollments ce ON c.id = ce.course_id 
      AND ce.enrollment_date BETWEEN ? AND ?
    GROUP BY c.id
    ORDER BY total_enrollments DESC
  `;

  const courses = await query(courseQuery, [startDate, endDate]);

  return {
    courseAnalytics: courses
  };
};

// Generate survey report
const generateSurveyReport = async (startDate, endDate, department, userRole, userId) => {
  const surveyQuery = `
    SELECT 
      s.survey_title,
      COUNT(sr.id) as total_responses,
      COUNT(CASE WHEN sr.completion_status = 'Completed' THEN 1 END) as completed_responses,
      AVG(sr.completion_percentage) as avg_completion
    FROM surveys s
    LEFT JOIN survey_responses sr ON s.id = sr.survey_id
      AND sr.created_at BETWEEN ? AND ?
    GROUP BY s.id
    ORDER BY total_responses DESC
  `;

  const surveys = await query(surveyQuery, [startDate, endDate]);

  return {
    surveyResults: surveys
  };
};

// Export report data
const exportReport = async (req, res) => {
  try {
    const { type, format = 'csv' } = req.query;
    
    // For now, return a success message
    // In production, this would generate and return the actual file
    res.json({
      success: true,
      message: `Report export in ${format} format initiated`,
      downloadUrl: `/exports/report-${Date.now()}.${format}`
    });

  } catch (error) {
    console.error('Export report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export report'
    });
  }
};

module.exports = {
  getReports,
  exportReport
};
