import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { prisma } from '../../lib/prisma';
import { v4 as uuidv4 } from 'uuid';
import { TOKEN_EXPIRY, AUTH_ERRORS } from './constants/auth.constants';

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
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Welcome ${name}!</h2>
      <p>Thank you for signing up. Please verify your email address to complete your registration.</p>
      
      <div style="margin: 30px 0;">
        <a href="${verificationUrl}" 
           style="background-color: #007bff; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 4px; display: inline-block;">
          Verify Email
        </a>
      </div>
      
      <p>Or copy this link: <a href="${verificationUrl}">${verificationUrl}</a></p>
      
      <p style="color: #666; font-size: 12px;">
        This link will expire in 24 hours.
      </p>
      
      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
      <p style="color: #999; font-size: 12px;">
        If you didn't create this account, please ignore this email.
      </p>
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
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Password Reset Request</h2>
      <p>Hi ${name}, we received a request to reset your password.</p>
      
      <div style="margin: 30px 0;">
        <a href="${resetUrl}" 
           style="background-color: #dc3545; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 4px; display: inline-block;">
          Reset Password
        </a>
      </div>
      
      <p>Or copy this link: <a href="${resetUrl}">${resetUrl}</a></p>
      
      <p style="color: #666; font-size: 12px;">
        This link will expire in 1 hour. If you did not request this, please ignore this email.
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Reset Your Password',
    html: htmlContent,
  });
};


/**
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
      },
    });

    // Generate verification token
    const verificationToken = await generateVerificationToken(email);

    // Send verification email
    await sendVerificationEmail(email, name, verificationToken);

    return {
      success: true,
      message:
        'Signup successful! Check your email to verify your account.',
      userId: user.id,
    };
  } catch (error: any) {
    throw new Error(`Signup failed: ${error.message}`);
  }
};

/**
 * Verify email using token
 */
const verifyEmail = async (
  token: string
): Promise<{ success: boolean; message: string }> => {
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
    await prisma.user.update({
      where: { email: verificationToken.email },
      data: { emailVerified: true },
    });

    // Delete verification token
    await prisma.verificationToken.delete({
      where: { token },
    });

    return {
      success: true,
      message: 'Email verified successfully! You can now login.',
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


export const authService = {
  signupUser,
  verifyEmail,
  loginUser,
  resendVerificationEmail,
  sendPasswordResetEmail,
  forgotPassword,
  resetPassword,
};