const winston = require('winston');
const path = require('path');

// Define log levels
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
};

// Define colors for different log levels
const logColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white'
};

// Tell winston that we want to link the colors
winston.addColors(logColors);

// Define which logs should be written to which level based on environment
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

// Create the log format
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Define different log transports
const transports = [
  // Console transport
  new winston.transports.Console({
    format: format
  }),
  
  // File transport for error logs
  new winston.transports.File({
    filename: path.join(__dirname, '../logs/error.log'),
    level: 'error',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json()
    )
  }),
  
  // File transport for all logs
  new winston.transports.File({
    filename: path.join(__dirname, '../logs/all.log'),
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json()
    )
  }),
  
  // File transport for HTTP requests
  new winston.transports.File({
    filename: path.join(__dirname, '../logs/http.log'),
    level: 'http',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    )
  })
];

// Create the logger
const logger = winston.createLogger({
  level: level(),
  levels: logLevels,
  transports,
  exceptionHandlers: [
    new winston.transports.File({ filename: path.join(__dirname, '../logs/exceptions.log') })
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: path.join(__dirname, '../logs/rejections.log') })
  ]
});

// Stream object for morgan middleware
const stream = {
  write: (message) => {
    logger.http(message.trim());
  }
};

// Create logs directory if it doesn't exist
const fs = require('fs');
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Helper functions for structured logging
const logError = (message, error = null, metadata = {}) => {
  const logData = {
    message,
    metadata,
    timestamp: new Date().toISOString()
  };
  
  if (error) {
    logData.error = {
      name: error.name,
      message: error.message,
      stack: error.stack
    };
  }
  
  logger.error(JSON.stringify(logData));
};

const logInfo = (message, metadata = {}) => {
  const logData = {
    message,
    metadata,
    timestamp: new Date().toISOString()
  };
  
  logger.info(JSON.stringify(logData));
};

const logWarn = (message, metadata = {}) => {
  const logData = {
    message,
    metadata,
    timestamp: new Date().toISOString()
  };
  
  logger.warn(JSON.stringify(logData));
};

const logDebug = (message, metadata = {}) => {
  const logData = {
    message,
    metadata,
    timestamp: new Date().toISOString()
  };
  
  logger.debug(JSON.stringify(logData));
};

const logHttp = (message, metadata = {}) => {
  const logData = {
    message,
    metadata,
    timestamp: new Date().toISOString()
  };
  
  logger.http(JSON.stringify(logData));
};

// Audit logging for security events
const logAudit = (action, userId, userEmail, details = {}, ipAddress = null) => {
  const auditData = {
    action,
    userId,
    userEmail,
    details,
    ipAddress,
    timestamp: new Date().toISOString()
  };
  
  logger.info(`AUDIT: ${JSON.stringify(auditData)}`);
  
  // In production, you might want to send this to a separate audit log service
  // or database table for compliance purposes
};

// Performance logging
const logPerformance = (operation, duration, metadata = {}) => {
  const performanceData = {
    operation,
    duration,
    metadata,
    timestamp: new Date().toISOString()
  };
  
  if (duration > 1000) {
    logger.warn(`PERFORMANCE: Slow operation detected - ${JSON.stringify(performanceData)}`);
  } else {
    logger.debug(`PERFORMANCE: ${JSON.stringify(performanceData)}`);
  }
};

module.exports = {
  logger,
  stream,
  logError,
  logInfo,
  logWarn,
  logDebug,
  logHttp,
  logAudit,
  logPerformance
};
