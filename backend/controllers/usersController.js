const { query } = require('../config/database');

// Get all users (Admin only)
const getUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      role,
      department,
      domain,
      status = 'active'
    } = req.query;

    const offset = (page - 1) * limit;
    let whereClause = 'WHERE 1=1';
    const queryParams = [];

    // Search functionality
    if (search) {
      whereClause += ' AND (u.first_name LIKE ? OR u.last_name LIKE ? OR u.email LIKE ? OR u.employee_id LIKE ?)';
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    // Filter by role
    if (role) {
      whereClause += ' AND ur.role_name = ?';
      queryParams.push(role);
    }

    // Filter by department
    if (department) {
      whereClause += ' AND u.department_id = ?';
      queryParams.push(department);
    }

    // Filter by domain
    if (domain) {
      whereClause += ' AND u.training_domain_id = ?';
      queryParams.push(domain);
    }

    // Filter by status
    if (status === 'active') {
      whereClause += ' AND u.is_active = TRUE';
    } else if (status === 'inactive') {
      whereClause += ' AND u.is_active = FALSE';
    }

    const usersQuery = `
      SELECT 
        u.id,
        u.employee_id,
        u.email,
        u.first_name,
        u.last_name,
        u.phone,
        ur.role_name,
        d.department_name,
        td.domain_name,
        CONCAT(m.first_name, ' ', m.last_name) as manager_name,
        u.is_active,
        u.email_verified,
        u.last_login,
        u.created_at
      FROM users u
      LEFT JOIN user_roles ur ON u.role_id = ur.id
      LEFT JOIN departments d ON u.department_id = d.id
      LEFT JOIN training_domains td ON u.training_domain_id = td.id
      LEFT JOIN users m ON u.manager_id = m.id
      ${whereClause}
      ORDER BY u.created_at DESC
      LIMIT ? OFFSET ?
    `;

    queryParams.push(parseInt(limit), parseInt(offset));
    const users = await query(usersQuery, queryParams);

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM users u
      LEFT JOIN user_roles ur ON u.role_id = ur.id
      ${whereClause}
    `;
    const countParams = queryParams.slice(0, -2);
    const totalResult = await query(countQuery, countParams);
    const total = totalResult[0].total;

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
};

// Get user by ID
const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const userQuery = `
      SELECT 
        u.id,
        u.employee_id,
        u.email,
        u.first_name,
        u.last_name,
        u.phone,
        ur.role_name,
        d.department_name,
        td.domain_name,
        CONCAT(m.first_name, ' ', m.last_name) as manager_name,
        u.profile_picture,
        u.is_active,
        u.email_verified,
        u.last_login,
        u.created_at
      FROM users u
      LEFT JOIN user_roles ur ON u.role_id = ur.id
      LEFT JOIN departments d ON u.department_id = d.id
      LEFT JOIN training_domains td ON u.training_domain_id = td.id
      LEFT JOIN users m ON u.manager_id = m.id
      WHERE u.id = ?
    `;

    const users = await query(userQuery, [id]);

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user: users[0]
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user'
    });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove sensitive fields that shouldn't be updated via this endpoint
    delete updateData.password_hash;
    delete updateData.password_reset_token;
    delete updateData.password_reset_expires;

    // Check if user exists
    const existingUser = await query('SELECT * FROM users WHERE id = ?', [id]);
    if (existingUser.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Build dynamic update query
    const updateFields = [];
    const updateValues = [];

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined && key !== 'id') {
        const dbField = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        updateFields.push(`${dbField} = ?`);
        updateValues.push(updateData[key]);
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update'
      });
    }

    updateValues.push(id);

    await query(
      `UPDATE users SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      updateValues
    );

    // Get updated user
    const updatedUser = await query(`
      SELECT 
        u.id,
        u.employee_id,
        u.email,
        u.first_name,
        u.last_name,
        u.phone,
        ur.role_name,
        d.department_name,
        td.domain_name,
        CONCAT(m.first_name, ' ', m.last_name) as manager_name,
        u.is_active,
        u.email_verified,
        u.last_login,
        u.created_at
      FROM users u
      LEFT JOIN user_roles ur ON u.role_id = ur.id
      LEFT JOIN departments d ON u.department_id = d.id
      LEFT JOIN training_domains td ON u.training_domain_id = td.id
      LEFT JOIN users m ON u.manager_id = m.id
      WHERE u.id = ?
    `, [id]);

    res.json({
      success: true,
      message: 'User updated successfully',
      data: {
        user: updatedUser[0]
      }
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user'
    });
  }
};

// Get dashboard data for current user
const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.roleName;

    // Base dashboard data for all users
    let dashboardData = {
      user: {
        id: req.user.id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        roleName: req.user.roleName,
        departmentId: req.user.departmentId,
        trainingDomainId: req.user.trainingDomainId
      }
    };

    // Get user's enrolled courses
    const enrolledCourses = await query(`
      SELECT ce.*, c.title as course_title, c.course_code,
             cs.batch_name, cs.start_date, cs.end_date,
             cc.category_name
      FROM course_enrollments ce
      JOIN course_schedules cs ON ce.schedule_id = cs.id
      JOIN courses c ON cs.course_id = c.id
      LEFT JOIN course_categories cc ON c.category_id = cc.id
      WHERE ce.user_id = ?
      ORDER BY ce.enrollment_date DESC
      LIMIT 5
    `, [userId]);

    // Get recent notifications
    const notifications = await query(`
      SELECT * FROM notifications 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT 5
    `, [userId]);

    // Get training progress statistics
    const trainingStats = await query(`
      SELECT 
        COUNT(*) as total_enrollments,
        SUM(CASE WHEN ce.status = 'Completed' THEN 1 ELSE 0 END) as completed_courses,
        SUM(CASE WHEN ce.status = 'Enrolled' THEN 1 ELSE 0 END) as active_courses,
        AVG(CASE WHEN ce.score IS NOT NULL THEN ce.score END) as average_score
      FROM course_enrollments ce
      JOIN course_schedules cs ON ce.schedule_id = cs.id
      WHERE ce.user_id = ?
    `, [userId]);

    dashboardData.enrolledCourses = enrolledCourses;
    dashboardData.notifications = notifications;
    dashboardData.trainingStats = trainingStats[0];

    // Role-specific dashboard data
    if (userRole === 'Manager') {
      // Get team members data
      const teamMembers = await query(`
        SELECT u.id, u.first_name, u.last_name, u.employee_id,
               ur.role_name, d.department_name
        FROM users u
        LEFT JOIN user_roles ur ON u.role_id = ur.id
        LEFT JOIN departments d ON u.department_id = d.id
        WHERE u.manager_id = ? AND u.is_active = TRUE
      `, [userId]);

      // Get team training statistics
      const teamStats = await query(`
        SELECT 
          COUNT(DISTINCT ce.user_id) as team_members_with_training,
          COUNT(*) as total_team_enrollments,
          SUM(CASE WHEN ce.status = 'Completed' THEN 1 ELSE 0 END) as completed_by_team,
          AVG(CASE WHEN ce.score IS NOT NULL THEN ce.score END) as team_average_score
        FROM course_enrollments ce
        JOIN users u ON ce.user_id = u.id
        WHERE u.manager_id = ?
      `, [userId]);

      dashboardData.teamMembers = teamMembers;
      dashboardData.teamStats = teamStats[0];
    }

    if (userRole === 'Admin' || userRole === 'SystemAdmin') {
      // Get system overview statistics
      const systemStats = await query(`
        SELECT 
          (SELECT COUNT(*) FROM users WHERE is_active = TRUE) as total_users,
          (SELECT COUNT(*) FROM courses WHERE is_active = TRUE) as total_courses,
          (SELECT COUNT(*) FROM course_enrollments) as total_enrollments,
          (SELECT COUNT(*) FROM surveys WHERE is_active = TRUE) as active_surveys
      `);

      // Get recent user registrations
      const recentUsers = await query(`
        SELECT u.id, u.first_name, u.last_name, u.employee_id,
               ur.role_name, u.created_at
        FROM users u
        LEFT JOIN user_roles ur ON u.role_id = ur.id
        ORDER BY u.created_at DESC
        LIMIT 5
      `);

      // Get training completion rates by domain
      const domainStats = await query(`
        SELECT td.domain_name,
               COUNT(ce.id) as total_enrollments,
               SUM(CASE WHEN ce.status = 'Completed' THEN 1 ELSE 0 END) as completed,
               ROUND(SUM(CASE WHEN ce.status = 'Completed' THEN 1 ELSE 0 END) * 100.0 / COUNT(ce.id), 2) as completion_rate
        FROM training_domains td
        LEFT JOIN courses c ON td.id = c.training_domain_id
        LEFT JOIN course_schedules cs ON c.id = cs.course_id
        LEFT JOIN course_enrollments ce ON cs.id = ce.schedule_id
        GROUP BY td.id, td.domain_name
        ORDER BY completion_rate DESC
      `);

      dashboardData.systemStats = systemStats[0];
      dashboardData.recentUsers = recentUsers;
      dashboardData.domainStats = domainStats;
    }

    res.json({
      success: true,
      data: dashboardData
    });

  } catch (error) {
    console.error('Get dashboard data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data'
    });
  }
};

module.exports = {
  getUsers,
  getUser,
  updateUser,
  getDashboardData
};
