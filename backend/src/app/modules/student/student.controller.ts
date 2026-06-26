import { Request, Response } from "express";
import { sendResponse } from "@/app/shared/sendResponse";
import { catchAsync } from "@/app/shared/catchAsync";
import { ICreateStudentProfile } from "./student.interface";
import { studentService } from './student.service';
import AppError from "@/app/errorHelpers/appError";
import httpStatus from "http-status";

const createStudentProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;

  const studentData = {
    ...req.body,
    userId,
  };

  const student = await studentService.createStudentProfile(studentData);

  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Student profile created successfully.",
    data: student,
  });
});

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  const student = await studentService.getMyProfile(user?.userId as string);

  if (!student) {
    throw new AppError(httpStatus.NOT_FOUND, "Student profile not found. Please create your profile.");
  }

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Student profile retrieved successfully.",
    data: student,
  });
});

const getAllStudents = catchAsync(async (req: Request, res: Response) => {
  const students = await studentService.getAllStudents(req.query);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Students retrieved successfully.",
    data: students.data,
    meta: students.meta,
  });
});

const getStudentById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const student = await studentService.getStudentById(id as string);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Student profile retrieved successfully.",
    data: student
  });
});

const updateMyprofile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const studentData: Partial<ICreateStudentProfile> = req.body;
  const updatedStudent = await studentService.updateMyProfile(userId as string, studentData);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "My profile updated successfully.",
    data: updatedStudent
  });
});

const updateProfilebyId = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const studentData: Partial<ICreateStudentProfile> = req.body;
  const updatedStudent = await studentService.updateProfilebyId(id as string, studentData);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Student profile updated successfully.",
    data: updatedStudent
  });
});

const deleteStudentProfile = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await studentService.deleteStudentProfile(id as string);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Student profile deleted successfully.",
  });
});

export const studentController = {
  createStudentProfile,
  getMyProfile,
  getAllStudents,
  getStudentById,
  updateMyprofile,
  updateProfilebyId,
  deleteStudentProfile,
};