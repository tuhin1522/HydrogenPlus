import { Request, Response } from "express";
import { catchAsync } from "@/app/shared/catchAsync";
import { teacherService } from "./teacher.service";
import { sendResponse } from "@/app/shared/sendResponse";
import { status } from "http-status";

const createTeacher = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const teacher = await teacherService.createTeacherProfile(payload);

  sendResponse(res, {
    success: true,
    httpStatusCode: status.CREATED,
    message: 'Teacher Profile Created Successfully!',
    data: teacher,
  })
});

const getAllTeachers = catchAsync(async (req: Request, res: Response) => {
  const teachers = await teacherService.getAllTeachers(req.query);

  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: 'Teachers Retrieved Successfully!',
    data: teachers.data,
    meta: teachers.meta,
  })
});

const getTeacherById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const teacher = await teacherService.getTeacherById(id as string);

  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: 'Teacher Retrieved Successfully!',
    data: teacher,
  })
});

const updateTeacher = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const teacher = await teacherService.updateTeacherProfile(id as string, payload);

  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: 'Teacher Profile Updated Successfully!',
    data: teacher,
  })
});

const deleteTeacher = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const teacher = await teacherService.deleteTeacherProfile(id as string);

  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: 'Teacher Profile Deleted Successfully!',
    data: teacher,   
  });
});

export const teacherController = {
  createTeacher,
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
};