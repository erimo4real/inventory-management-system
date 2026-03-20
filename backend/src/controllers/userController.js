import UserRepository from '../repositories/UserRepository.js';

const userRepo = new UserRepository();

/**
 * UserController - handles user management (admin)
 */

// GET /api/users - List all users
export const getUsers = async (req, res, next) => {
  try {
    const users = await userRepo.findAll();
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
    res.json(user);
  } catch (err) {
    console.error('[UserController getUserById] ERROR:', err.message);
    next(err);
  }
};

// POST /api/users - Create user (admin only)
export const createUser = async (req, res, next) => {
  try {
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

// DELETE /api/users/:id - Delete user
export const deleteUser = async (req, res, next) => {
  try {
    if (parseInt(req.params.id) === req.user.id) {
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
