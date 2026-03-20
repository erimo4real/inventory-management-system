import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserRepository from '../repositories/UserRepository.js';
import EmailService from './EmailService.js';

const userRepo = new UserRepository();

/**
 * AuthService - handles authentication and authorization
 */
export default class AuthService {
  /**
   * Register new user
   */
  static async register(data) {
    const existing = await userRepo.findByEmail(data.email);
    if (existing) {
      const error = new Error('Email already registered');
      error.status = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await userRepo.create({
      ...data,
      password: hashedPassword
    });

    const token = this.generateToken(user);

    return {
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token
    };
  }

  /**
   * Login user
   */
  static async login(email, password) {
    const user = await userRepo.findByEmail(email);
    if (!user) {
      const error = new Error('Invalid credentials');
      error.status = 401;
      throw error;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      const error = new Error('Invalid credentials');
      error.status = 401;
      throw error;
    }

    const token = this.generateToken(user);

    return {
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token
    };
  }

  /**
   * Get current user
   */
  static async getCurrentUser(userId) {
    const user = await userRepo.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }
    return user;
  }

  /**
   * Change password
   */
  static async changePassword(userId, oldPassword, newPassword) {
    const user = await userRepo.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }

    const isValidPassword = await bcrypt.compare(oldPassword, user.password);
    if (!isValidPassword) {
      const error = new Error('Current password is incorrect');
      error.status = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userRepo.changePassword(userId, hashedPassword);
  }

  /**
   * Forgot password - generate reset token and send email
   */
  static async forgotPassword(email) {
    const user = await userRepo.findByEmail(email);
    if (!user) {
      return null;
    }

    const crypto = await import('crypto');
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000);

    await userRepo.setResetToken(email, token, expires);

    // Send password reset email
    await EmailService.sendPasswordResetEmail(email, token);

    return { email: user.email };
  }

  /**
   * Reset password with token
   */
  static async resetPassword(token, newPassword) {
    const user = await userRepo.findByResetToken(token);
    if (!user) {
      const error = new Error('Invalid or expired reset token');
      error.status = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userRepo.changePassword(user.id, hashedPassword);

    return { message: 'Password reset successfully' };
  }

  /**
   * Generate JWT token
   */
  static generateToken(user) {
    const secret = process.env.JWT_SECRET || 'inventory-secret-key';
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      secret,
      { expiresIn: '24h' }
    );
  }

  /**
   * Verify JWT token
   */
  static verifyToken(token) {
    try {
      const secret = process.env.JWT_SECRET || 'inventory-secret-key';
      return jwt.verify(token, secret);
    } catch (err) {
      return null;
    }
  }
}
