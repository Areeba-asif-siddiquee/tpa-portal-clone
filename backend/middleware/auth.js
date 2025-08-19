const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

// Verify JWT token middleware
const verifyToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database to ensure they still exist and are active
    const user = await query(
      'SELECT u.*, ur.role_name, ur.permissions FROM users u JOIN user_roles ur ON u.role_id = ur.id WHERE u.id = ? AND u.is_active = TRUE',
      [decoded.userId]
    );

    if (!user || user.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. User not found or inactive.'
      });
    }

    req.user = {
      id: user[0].id,
      email: user[0].email,
      firstName: user[0].first_name,
      lastName: user[0].last_name,
      roleId: user[0].role_id,
      roleName: user[0].role_name,
      departmentId: user[0].department_id,
      trainingDomainId: user[0].training_domain_id,
      permissions: JSON.parse(user[0].permissions || '[]')
    };

    next();
  } catch (error) {
    console.error('Token verification error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Token verification failed.'
    });
  }
};

// Role-based authorization middleware
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    const userRole = req.user.roleName;
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
    }

    next();
  };
};

// Permission-based authorization middleware
const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    const userPermissions = req.user.permissions;
    
    // System admin and admin have all permissions
    if (userPermissions.includes('all_permissions')) {
      return next();
    }

    if (!userPermissions.includes(permission)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
    }

    next();
  };
};

// Optional authentication - for routes that work with or without auth
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await query(
        'SELECT u.*, ur.role_name, ur.permissions FROM users u JOIN user_roles ur ON u.role_id = ur.id WHERE u.id = ? AND u.is_active = TRUE',
        [decoded.userId]
      );

      if (user && user.length > 0) {
        req.user = {
          id: user[0].id,
          email: user[0].email,
          firstName: user[0].first_name,
          lastName: user[0].last_name,
          roleId: user[0].role_id,
          roleName: user[0].role_name,
          departmentId: user[0].department_id,
          trainingDomainId: user[0].training_domain_id,
          permissions: JSON.parse(user[0].permissions || '[]')
        };
      }
    }
    
    next();
  } catch (error) {
    // If optional auth fails, continue without user
    next();
  }
};

module.exports = {
  verifyToken,
  requireRole,
  requirePermission,
  optionalAuth
};
