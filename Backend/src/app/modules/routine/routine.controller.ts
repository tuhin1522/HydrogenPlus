import { Request, Response } from "express";
import { catchAsync } from "@/app/shared/catchAsync";
import { sendResponse } from "@/app/shared/sendResponse";
import { routineService } from "./routine.service";
import status from "http-status";

/** POST /api/v1/routines/generate */
const generateRoutine = catchAsync(async (req: Request, res: Response) => {
  const result = await routineService.generateRoutine(req.body);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: result.message,
    data: {
      generated: result.generated,
      unscheduled: result.unscheduled,
      unscheduledDetails: result.unscheduledDetails,
    },
  });
});

/** POST /api/v1/routines — manually add one slot */
const createRoutine = catchAsync(async (req: Request, res: Response) => {
  const routine = await routineService.createRoutine(req.body);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Routine slot created successfully!",
    data: routine,
  });
});

/** GET /api/v1/routines */
const getAllRoutines = catchAsync(async (req: Request, res: Response) => {
  const result = await routineService.getAllRoutines(req.query);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Routines retrieved successfully!",
    data: result.data,
    meta: result.meta,
  });
});

/** GET /api/v1/routines/:id */
const getRoutineById = catchAsync(async (req: Request, res: Response) => {
  const routine = await routineService.getRoutineById(req.params.id as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Routine retrieved successfully!",
    data: routine,
  });
});

/** GET /api/v1/routines/batch/:batchId — weekly schedule for a batch */
const getBatchSchedule = catchAsync(async (req: Request, res: Response) => {
  const result = await routineService.getBatchSchedule(req.params.batchId as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Batch schedule retrieved successfully!",
    data: result,
  });
});

/** DELETE /api/v1/routines/:id */
const deleteRoutine = catchAsync(async (req: Request, res: Response) => {
  await routineService.deleteRoutine(req.params.id as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Routine deleted successfully!",
  });
});

/** DELETE /api/v1/routines/branch/:branchId — clear all routines for a branch */
const clearBranchRoutines = catchAsync(async (req: Request, res: Response) => {
  const result = await routineService.clearBranchRoutines(req.params.branchId as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: result.message,
    data: { deleted: result.deleted },
  });
});

export const routineController = {
  generateRoutine,
  createRoutine,
  getAllRoutines,
  getRoutineById,
  getBatchSchedule,
  deleteRoutine,
  clearBranchRoutines,
};
