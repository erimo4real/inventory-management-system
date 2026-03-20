import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

let transporter = null;

try {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
} catch (error) {
  console.error('Email transporter not configured:', error.message);
}

export default class EmailService {
  static async sendPasswordResetEmail(email, resetToken) {
    if (!transporter) {
      console.log('Email not configured, skipping reset email. Token:', resetToken);
      return true;
    }
    
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: `"SIMS" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4f46e5;">SIMS - Password Reset</h2>
          <p>You requested a password reset. Click the button below to reset your password:</p>
          <a href="${resetUrl}" style="display: inline-block; background: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
            Reset Password
          </a>
          <p>Or copy this link: <a href="${resetUrl}">${resetUrl}</a></p>
          <p style="color: #666; font-size: 12px;">This link expires in 1 hour.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 12px;">If you didn't request this, please ignore this email.</p>
        </div>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Email send error:', error.message);
      return false;
    }
  }

  static async sendWelcomeEmail(email, name) {
    if (!transporter) {
      console.log('Email not configured, skipping welcome email');
      return true;
    }

    const mailOptions = {
      from: `"SIMS" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Welcome to SIMS',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4f46e5;">Welcome to SIMS!</h2>
          <p>Hi ${name},</p>
          <p>Your account has been created successfully.</p>
          <p>You can now login to manage your inventory.</p>
        </div>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Email send error:', error.message);
      return false;
    }
  }
}
