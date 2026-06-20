import { Request, Response } from "express";
import { sendResponse } from "@/app/shared/sendResponse";
import { catchAsync } from "@/app/shared/catchAsync";
import { ICreateStudentProfile } from "./student.interface";
import { studentService } from './student.service';

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

const getMyProfileHandler = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;

  const student = await studentService.getMyProfile(userId);

  if (!student) {
    throw new Error("Student profile not found");
  }

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Student profile retrieved successfully.",
    data: student,
  });
});

const getAllStudentsHandler = catchAsync(async (req: Request, res: Response) => {
  const students = await studentService.getAllStudents(req.query);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Students retrieved successfully.",
    data: students.data,
    meta: students.meta,
  });
});

const getStudentByIdHandler = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const student = await studentService.getStudentById(id as string);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Student profile retrieved successfully.",
    data: student
  });
});

const updateMyProfileHandler = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const studentData: Partial<ICreateStudentProfile> = req.body;
  const updatedStudent = await studentService.updateMyProfile(id as string, studentData);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Student profile updated successfully.",
    data: updatedStudent
  });
});

const deleteStudentProfileHandler = catchAsync(async (req: Request, res: Response) => {
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
  getMyProfileHandler,
  getAllStudentsHandler,
  getStudentByIdHandler,
  updateMyProfileHandler,
  deleteStudentProfileHandler,
};