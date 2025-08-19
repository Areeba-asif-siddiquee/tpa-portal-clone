const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { query, transaction } = require('../config/database');
const { body, validationResult } = require('express-validator');

// Email transporter setup
const createEmailTransporter = () => {
  if (!process.env.MAIL_HOST) {
    console.warn('Email configuration missing. Email features will be disabled.');
    return null;
  }

  return nodemailer.createTransporter({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });
};

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// User registration
const register = async (req, res) => {
  try {
    // Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      employeeId,
      email,
      password,
      firstName,
      lastName,
      phone,
      roleId,
      departmentId,
      trainingDomainId,
      managerId
    } = req.body;

    // Check if user already exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = ? OR employee_id = ?',
      [email, employeeId]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or employee ID already exists'
      });
    }

    // Validate role exists
    const roleCheck = await query('SELECT id FROM user_roles WHERE id = ?', [roleId]);
    if (roleCheck.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified'
      });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const result = await query(
      `INSERT INTO users (employee_id, email, password_hash, first_name, last_name, phone, 
       role_id, department_id, training_domain_id, manager_id, email_verified) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [employeeId, email, passwordHash, firstName, lastName, phone, roleId, 
       departmentId, trainingDomainId, managerId, false]
    );

    // Get created user with role information
    const newUser = await query(
      `SELECT u.id, u.employee_id, u.email, u.first_name, u.last_name, 
       u.phone, ur.role_name, d.department_name, td.domain_name
       FROM users u 
       LEFT JOIN user_roles ur ON u.role_id = ur.id
       LEFT JOIN departments d ON u.department_id = d.id
       LEFT JOIN training_domains td ON u.training_domain_id = td.id
       WHERE u.id = ?`,
      [result.insertId]
    );

    // Generate token
    const token = generateToken(result.insertId);

    // Send welcome email (if email is configured)
    const transporter = createEmailTransporter();
    if (transporter) {
      try {
        await transporter.sendMail({
          from: process.env.MAIL_FROM,
          to: email,
          subject: 'Welcome to TPA Portal',
          html: `
            <h2>Welcome to TPA Portal!</h2>
            <p>Hello ${firstName} ${lastName},</p>
            <p>Your account has been successfully created. You can now access the training portal using your credentials.</p>
            <p><strong>Employee ID:</strong> ${employeeId}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p>Please verify your email address by logging in to the portal.</p>
            <p>Best regards,<br>TPA Portal Team</p>
          `
        });
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
      }
    }

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: newUser[0],
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// User login
const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Get user with role information
    const users = await query(
      `SELECT u.*, ur.role_name, ur.permissions, d.department_name, td.domain_name
       FROM users u 
       JOIN user_roles ur ON u.role_id = ur.id
       LEFT JOIN departments d ON u.department_id = d.id
       LEFT JOIN training_domains td ON u.training_domain_id = td.id
       WHERE u.email = ? AND u.is_active = TRUE`,
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const user = users[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    await query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
      [user.id]
    );

    // Generate token
    const token = generateToken(user.id);

    // Prepare user data (without sensitive information)
    const userData = {
      id: user.id,
      employeeId: user.employee_id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      roleId: user.role_id,
      roleName: user.role_name,
      departmentId: user.department_id,
      departmentName: user.department_name,
      trainingDomainId: user.training_domain_id,
      domainName: user.domain_name,
      managerId: user.manager_id,
      profilePicture: user.profile_picture,
      emailVerified: user.email_verified,
      lastLogin: user.last_login,
      permissions: typeof user.permissions === 'string' ? JSON.parse(user.permissions || '[]') : user.permissions || []
    };

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userData,
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Password reset request
const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    const users = await query(
      'SELECT id, first_name, last_name FROM users WHERE email = ? AND is_active = TRUE',
      [email]
    );

    // Always return success to prevent email enumeration
    if (users.length === 0) {
      return res.json({
        success: true,
        message: 'If the email exists, a password reset link has been sent'
      });
    }

    const user = users[0];

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Save reset token
    await query(
      'UPDATE users SET password_reset_token = ?, password_reset_expires = ? WHERE id = ?',
      [resetTokenHash, resetExpires, user.id]
    );

    // Send reset email
    const transporter = createEmailTransporter();
    if (transporter) {
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
      
      try {
        await transporter.sendMail({
          from: process.env.MAIL_FROM,
          to: email,
          subject: 'TPA Portal - Password Reset Request',
          html: `
            <h2>Password Reset Request</h2>
            <p>Hello ${user.first_name} ${user.last_name},</p>
            <p>You requested a password reset for your TPA Portal account.</p>
            <p>Click the link below to reset your password (valid for 15 minutes):</p>
            <p><a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
            <p>If you didn't request this reset, please ignore this email.</p>
            <p>Best regards,<br>TPA Portal Team</p>
          `
        });
      } catch (emailError) {
        console.error('Failed to send reset email:', emailError);
        return res.status(500).json({
          success: false,
          message: 'Failed to send reset email'
        });
      }
    }

    res.json({
      success: true,
      message: 'If the email exists, a password reset link has been sent'
    });

  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({
      success: false,
      message: 'Password reset request failed'
    });
  }
};

// Reset password
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required'
      });
    }

    // Hash the provided token
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid reset token
    const users = await query(
      `SELECT id FROM users 
       WHERE password_reset_token = ? 
       AND password_reset_expires > NOW() 
       AND is_active = TRUE`,
      [resetTokenHash]
    );

    if (users.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    const user = users[0];

    // Hash new password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password and clear reset token
    await query(
      `UPDATE users 
       SET password_hash = ?, password_reset_token = NULL, password_reset_expires = NULL 
       WHERE id = ?`,
      [passwordHash, user.id]
    );

    res.json({
      success: true,
      message: 'Password reset successful'
    });

  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({
      success: false,
      message: 'Password reset failed'
    });
  }
};

// Get user profile
const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const users = await query(
      `SELECT u.*, ur.role_name, ur.permissions, d.department_name, td.domain_name
       FROM users u 
       JOIN user_roles ur ON u.role_id = ur.id
       LEFT JOIN departments d ON u.department_id = d.id
       LEFT JOIN training_domains td ON u.training_domain_id = td.id
       WHERE u.id = ? AND u.is_active = TRUE`,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = users[0];

    // Prepare user data (without sensitive information)
    const userData = {
      id: user.id,
      employeeId: user.employee_id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      roleId: user.role_id,
      roleName: user.role_name,
      departmentId: user.department_id,
      departmentName: user.department_name,
      trainingDomainId: user.training_domain_id,
      domainName: user.domain_name,
      managerId: user.manager_id,
      profilePicture: user.profile_picture,
      emailVerified: user.email_verified,
      lastLogin: user.last_login,
      permissions: typeof user.permissions === 'string' ? JSON.parse(user.permissions || '[]') : user.permissions || [],
      createdAt: user.created_at
    };

    res.json({
      success: true,
      message: 'Profile retrieved successfully',
      data: {
        user: userData
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile'
    });
  }
};

// Validation middleware
const registerValidation = [
  body('employeeId').notEmpty().withMessage('Employee ID is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('roleId').isInt({ min: 1 }).withMessage('Valid role ID is required')
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

module.exports = {
  register,
  login,
  requestPasswordReset,
  resetPassword,
  getProfile,
  registerValidation,
  loginValidation
};
