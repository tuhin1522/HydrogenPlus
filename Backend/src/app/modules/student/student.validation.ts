import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

/**
 * Validation rules for updating a student profile.
 * All fields are optional — student can update any subset.
 */
const validateUpdateProfile = [
  body('guardianName')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Guardian name must be at least 2 characters'),

  body('guardianPhone')
    .optional()
    .trim()
    .matches(/^(?:\+880|880|0)1[3-9]\d{8}$/)
    .withMessage('Please provide a valid Bangladeshi phone number'),

  body('schoolName')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('School name must be at least 2 characters'),

  body('address')
    .optional()
    .trim()
    .isLength({ min: 5 })
    .withMessage('Address must be at least 5 characters'),
];

/**
 * Handles validation errors — returns 400 if any validation fails.
 */
const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e: any) => ({
        field: e.param,
        message: e.msg,
      })),
    });
  }

  next();
};

export const studentValidation = {
  validateUpdateProfile,
  handleValidationErrors,
};
