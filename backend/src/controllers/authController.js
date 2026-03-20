import AuthService from '../services/AuthService.js';

/**
 * AuthController - handles authentication endpoints
 */

// POST /api/auth/register - Register new user
export const register = async (req, res, next) => {
  try {
    const result = await AuthService.register(req.body);
    res.status(201).json(result);
  } catch (err) {
    console.error('[AuthController register] ERROR:', err.message);
    next(err);
  }
};

// POST /api/auth/login - Login user
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.login(email, password);
    res.json(result);
  } catch (err) {
    console.error('[AuthController login] ERROR:', err.message);
    next(err);
  }
};

// GET /api/auth/me - Get current user
export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await AuthService.getCurrentUser(req.user.id);
    res.json(user);
  } catch (err) {
    console.error('[AuthController getCurrentUser] ERROR:', err.message);
    next(err);
  }
};

// POST /api/auth/change-password - Change password
export const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    await AuthService.changePassword(req.user.id, oldPassword, newPassword);
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('[AuthController changePassword] ERROR:', err.message);
    next(err);
  }
};

// POST /api/auth/forgot-password - Request password reset
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await AuthService.forgotPassword(email);
    
    if (!result) {
      return res.json({ message: 'If the email exists, a reset link has been sent' });
    }

    res.json({ message: 'If the email exists, a reset link has been sent', token: result.token });
  } catch (err) {
    console.error('[AuthController forgotPassword] ERROR:', err.message);
    next(err);
  }
};

// POST /api/auth/reset-password - Reset password with token
export const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    await AuthService.resetPassword(token, newPassword);
    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error('[AuthController resetPassword] ERROR:', err.message);
    next(err);
  }
};
