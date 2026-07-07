import { Router } from 'express';
import { authController } from './auth.controller';
import { authValidation } from './auth.validation';
import { checkAuth } from '../../middleware/checkAuth';


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

router.get('/verify', authController.verifyEmailHandler);
router.post('/resend-verification', authController.resendVerificationHandler);
router.post('/forgot-password', authValidation.validateForgotPassword, authValidation.handleValidationErrors, authController.forgotPasswordHandler);

router.post('/reset-password', authValidation.validateResetPassword, authValidation.handleValidationErrors, authController.resetPasswordHandler);

router.post(
  '/change-password',
  checkAuth(),
  authValidation.validateChangePassword,
  authValidation.handleValidationErrors,
  authController.changePasswordHandler
);

export const authRoutes = router;