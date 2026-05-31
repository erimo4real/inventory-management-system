import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import UploadService from '../services/UploadService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../uploads');
    
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const MAGIC_BYTES = {
  'image/jpeg': [0xFF, 0xD8, 0xFF],
  'image/png': [0x89, 0x50, 0x4E, 0x47],
  'image/gif': [0x47, 0x49, 0x46],
  'image/webp': [0x52, 0x49, 0x46, 0x46]
};

function validateMagicBytes(buffer, mimeType) {
  const expected = MAGIC_BYTES[mimeType];
  if (!expected) return false;
  for (let i = 0; i < expected.length; i++) {
    if (buffer[i] !== expected[i]) return false;
  }
  return true;
}

// File filter - only allow images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'), false);
  }
  
  cb(null, true);
};

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

/**
 * UploadController - handles file upload endpoints
 */

// POST /api/upload/image - Upload single image
export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileBuffer = fs.readFileSync(req.file.path);
    if (!validateMagicBytes(fileBuffer, req.file.mimetype)) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Invalid file content' });
    }

    const folder = req.body.folder || 'inventory';
    const result = await UploadService.uploadImage(req.file, { folder });
    
    res.status(201).json(result);
  } catch (err) {
    console.error('[UploadController uploadImage] ERROR:', err.message);
    next(err);
  }
};

// POST /api/upload/images - Upload multiple images
export const uploadImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const folder = req.body.folder || 'inventory';
    const results = await UploadService.uploadMultiple(req.files, { folder });
    
    res.status(201).json(results);
  } catch (err) {
    console.error('[UploadController uploadImages] ERROR:', err.message);
    next(err);
  }
};

// DELETE /api/upload/image - Delete image
export const deleteImage = async (req, res, next) => {
  try {
    if (!req.body.public_id) {
      return res.status(400).json({ error: 'Public ID is required' });
    }

    await UploadService.deleteImage(req.body.public_id);
    
    res.json({ message: 'Image deleted successfully' });
  } catch (err) {
    console.error('[UploadController deleteImage] ERROR:', err.message);
    next(err);
  }
};
