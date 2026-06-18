import { Router } from 'express';
import { batchController } from './batch.controller';
import { batchValidation } from './batch.validation';

const router = Router();

/**
 * POST /api/v1/batches
 * Create a new batch
 */
router.post(
  '/',
  batchValidation.validateCreateBatch,
  batchValidation.handleValidationErrors,
  batchController.createBatchHandler
);

/**
 * GET /api/v1/batches
 * Get all batches with optional filtering
 * Query params: branchId, classLevelId, status, skip, take
 */
router.get('/', batchController.getAllBatchesHandler);

/**
 * GET /api/v1/batches/:id
 * Get batch by ID
 */
router.get(
  '/:id',
  batchValidation.validateBatchId,
  batchValidation.handleValidationErrors,
  batchController.getBatchByIdHandler
);

/**
 * PATCH /api/v1/batches/:id
 * Update batch
 */
router.patch(
  '/:id',
  batchValidation.validateUpdateBatch,
  batchValidation.handleValidationErrors,
  batchController.updateBatchHandler
);

/**
 * DELETE /api/v1/batches/:id
 * Delete batch
 */
router.delete(
  '/:id',
  batchValidation.validateBatchId,
  batchValidation.handleValidationErrors,
  batchController.deleteBatchHandler
);

export const batchRoutes = router;
