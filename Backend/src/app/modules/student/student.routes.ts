import { Router } from 'express';
import { studentController } from './student.controller';
import { studentValidation } from './student.validation';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

/**
 * GET /students/profile
 * Returns the logged-in student's own profile.
 * Requires: valid JWT token
 */
router.get(
  '/profile',
  authMiddleware.authenticate,
  studentController.getMyProfileHandler
);

/**
 * PATCH /students/profile
 * Updates the logged-in student's own profile (guardianName, guardianPhone, schoolName, address).
 * Requires: valid JWT token
 */
router.patch(
  '/profile',
  authMiddleware.authenticate,
  studentValidation.validateUpdateProfile,
  studentValidation.handleValidationErrors,
  studentController.updateMyProfileHandler
);

/**
 * GET /students
 * Returns all students. Intended for Branch Admin / Super Admin.
 * Requires: valid JWT token
 */
router.get(
  '/',
  authMiddleware.authenticate,
  studentController.getAllStudentsHandler
);

/**
 * GET /students/:id
 * Returns a single student by their StudentProfile ID.
 * Intended for Branch Admin / Super Admin.
 * Requires: valid JWT token
 */
router.get(
  '/:id',
  authMiddleware.authenticate,
  studentController.getStudentByIdHandler
);

export const studentRoutes = router;
