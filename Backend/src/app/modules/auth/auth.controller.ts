import { Request, Response } from 'express';
import { catchAsync } from '../../shared/catchAsync';
import { sendResponse } from '../../shared/sendResponse';
import { authService } from './auth.service';

/**
 * Handle user signup
 * POST /auth/signup
 */
const signupHandler = catchAsync(async (req: Request, res: Response) => {
  const { name, email, phone, password } = req.body;

  const result = await authService.signupUser(name, email, phone, password);

  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "User registered successfully. Please check your email to verify your account.",
    data: {
      userId: result.userId,
    },
  });
});

/**
 * Handle user login
 * POST /auth/login
 */
const loginHandler = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const result = await authService.loginUser(email, password);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "User logged in successfully.",
    data: {
      token: result.token,
      user: result.user,
    },
  });
});

/**
 * Handle email verification
 * GET /auth/verify?token=abc123xyz
 */
const verifyEmailHandler = catchAsync(async (req: Request, res: Response) => {
  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    return sendResponse(res, {
      httpStatusCode: 400,
      success: false,
      message: 'Verification token is required',
    });
  }

  const result = await authService.verifyEmail(token);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Email verified successfully.",
  });
});

/**
 * Handle resend verification email
 * POST /auth/resend-verification
 */
const resendVerificationHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
      return sendResponse(res, {
        httpStatusCode: 400,
        success: false,
        message: 'Email is required',
      });
    }

    const result = await authService.resendVerificationEmail(email);

    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Verification email sent successfully.",
    });
  }
);

/**
 * Handle forgot password request
 * POST /auth/forgot-password
 */
const forgotPasswordHandler = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;

  const result = await authService.forgotPassword(email);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: result.message,
  });
});

/**
 * Handle password reset
 * POST /auth/reset-password
 */
const resetPasswordHandler = catchAsync(async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  if (!token) {
    return sendResponse(res, {
      httpStatusCode: 400,
      success: false,
      message: 'Reset token is required',
    });
  }

  await authService.resetPassword(token, newPassword);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'Password reset successfully. You can now login with your new password.',
  });
});


export const authController = {
  signupHandler,
  loginHandler,
  verifyEmailHandler,
  resendVerificationHandler,
  forgotPasswordHandler,
  resetPasswordHandler,
};