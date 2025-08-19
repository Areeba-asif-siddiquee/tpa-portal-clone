const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const ensureDirectoryExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Configure storage for different file types
const createStorage = (subFolder = '') => {
  const uploadDir = path.join(__dirname, '..', 'uploads', subFolder);
  ensureDirectoryExists(uploadDir);

  return multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      // Generate unique filename
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const extension = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix + extension);
    }
  });
};

// File filters for different purposes
const fileFilters = {
  images: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
    }
  },
  
  documents: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|txt|rtf|odt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const allowedMimes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'text/rtf',
      'application/vnd.oasis.opendocument.text'
    ];
    const mimetype = allowedMimes.includes(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only document files are allowed (pdf, doc, docx, txt, rtf, odt)'));
    }
  },

  courseFiles: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|txt|rtf|odt|mp4|mp3|avi|mov|wmv|flv|ppt|pptx|xls|xlsx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const allowedMimes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'text/rtf',
      'application/vnd.oasis.opendocument.text',
      'video/mp4',
      'audio/mpeg',
      'video/x-msvideo',
      'video/quicktime',
      'video/x-ms-wmv',
      'video/x-flv',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    const mimetype = allowedMimes.includes(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('File type not allowed for course materials'));
    }
  }
};

// Create upload middlewares for different purposes
const uploadProfilePicture = multer({
  storage: createStorage('profiles'),
  fileFilter: fileFilters.images,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1
  }
}).single('profilePicture');

const uploadCourseFiles = multer({
  storage: createStorage('courses'),
  fileFilter: fileFilters.courseFiles,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
    files: 10
  }
}).array('courseFiles', 10);

const uploadDocuments = multer({
  storage: createStorage('documents'),
  fileFilter: fileFilters.documents,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
    files: 5
  }
}).array('documents', 5);

// Generic upload middleware
const uploadAny = multer({
  storage: createStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  }
});

// Error handling middleware for multer
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files uploaded'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected file field'
      });
    }
  }
  
  if (error.message.includes('Only') || error.message.includes('File type')) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  next(error);
};

// File cleanup utility
const deleteFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err && err.code !== 'ENOENT') {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

module.exports = {
  uploadProfilePicture,
  uploadCourseFiles,
  uploadDocuments,
  uploadAny,
  handleUploadError,
  deleteFile
};
