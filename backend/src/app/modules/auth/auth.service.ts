import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { prisma } from '../../lib/prisma';
import { v4 as uuidv4 } from 'uuid';
import { TOKEN_EXPIRY, AUTH_ERRORS } from './auth.constants';
import { QueryBuilder } from "@/app/utils/queryBuilder";
import { IQueryParams } from "@/app/interface/query.interface";

// Configure nodemailer transporter for Gmail
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Generate verification token and save to database
 */
const generateVerificationToken = async (email: string): Promise<string> => {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + TOKEN_EXPIRY.VERIFICATION_TOKEN);

  await prisma.verificationToken.create({
    data: {
      id: uuidv4(),
      email,
      token,
      expires: expiresAt,
    },
  });

  return token;
};

/**
 * Send verification email with token link
 */
const sendVerificationEmail = async (
  email: string,
  name: string,
  token: string
): Promise<void> => {
  const verificationUrl = `http://localhost:3000/verify?token=${token}`;

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 40px 20px; border-radius: 8px;">
      <div style="background-color: #ffffff; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: center;">
        <h2 style="color: #007bff; font-size: 20px; margin-bottom: 24px; font-weight: 700; letter-spacing: 0.5px;">Hydrogen Plus Coaching Center</h2>
        <h1 style="color: #111827; font-size: 24px; margin-bottom: 8px; margin-top: 0;">Welcome, ${name}!</h1>
        <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
          Thank you for signing up at Hydrogen Plus Coaching Center. We're excited to have you on board. Please verify your email address to get started.
        </p>
        
        <div style="margin: 32px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #007bff; color: #ffffff; padding: 14px 28px; 
                    text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block;">
            Verify Email Address
          </a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; margin-bottom: 12px;">Or copy and paste this link into your browser:</p>
        <p style="background-color: #f3f4f6; padding: 12px; border-radius: 6px; word-break: break-all; margin-top: 0; font-size: 13px;">
          <a href="${verificationUrl}" style="color: #007bff; text-decoration: none;">${verificationUrl}</a>
        </p>
        
        <div style="margin-top: 40px; border-top: 1px solid #e5e7eb; padding-top: 24px;">
          <p style="color: #9ca3af; font-size: 13px; line-height: 1.5; margin: 0;">
            This link will expire in 24 hours.<br>
            If you didn't create this account, you can safely ignore this email.<br><br>
            &copy; ${new Date().getFullYear()} Hydrogen Plus Coaching Center
          </p>
        </div>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Verify Your Email Address',
    html: htmlContent,
  });
};

/**
 * Send password reset email with token link
 */
const sendPasswordResetEmail = async (
  email: string,
  name: string,
  token: string
): Promise<void> => {
  const resetUrl = `http://localhost:3000/reset-password?token=${token}`;

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 40px 20px; border-radius: 8px;">
      <div style="background-color: #ffffff; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: center;">
        <h2 style="color: #007bff; font-size: 20px; margin-bottom: 24px; font-weight: 700; letter-spacing: 0.5px;">Hydrogen Plus Coaching Center</h2>
        <h1 style="color: #111827; font-size: 24px; margin-bottom: 8px; margin-top: 0;">Reset Your Password</h1>
        <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
          Hi ${name}, we received a request to reset your password for your Hydrogen Plus Coaching Center account.
        </p>
        
        <div style="margin: 32px 0;">
          <a href="${resetUrl}" 
             style="background-color: #007bff; color: #ffffff; padding: 14px 28px; 
                    text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block;">
            Reset Password
          </a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; margin-bottom: 12px;">Or copy and paste this link into your browser:</p>
        <p style="background-color: #f3f4f6; padding: 12px; border-radius: 6px; word-break: break-all; margin-top: 0; font-size: 13px;">
          <a href="${resetUrl}" style="color: #007bff; text-decoration: none;">${resetUrl}</a>
        </p>
        
        <div style="margin-top: 40px; border-top: 1px solid #e5e7eb; padding-top: 24px;">
          <p style="color: #9ca3af; font-size: 13px; line-height: 1.5; margin: 0;">
            This link will expire in 1 hour.<br>
            If you did not request a password reset, no further action is required.<br><br>
            &copy; ${new Date().getFullYear()} Hydrogen Plus Coaching Center
          </p>
        </div>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Reset Your Password',
    html: htmlContent,
  });
};/**
 * Create new user with signup
 */
const signupUser = async (
  name: string,
  email: string,
  phone: string,
  password: string
): Promise<{ success: boolean; message: string; userId?: string }> => {
  try {
    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create user in database
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        emailVerified: false,
        role: 'STUDENT', // Default role for self-registration
      },
    });

    try {
      // Generate verification token
      const verificationToken = await generateVerificationToken(email);

      // Send verification email asynchronously (do not await) to speed up signup
      sendVerificationEmail(email, name, verificationToken).catch(console.error);

      return {
        success: true,
        message: 'Signup successful! Please check your email to verify your account.',
        userId: user.id,
      };
    } catch (emailError: any) {
      // Rollback if email logic fails entirely
      await prisma.verificationToken.deleteMany({ where: { email } });
      await prisma.user.delete({ where: { id: user.id } });
      throw new Error(`Unable to complete signup (${emailError.message}).`);
    }
  } catch (error: any) {
    throw new Error(`Signup failed: ${error.message}`);
  }
};

/**
 * Verify email using token and return auth token/user directly for auto-login
 */
const verifyEmail = async (
  token: string
): Promise<{ success: boolean; message: string; token: string; user: any }> => {
  try {
    // Find verification token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken) {
      throw new Error(AUTH_ERRORS.INVALID_TOKEN);
    }

    // Check if token has expired
    if (new Date() > verificationToken.expires) {
      // Delete expired token
      await prisma.verificationToken.delete({
        where: { token },
      });
      throw new Error(AUTH_ERRORS.INVALID_TOKEN);
    }

    // Update user as verified
    const user = await prisma.user.update({
      where: { email: verificationToken.email },
      data: { emailVerified: true },
    });

    // Delete verification token
    await prisma.verificationToken.delete({
      where: { token },
    });

    // Generate JWT token for auto-login
    const jwtToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    return {
      success: true,
      message: 'Email verified successfully! Welcome to your dashboard.',
      token: jwtToken,
      user: userWithoutPassword,
    };
  } catch (error: any) {
    throw new Error(error.message || 'Email verification failed');
  }
};

/**
 * Login user with email and password
 */
const loginUser = async (
  email: string,
  password: string
): Promise<{ success: boolean; token: string; user: any }> => {
  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error(AUTH_ERRORS.INVALID_CREDENTIALS);
    }

    // Check if email is verified
    if (!user.emailVerified) {
      throw new Error(AUTH_ERRORS.EMAIL_NOT_VERIFIED);
    }

    // Compare password
    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error(AUTH_ERRORS.INVALID_CREDENTIALS);
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    return {
      success: true,
      token,
      user: userWithoutPassword,
    };
  } catch (error: any) {
    throw new Error(error.message || 'Login failed');
  }
};

/**
 * Resend verification email (for users who didn't receive it)
 */
const resendVerificationEmail = async (
  email: string
): Promise<{ success: boolean; message: string }> => {
  try {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.emailVerified) {
      throw new Error('Email is already verified');
    }

    // Generate new verification token
    const verificationToken = await generateVerificationToken(email);

    // Send verification email
    await sendVerificationEmail(email, user.name || 'User', verificationToken);

    return {
      success: true,
      message: 'Verification email sent successfully',
    };
  } catch (error: any) {
    throw new Error(error.message || 'Failed to resend verification email');
  }
};

/**
 * Handle forgot password - generate reset token and send email
 */
const forgotPassword = async (
  email: string
): Promise<{ success: boolean; message: string }> => {
  try {
    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });

    // Important: Always return success even if user not found (prevents email enumeration)
    if (!user) {
      return {
        success: true,
        message: 'If this email is registered, you will receive a reset link.',
      };
    }

    // Generate a secure random reset token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRY.RESET_TOKEN);

    // Save token to database
    await prisma.passwordResetToken.create({
      data: {
        id: uuidv4(),
        email,
        token,
        expires: expiresAt,
      },
    });

    // Send reset email
    await sendPasswordResetEmail(email, user.name || 'User', token);

    return {
      success: true,
      message: 'If this email is registered, you will receive a reset link.',
    };
  } catch (error: any) {
    throw new Error(error.message || 'Failed to process password reset request');
  }
};

/**
 * Handle reset password - validate token and update password
 */
const resetPassword = async (
  token: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> => {
  try {
    // Find the reset token in database
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken) {
      throw new Error(AUTH_ERRORS.INVALID_RESET_TOKEN);
    }

    // Check if token has expired
    if (new Date() > resetToken.expires) {
      await prisma.passwordResetToken.delete({ where: { token } });
      throw new Error(AUTH_ERRORS.INVALID_RESET_TOKEN);
    }

    // Hash the new password
    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    // Update user's password
    await prisma.user.update({
      where: { email: resetToken.email },
      data: { password: hashedPassword },
    });

    // Delete the used reset token (one-time use)
    await prisma.passwordResetToken.delete({ where: { token } });

    return {
      success: true,
      message: 'Password reset successfully. You can now login with your new password.',
    };
  } catch (error: any) {
    throw new Error(error.message || 'Failed to reset password');
  }
};

/**
 * Handle change password for authenticated user
 */
const changePassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcryptjs.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid old password');
    }

    const hashedPassword = await bcryptjs.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { success: true, message: 'Password changed successfully' };
  } catch (error: any) {
    throw new Error(error.message || 'Failed to change password');
  }
};


export const authService = {
  signupUser,
  verifyEmail,
  loginUser,
  resendVerificationEmail,
  sendPasswordResetEmail,
  forgotPassword,
  resetPassword,
  changePassword,
};