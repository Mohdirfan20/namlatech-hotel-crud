const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadsDir = path.join(__dirname, '../uploads');

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with sanitized extension
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `hotel-${uniqueSuffix}${ext}`);
  }
});

// Allowed image MIME types
const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif'];

// Multer file filter
const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype.toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error('Invalid image format. Allowed formats: JPEG, PNG, WEBP, GIF'), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB max
  },
  fileFilter
});

/**
 * Safely delete a file from uploads directory
 * @param {string} relativeOrFullPath - Path like '/uploads/filename.jpg' or full disk path
 */
const deleteFile = (filePath) => {
  if (!filePath) return;
  try {
    let target = filePath;
    if (filePath.startsWith('/uploads/') || filePath.startsWith('uploads/')) {
      const filename = path.basename(filePath);
      target = path.join(uploadsDir, filename);
    }
    if (fs.existsSync(target)) {
      fs.unlinkSync(target);
    }
  } catch (err) {
    console.error(`Error deleting file ${filePath}:`, err.message);
  }
};

module.exports = {
  upload,
  deleteFile,
  uploadsDir
};
