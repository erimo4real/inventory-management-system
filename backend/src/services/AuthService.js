import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import UserRepository from '../repositories/UserRepository.js';
import EmailService from './EmailService.js';

const userRepo = new UserRepository();

export default class AuthService {
  static validatePassword(password) {
    if (!password || password.length < 6) {
      const error = new Error('Password must be at least 6 characters');
      error.status = 400;
      throw error;
    }
    if (password.length > 128) {
      const error = new Error('Password must be 128 characters or less');
      error.status = 400;
      throw error;
    }
  }

  static validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || !emailRegex.test(email)) {
      const error = new Error('Invalid email format');
      error.status = 400;
      throw error;
    }
  }

  static async register(data) {
    this.validateEmail(data.email);
    this.validatePassword(data.password);

    if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2 || data.name.length > 100) {
      const error = new Error('Name must be between 2 and 100 characters');
      error.status = 400;
      throw error;
    }

    const existing = await userRepo.findByEmail(data.email);
    if (existing) {
      const error = new Error('Email already registered');
      error.status = 400;
      throw error;
    }

    const isFirstUser = await userRepo.countUsers() === 0;
    if (!isFirstUser && !data.site_id) {
      const error = new Error('Site ID is required for registration');
      error.status = 400;
      throw error;
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await userRepo.create({
      ...data,
      password: hashedPassword,
      site_id: data.site_id ? parseInt(data.site_id) : null,
      role: isFirstUser ? 'admin' : (data.role || 'staff')
    });

    const token = this.generateToken(user);

    return {
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        site_id: user.site_id,
        avatar_url: user.avatar_url
      },
      token
    };
  }

  static async login(email, password, remember = false) {
    if (!email || !password) {
      const error = new Error('Email and password are required');
      error.status = 400;
      throw error;
    }

    const user = await userRepo.findByEmail(email);
    if (!user) {
      const error = new Error('Invalid credentials');
      error.status = 401;
      throw error;
    }

    const locked = await userRepo.isAccountLocked(user.id);
    if (locked) {
      const error = new Error('Account is temporarily locked. Please try again later.');
      error.status = 423;
      throw error;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      await userRepo.incrementFailedAttempts(user.id);

      const attempts = (user.failed_attempts || 0) + 1;
      if (attempts >= 5) {
        await userRepo.lockAccount(user.id, 15);
      }

      const error = new Error('Invalid credentials');
      error.status = 401;
      throw error;
    }

    // Reset failed attempts on successful login
    await userRepo.resetFailedAttempts(user.id);

    const token = this.generateToken(user, remember);

    return {
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        site_id: user.site_id,
        avatar_url: user.avatar_url
      },
      token,
      remember
    };
  }

  static async getCurrentUser(userId) {
    const user = await userRepo.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      site_id: user.site_id,
      avatar_url: user.avatar_url
    };
  }

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

    this.validatePassword(newPassword);

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userRepo.changePassword(userId, hashedPassword);
  }

  static async forgotPassword(email) {
    if (!email) {
      return;
    }

    const user = await userRepo.findByEmail(email);
    if (!user) {
      return;
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000);

    await userRepo.setResetToken(email, token, expires);

    try {
      await EmailService.sendPasswordResetEmail(email, token);
    } catch (emailError) {
      console.error('Failed to send reset email:', emailError.message);
    }
  }

  static async resetPassword(token, newPassword) {
    const user = await userRepo.findByResetToken(token);
    if (!user) {
      const error = new Error('Invalid or expired reset token');
      error.status = 400;
      throw error;
    }

    this.validatePassword(newPassword);

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userRepo.changePassword(user.id, hashedPassword);

    return { message: 'Password reset successfully' };
  }

  static generateToken(user, remember = false) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      const error = new Error('JWT_SECRET is not configured');
      error.status = 500;
      throw error;
    }
    const expiresIn = remember ? '7d' : '24h';
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role, site_id: user.site_id },
      secret,
      { expiresIn }
    );
  }

  static verifyToken(token) {
    try {
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        return null;
      }
      return jwt.verify(token, secret);
    } catch (err) {
      return null;
    }
  }
}
