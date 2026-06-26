import { Request, Response } from "express";
import { catchAsync } from "@/app/shared/catchAsync";
import { sendResponse } from "@/app/shared/sendResponse";
import { routineService } from "./routine.service";
import status from "http-status";

const createRoutine = catchAsync(async (req: Request, res: Response) => {
  const routine = await routineService.createRoutine(req.body);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Routine slot created successfully!",
    data: routine,
  });
});

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

const getRoutineById = catchAsync(async (req: Request, res: Response) => {
  const routine = await routineService.getRoutineById(req.params.id as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Routine retrieved successfully!",
    data: routine,
  });
});

const getBatchSchedule = catchAsync(async (req: Request, res: Response) => {
  const result = await routineService.getBatchSchedule(req.params.batchId as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Batch schedule retrieved successfully!",
    data: result,
  });
});

const deleteRoutine = catchAsync(async (req: Request, res: Response) => {
  await routineService.deleteRoutine(req.params.id as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Routine deleted successfully!",
  });
});

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
  createRoutine,
  getAllRoutines,
  getRoutineById,
  getBatchSchedule,
  deleteRoutine,
  clearBranchRoutines,
};
