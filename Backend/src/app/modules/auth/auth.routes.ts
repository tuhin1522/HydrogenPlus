import { Router } from 'express';
import { authController } from './auth.controller';
import { authValidation } from './auth.validation';

const router = Router();

/**
 * POST /auth/signup
 * Create new user account
 * Middleware chain: validation → error handler → controller
 */
router.post('/signup', authValidation.validateSignup, authValidation.handleValidationErrors, authController.signupHandler);

/**
 * POST /auth/login
 * Login with email and password
 * Middleware chain: validation → error handler → controller
 */
router.post('/login', authValidation.validateLogin, authValidation.handleValidationErrors, authController.loginHandler);

/**
 * GET /auth/verify?token=abc123xyz
 * Verify email with token
 */
router.get('/verify', authController.verifyEmailHandler);

/**
 * POST /auth/resend-verification
 * Resend verification email
 */
router.post('/resend-verification', authController.resendVerificationHandler);

/**
 * POST /auth/forgot-password
 * Send password reset email
 */
router.post('/forgot-password', authValidation.validateForgotPassword, authValidation.handleValidationErrors, authController.forgotPasswordHandler);

/**
 * POST /auth/reset-password
 * Reset password using token
 */
router.post('/reset-password', authValidation.validateResetPassword, authValidation.handleValidationErrors, authController.resetPasswordHandler);


export const authRoutes = router;