import { Router } from 'express';
import { batchController } from './batch.controller';
import { BatchValidation } from './batch.validation';
import { checkAuth } from '../../middleware/checkAuth';
import { UserRole } from '@/generated/prisma';
import { validateRequest } from '../../middleware/validateRequest';

const router = Router();

/**
 * POST /api/v1/batches
 * Create a new batch
 */
router.post(
  '/',
  checkAuth(UserRole.SUPER_ADMIN, UserRole.BRANCH_ADMIN),
  validateRequest(BatchValidation.createBatchZodSchema),
  batchController.createBatchHandler
);

/**
 * GET /api/v1/batches
 * Get all batches with optional filtering
 * Query params: branchId, classLevelId, status, skip, take
 */
router.get('/', checkAuth(UserRole.SUPER_ADMIN, UserRole.BRANCH_ADMIN, UserRole.TEACHER), batchController.getAllBatchesHandler);

/**
 * GET /api/v1/batches/:id
 * Get batch by ID
 */
router.get(
  '/:id',
  checkAuth(UserRole.SUPER_ADMIN, UserRole.BRANCH_ADMIN, UserRole.TEACHER, UserRole.STUDENT),
  batchController.getBatchByIdHandler
);

/**
 * PATCH /api/v1/batches/:id
 * Update batch
 */
router.patch(
  '/:id',
  checkAuth(UserRole.SUPER_ADMIN, UserRole.BRANCH_ADMIN),
  validateRequest(BatchValidation.updateBatchZodSchema),
  batchController.updateBatchHandler
);

/**
 * DELETE /api/v1/batches/:id
 * Delete batch
 */
router.delete(
  '/:id',
  checkAuth(UserRole.SUPER_ADMIN, UserRole.BRANCH_ADMIN),
  batchController.deleteBatchHandler
);

export const batchRoutes = router;
