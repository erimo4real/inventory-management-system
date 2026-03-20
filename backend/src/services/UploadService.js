import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * UploadService - handles file uploads to Cloudinary
 */
export default class UploadService {
  /**
   * Upload image to Cloudinary
   * @param {Object} file - Multer file object
   * @param {Object} options - { folder, public_id, transformation }
   */
  static async uploadImage(file, options = {}) {
    const defaultOptions = {
      folder: options.folder || 'inventory',
      resource_type: 'image',
      use_filename: true,
      unique_filename: true
    };

    try {
      const result = await cloudinary.uploader.upload(file.path, {
        ...defaultOptions,
        ...options
      });
      
      return {
        url: result.secure_url,
        public_id: result.public_id,
        format: result.format,
        width: result.width,
        height: result.height,
        bytes: result.bytes
      };
    } catch (error) {
      console.error('[UploadService uploadImage] ERROR:', error.message);
      throw { message: 'Failed to upload image', status: 500 };
    }
  }

  /**
   * Upload multiple images
   * @param {Array} files - Array of Multer file objects
   * @param {Object} options - Upload options
   */
  static async uploadMultiple(files, options = {}) {
    const results = await Promise.all(
      files.map(file => this.uploadImage(file, options))
    );
    
    return results;
  }

  /**
   * Delete image from Cloudinary
   * @param {string} public_id - Cloudinary public ID
   */
  static async deleteImage(publicId) {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      console.error('[UploadService deleteImage] ERROR:', error.message);
      throw { message: 'Failed to delete image', status: 500 };
    }
  }

  /**
   * Get optimized image URL
   * @param {string} url - Original image URL
   * @param {Object} options - { width, height, crop, quality }
   */
  static getOptimizedUrl(url, options = {}) {
    if (!url) return null;
    
    const defaults = {
      width: 800,
      height: 800,
      crop: 'limit',
      quality: 'auto',
      fetch_format: 'auto'
    };

    return cloudinary.url(url, { ...defaults, ...options });
  }
}
