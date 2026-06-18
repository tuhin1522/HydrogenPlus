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

export const authRoutes = router;