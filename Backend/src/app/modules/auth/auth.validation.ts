import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../lib/prisma';
import {
  PASSWORD_REQUIREMENTS,
  PASSWORD_REGEX,
  AUTH_ERRORS,
} from './constants/auth.constants';

// Validation middleware for user signup
const validateSignup = [
  // Name validation
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters'),

  // Email validation
  body('email')
    .trim()
    .isEmail()
    .withMessage(AUTH_ERRORS.EMAIL_INVALID)
    .normalizeEmail()
    .custom(async (email) => {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new Error(AUTH_ERRORS.EMAIL_ALREADY_EXISTS);
      }
    }),

  // Phone validation
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^(?:\+880|880|0)1[3-9]\d{8}$/)
    .withMessage('Please provide a valid phone number'),

  // Password validation
  body('password')
    .isLength({ min: PASSWORD_REQUIREMENTS.MIN_LENGTH })
    .withMessage(AUTH_ERRORS.PASSWORD_TOO_SHORT)
    .matches(PASSWORD_REGEX.UPPERCASE)
    .withMessage(AUTH_ERRORS.PASSWORD_NO_UPPERCASE)
    .matches(PASSWORD_REGEX.NUMBER)
    .withMessage(AUTH_ERRORS.PASSWORD_NO_NUMBER)
    .matches(PASSWORD_REGEX.SPECIAL_CHAR)
    .withMessage(AUTH_ERRORS.PASSWORD_NO_SPECIAL_CHAR),
];

// Error handling middleware
const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error: any) => ({
      field: error.param,
      message: error.msg,
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: formattedErrors,
    });
  }

  next();
};

// Validation middleware for user login
const validateLogin = [
  body('email')
    .trim()
    .isEmail()
    .withMessage(AUTH_ERRORS.EMAIL_INVALID)
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

export const authValidation = { 
  validateSignup, 
  handleValidationErrors, 
  validateLogin 
};