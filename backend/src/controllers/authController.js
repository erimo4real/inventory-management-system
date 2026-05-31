import AuthService from '../services/AuthService.js';

/**
 * AuthController - handles authentication endpoints
 */

// POST /api/auth/register - Register new user
export const register = async (req, res, next) => {
  try {
    const result = await AuthService.register(req.body);
    const isProduction = process.env.NODE_ENV === 'production';
    const maxAge = 24 * 60 * 60 * 1000;
    const baseOpts = { secure: isProduction, sameSite: 'strict', path: '/' };
    res.cookie('token', result.token, { ...baseOpts, httpOnly: true, maxAge });
    res.cookie('auth_status', '1', { ...baseOpts, maxAge });
    res.cookie('user_role', result.user.role, { ...baseOpts, maxAge });
    if (result.user.site_id) {
      res.cookie('site_id', result.user.site_id, { ...baseOpts, maxAge });
    }
    res.status(201).json({ user: result.user });
  } catch (err) {
    console.error('[AuthController register] ERROR:', err.message);
    next(err);
  }
};

// POST /api/auth/login - Login user
export const login = async (req, res, next) => {
  try {
    const { email, password, remember } = req.body;
    const result = await AuthService.login(email, password, remember);
    const maxAge = remember ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
    const isProduction = process.env.NODE_ENV === 'production';
    const baseOpts = { secure: isProduction, sameSite: 'strict', path: '/' };
    res.cookie('token', result.token, { ...baseOpts, httpOnly: true, maxAge });
    res.cookie('auth_status', '1', { ...baseOpts, maxAge });
    res.cookie('user_role', result.user.role, { ...baseOpts, maxAge });
    if (result.user.site_id) {
      res.cookie('site_id', result.user.site_id, { ...baseOpts, maxAge });
    }
    res.json({ user: result.user });
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
    await AuthService.forgotPassword(email);
    res.json({ message: 'If the email exists, a reset link has been sent' });
  } catch (err) {
    console.error('[AuthController forgotPassword] ERROR:', err.message);
    next(err);
  }
};

// POST /api/auth/logout - Logout
export const logout = async (req, res, next) => {
  try {
    const isProduction = process.env.NODE_ENV === 'production';
    const baseOpts = { secure: isProduction, sameSite: 'strict', path: '/' };
    res.cookie('token', '', { ...baseOpts, httpOnly: true, maxAge: 0 });
    res.cookie('auth_status', '', { ...baseOpts, maxAge: 0 });
    res.cookie('user_role', '', { ...baseOpts, maxAge: 0 });
    res.cookie('site_id', '', { ...baseOpts, maxAge: 0 });
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
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
