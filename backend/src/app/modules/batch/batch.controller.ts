import { Request, Response } from 'express';
import { catchAsync } from '../../shared/catchAsync';
import { sendResponse } from '../../shared/sendResponse';
import { batchService } from './batch.service';

/**
 * Create a new batch
 * POST /api/v1/batches
 */
const createBatchHandler = catchAsync(async (req: Request, res: Response) => {
  const { name, branchId, classLevelId, capacity, status } = req.body;

  const batch = await batchService.createBatch({
    name,
    branchId,
    classLevelId,
    capacity,
    status,
  });

  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: 'Batch created successfully',
    data: batch,
  });
});

/**
 * Get all batches
 * GET /api/v1/batches
 * Query params: branchId, classLevelId, status, skip, take
 */
const getAllBatchesHandler = catchAsync(async (req: Request, res: Response) => {
  const result = await batchService.getAllBatches(req.query);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'Batches retrieved successfully',
    data: result.data,
    meta: result.meta,
  });
});

/**
 * Get batch by ID
 * GET /api/v1/batches/:id
 */
const getBatchByIdHandler = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const batch = await batchService.getBatchById(id as string);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'Batch retrieved successfully',
    data: batch,
  });
});

/**
 * Update batch
 * PATCH /api/v1/batches/:id
 */
const updateBatchHandler = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, capacity, status } = req.body;

  const batch = await batchService.updateBatch(id as string, {
    name,
    capacity,
    status,
  });

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'Batch updated successfully',
    data: batch,
  });
});

/**
 * Delete batch
 * DELETE /api/v1/batches/:id
 */
const deleteBatchHandler = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const batch = await batchService.deleteBatch(id as string);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'Batch deleted successfully',
    data: batch,
  });
});

export const batchController = {
  createBatchHandler,
  getAllBatchesHandler,
  getBatchByIdHandler,
  updateBatchHandler,
  deleteBatchHandler,
};
