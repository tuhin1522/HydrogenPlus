import { Request, Response } from "express";
import { catchAsync } from "@/app/shared/catchAsync";
import { sendResponse } from "@/app/shared/sendResponse";
import status from "http-status";
import { subjectService } from "./subject.service";

const createSubject = catchAsync(async (req: Request, res: Response) => {
  const result = await subjectService.createSubject(req.body);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Subject created successfully",
    data: result,
  });
});

const getAllSubjects = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await subjectService.getAllSubjects(query);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Subjects retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getSubjectById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await subjectService.getSubjectById(id as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Subject retrieved successfully",
    data: result,
  });
});

const getSubjectsByClass = catchAsync(async (req: Request, res: Response) => {
  const { classLevelId } = req.params;
  const result = await subjectService.getSubjectsByClass(classLevelId as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Subjects retrieved successfully for class level",
    data: result,
  });
});

const updateSubject = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await subjectService.updateSubject(id as string, req.body);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Subject updated successfully",
    data: result,
  });
});

const deleteSubject = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await subjectService.deleteSubject(id as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Subject deleted successfully",
    data: result,
  });
});

export const subjectController = {
  createSubject,
  getAllSubjects,
  getSubjectById,
  getSubjectsByClass,
  updateSubject,
  deleteSubject,
};