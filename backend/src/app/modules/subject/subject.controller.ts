import { Request, Response } from "express";
import { catchAsync } from "@/app/shared/catchAsync";
import { sendResponse } from "@/app/shared/sendResponse";
import { subjectService } from "./subject.service";
import status from "http-status";

const createSubject = catchAsync(async (req: Request, res: Response) => {
  const subject = await subjectService.createSubject(req.body);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Subject created successfully!",
    data: subject,
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
  const subject = await subjectService.getSubjectById(id as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Subject retrieved successfully!",
    data: subject,
  });
});

const updateSubject = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const subject = await subjectService.updateSubject(id as string, req.body);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Subject updated successfully!",
    data: subject,
  });
});

const deleteSubject = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const subject = await subjectService.deleteSubject(id as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Subject deleted successfully!",
    data: subject,
  });
});

export const subjectController = {
  createSubject,
  getAllSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
};
