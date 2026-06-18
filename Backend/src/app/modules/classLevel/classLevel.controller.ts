import { Request, Response } from "express";
import { catchAsync } from "@/app/shared/catchAsync";
import { classLevelService } from "./classLevel.services";
import { sendResponse } from "@/app/shared/sendResponse";
import status from "http-status";

const createClassLevel = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const classLevel = await classLevelService.createClassLevel(payload);

  sendResponse(res, {
    success: true,
    httpStatusCode: status.CREATED,
    message: 'Class Level Created Successfully!',
    data: classLevel,
  })
});

const getAllClassLevels = catchAsync(async (req: Request, res: Response) => {
  const classLevels = await classLevelService.getAllClassLevels();

  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: 'Class Levels Retrieved Successfully!',
    data: classLevels,
  })
});

const getClassLevelById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const classLevel = await classLevelService.getClassLevelById(id as string);

  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: 'Class Level Retrieved Successfully!',
    data: classLevel,
  })
});

const updateClassLevel = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const classLevel = await classLevelService.updateClassLevel(id as string, payload);

  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: 'Class Level Updated Successfully!',
    data: classLevel,
  })
});

const deleteClassLevel = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const classLevel = await classLevelService.deleteClassLevel(id as string);

  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: 'Class Level Deleted Successfully!',
    data: classLevel,   
  });
});

export const classLevelController = {
  createClassLevel,
  getAllClassLevels,
  getClassLevelById,
  updateClassLevel,
  deleteClassLevel,
};