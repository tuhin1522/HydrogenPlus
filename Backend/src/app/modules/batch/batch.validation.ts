import { body, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../lib/prisma';

// Validation middleware for batch creation
const validateCreateBatch = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Batch name is required')
    .isLength({ min: 2 })
    .withMessage('Batch name must be at least 2 characters'),

  body('branchId')
    .trim()
    .notEmpty()
    .withMessage('Branch ID is required')
    .custom(async (branchId) => {
      const branch = await prisma.branch.findUnique({
        where: { id: branchId },
      });
      if (!branch) {
        throw new Error('Branch not found');
      }
    }),

  body('classLevelId')
    .trim()
    .notEmpty()
    .withMessage('Class level ID is required')
    .custom(async (classLevelId) => {
      const classLevel = await prisma.classLevel.findUnique({
        where: { id: classLevelId },
      });
      if (!classLevel) {
        throw new Error('Class level not found');
      }
    }),

  body('capacity')
    .isInt({ min: 1 })
    .withMessage('Capacity must be a positive number'),

  body('status')
    .optional()
    .isIn(['ACTIVE', 'INACTIVE'])
    .withMessage('Status must be ACTIVE or INACTIVE'),
];

// Validation middleware for batch update
const validateUpdateBatch = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Batch ID is required'),

  body('name')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Batch name must be at least 2 characters'),

  body('capacity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Capacity must be a positive number'),

  body('status')
    .optional()
    .isIn(['ACTIVE', 'INACTIVE'])
    .withMessage('Status must be ACTIVE or INACTIVE'),
];

// Validation middleware for batch ID
const validateBatchId = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Batch ID is required'),
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
      field: error.param || error.path,
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

export const batchValidation = {
  validateCreateBatch,
  validateUpdateBatch,
  validateBatchId,
  handleValidationErrors,
};
