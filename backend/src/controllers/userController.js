import UserRepository from '../repositories/UserRepository.js';
import UploadService from '../services/UploadService.js';

const userRepo = new UserRepository();

/**
 * UserController - handles user management (admin)
 */

// GET /api/users - List all users for current site
export const getUsers = async (req, res, next) => {
  try {
    const siteId = req.siteId || req.user?.site_id;
    const users = siteId ? await userRepo.findAll() : [];
    res.json(users);
  } catch (err) {
    console.error('[UserController getUsers] ERROR:', err.message);
    next(err);
  }
};

// GET /api/users/:id - Get single user
export const getUserById = async (req, res, next) => {
  try {
    const user = await userRepo.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (req.siteId && user.site_id !== req.siteId) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('[UserController getUserById] ERROR:', err.message);
    next(err);
  }
};

// POST /api/users - Create user (admin only)
export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    
    if (!name || typeof name !== 'string' || name.trim().length < 2 || name.length > 100) {
      return res.status(400).json({ error: 'Name must be between 2 and 100 characters' });
    }
    
    if (!email || typeof email !== 'string' || email.length > 255) {
      return res.status(400).json({ error: 'Valid email is required' });
    }
    
    if (password && (password.length < 6 || password.length > 128)) {
      return res.status(400).json({ error: 'Password must be between 6 and 128 characters' });
    }
    
    if (role && !['admin', 'manager', 'staff'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    
    const existing = await userRepo.findByEmail(req.body.email);
    if (existing) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    
    const user = await userRepo.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    console.error('[UserController createUser] ERROR:', err.message);
    next(err);
  }
};

// PUT /api/users/:id - Update user
export const updateUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    
    if (name !== undefined && (typeof name !== 'string' || name.trim().length < 2 || name.length > 100)) {
      return res.status(400).json({ error: 'Name must be between 2 and 100 characters' });
    }
    
    if (email !== undefined && (typeof email !== 'string' || email.length > 255)) {
      return res.status(400).json({ error: 'Email must be 255 characters or less' });
    }
    
    if (password !== undefined && (password.length < 6 || password.length > 128)) {
      return res.status(400).json({ error: 'Password must be between 6 and 128 characters' });
    }
    
    if (role !== undefined && !['admin', 'manager', 'staff'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    
    const user = await userRepo.update(req.params.id, req.body);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('[UserController updateUser] ERROR:', err.message);
    next(err);
  }
};

// PUT /api/users/:id/avatar - Update user avatar (admin)
export const updateUserAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await userRepo.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (req.siteId && user.site_id !== req.siteId) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.avatar_public_id) {
      try {
        await UploadService.deleteImage(user.avatar_public_id);
      } catch (err) {
        console.error('[UserController] Failed to delete old avatar:', err.message);
      }
    }

    const result = await UploadService.uploadImage(req.file, { folder: 'avatars' });
    const updated = await userRepo.update(userId, { avatar_url: result.url, avatar_public_id: result.public_id });
    res.json({ avatar_url: updated.avatar_url });
  } catch (err) {
    console.error('[UserController updateUserAvatar] ERROR:', err.message);
    next(err);
  }
};

// DELETE /api/users/:id - Delete user
export const deleteUser = async (req, res, next) => {
  try {
    const targetId = parseInt(req.params.id, 10);
    if (isNaN(targetId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    if (targetId === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }
    
    const result = await userRepo.delete(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(204).send();
  } catch (err) {
    console.error('[UserController deleteUser] ERROR:', err.message);
    next(err);
  }
};
