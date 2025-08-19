const { query } = require('../config/database');

// Notification types
const NOTIFICATION_TYPES = {
  COURSE_ENROLLMENT: 'course_enrollment',
  COURSE_COMPLETION: 'course_completion',
  SURVEY_ASSIGNED: 'survey_assigned',
  TRAINING_REMINDER: 'training_reminder',
  SYSTEM_ANNOUNCEMENT: 'system_announcement',
  APPROVAL_REQUEST: 'approval_request',
  APPROVAL_RESPONSE: 'approval_response'
};

// Create notification
const createNotification = async (notification) => {
  try {
    const {
      userId,
      title,
      message,
      type = NOTIFICATION_TYPES.SYSTEM_ANNOUNCEMENT,
      priority = 'medium',
      actionUrl = null,
      metadata = {},
      expiresAt = null
    } = notification;

    const insertQuery = `
      INSERT INTO notifications (
        user_id, title, message, type, priority, action_url, 
        metadata, expires_at, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    const result = await query(insertQuery, [
      userId,
      title,
      message,
      type,
      priority,
      actionUrl,
      JSON.stringify(metadata),
      expiresAt
    ]);

    // Get the created notification
    const createdNotification = await query(
      'SELECT * FROM notifications WHERE id = ?',
      [result.insertId]
    );

    return createdNotification[0];

  } catch (error) {
    console.error('Create notification error:', error);
    throw error;
  }
};

// Create bulk notifications
const createBulkNotifications = async (notifications) => {
  try {
    const promises = notifications.map(notification => createNotification(notification));
    return await Promise.all(promises);
  } catch (error) {
    console.error('Create bulk notifications error:', error);
    throw error;
  }
};

// Get user notifications
const getUserNotifications = async (userId, options = {}) => {
  try {
    const {
      limit = 20,
      offset = 0,
      unreadOnly = false,
      type = null,
      priority = null
    } = options;

    let whereClause = 'WHERE user_id = ? AND (expires_at IS NULL OR expires_at > NOW())';
    const params = [userId];

    if (unreadOnly) {
      whereClause += ' AND is_read = FALSE';
    }

    if (type) {
      whereClause += ' AND type = ?';
      params.push(type);
    }

    if (priority) {
      whereClause += ' AND priority = ?';
      params.push(priority);
    }

    const notificationsQuery = `
      SELECT * FROM notifications
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;

    params.push(limit, offset);

    const notifications = await query(notificationsQuery, params);

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total FROM notifications
      ${whereClause}
    `;

    const countResult = await query(countQuery, params.slice(0, -2));
    const total = countResult[0].total;

    return {
      notifications,
      total,
      unread: notifications.filter(n => !n.is_read).length
    };

  } catch (error) {
    console.error('Get user notifications error:', error);
    throw error;
  }
};

// Mark notification as read
const markAsRead = async (notificationId, userId) => {
  try {
    await query(
      'UPDATE notifications SET is_read = TRUE, read_at = NOW() WHERE id = ? AND user_id = ?',
      [notificationId, userId]
    );
    return true;
  } catch (error) {
    console.error('Mark notification as read error:', error);
    throw error;
  }
};

// Mark all notifications as read
const markAllAsRead = async (userId) => {
  try {
    await query(
      'UPDATE notifications SET is_read = TRUE, read_at = NOW() WHERE user_id = ? AND is_read = FALSE',
      [userId]
    );
    return true;
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    throw error;
  }
};

// Delete notification
const deleteNotification = async (notificationId, userId) => {
  try {
    await query(
      'DELETE FROM notifications WHERE id = ? AND user_id = ?',
      [notificationId, userId]
    );
    return true;
  } catch (error) {
    console.error('Delete notification error:', error);
    throw error;
  }
};

// Clean up expired notifications
const cleanupExpiredNotifications = async () => {
  try {
    const result = await query(
      'DELETE FROM notifications WHERE expires_at IS NOT NULL AND expires_at < NOW()'
    );
    console.log(`Cleaned up ${result.affectedRows} expired notifications`);
    return result.affectedRows;
  } catch (error) {
    console.error('Cleanup expired notifications error:', error);
    throw error;
  }
};

// Notification templates for different events
const NotificationTemplates = {
  courseEnrollment: (courseName) => ({
    title: 'Course Enrollment Confirmed',
    message: `You have successfully enrolled in "${courseName}". Start learning now!`,
    type: NOTIFICATION_TYPES.COURSE_ENROLLMENT,
    priority: 'medium'
  }),

  courseCompletion: (courseName, score = null) => ({
    title: 'Course Completed!',
    message: `Congratulations! You have completed "${courseName}"${score ? ` with a score of ${score}%` : ''}.`,
    type: NOTIFICATION_TYPES.COURSE_COMPLETION,
    priority: 'high'
  }),

  surveyAssigned: (surveyTitle, dueDate) => ({
    title: 'New Survey Assigned',
    message: `You have been assigned a new survey: "${surveyTitle}". Please complete it by ${new Date(dueDate).toLocaleDateString()}.`,
    type: NOTIFICATION_TYPES.SURVEY_ASSIGNED,
    priority: 'medium'
  }),

  trainingReminder: (courseName, dueDate) => ({
    title: 'Training Reminder',
    message: `Don't forget to complete your training: "${courseName}". Due date: ${new Date(dueDate).toLocaleDateString()}.`,
    type: NOTIFICATION_TYPES.TRAINING_REMINDER,
    priority: 'high'
  }),

  approvalRequest: (requestType, requesterName) => ({
    title: 'Approval Request',
    message: `${requesterName} has submitted a ${requestType} request that requires your approval.`,
    type: NOTIFICATION_TYPES.APPROVAL_REQUEST,
    priority: 'high'
  }),

  approvalResponse: (requestType, status, approverName) => ({
    title: `Request ${status}`,
    message: `Your ${requestType} request has been ${status.toLowerCase()} by ${approverName}.`,
    type: NOTIFICATION_TYPES.APPROVAL_RESPONSE,
    priority: 'high'
  }),

  systemAnnouncement: (title, message) => ({
    title,
    message,
    type: NOTIFICATION_TYPES.SYSTEM_ANNOUNCEMENT,
    priority: 'medium'
  })
};

// Send notification to specific user
const sendNotificationToUser = async (userId, template, actionUrl = null, metadata = {}) => {
  try {
    const notification = {
      userId,
      ...template,
      actionUrl,
      metadata
    };

    const createdNotification = await createNotification(notification);
    
    // Here you would emit the notification via WebSocket if connected
    // io.to(`user_${userId}`).emit('notification', createdNotification);
    
    return createdNotification;
  } catch (error) {
    console.error('Send notification to user error:', error);
    throw error;
  }
};

// Send notification to role
const sendNotificationToRole = async (roleName, template, actionUrl = null, metadata = {}) => {
  try {
    // Get all users with the specified role
    const users = await query(
      `SELECT u.id FROM users u 
       JOIN user_roles ur ON u.role_id = ur.id 
       WHERE ur.role_name = ? AND u.is_active = TRUE`,
      [roleName]
    );

    const notifications = users.map(user => ({
      userId: user.id,
      ...template,
      actionUrl,
      metadata
    }));

    return await createBulkNotifications(notifications);
  } catch (error) {
    console.error('Send notification to role error:', error);
    throw error;
  }
};

// Send notification to department
const sendNotificationToDepartment = async (departmentId, template, actionUrl = null, metadata = {}) => {
  try {
    // Get all users in the specified department
    const users = await query(
      'SELECT id FROM users WHERE department_id = ? AND is_active = TRUE',
      [departmentId]
    );

    const notifications = users.map(user => ({
      userId: user.id,
      ...template,
      actionUrl,
      metadata
    }));

    return await createBulkNotifications(notifications);
  } catch (error) {
    console.error('Send notification to department error:', error);
    throw error;
  }
};

module.exports = {
  NOTIFICATION_TYPES,
  createNotification,
  createBulkNotifications,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  cleanupExpiredNotifications,
  NotificationTemplates,
  sendNotificationToUser,
  sendNotificationToRole,
  sendNotificationToDepartment
};
