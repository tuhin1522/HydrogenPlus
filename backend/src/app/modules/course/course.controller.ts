import { Request, Response } from "express";
import { courseService } from "./course.service";
import { catchAsync } from "@/app/shared/catchAsync";
import { sendResponse } from "@/app/shared/sendResponse";
import httpStatus from "http-status";

const createCourse = catchAsync(async (req: Request, res: Response) => {
  const course = await courseService.createCourse(req.body);
  sendResponse(res, {
    success: true,
    httpStatusCode: httpStatus.CREATED,
    message: "Course created successfully!",
    data: course,
  });
});

const getAllCourses = catchAsync(async (req: Request, res: Response) => {
  const result = await courseService.getAllCourses(req.query);
  sendResponse(res, {
    success: true,
    httpStatusCode: httpStatus.OK,
    message: "Courses retrieved successfully!",
    data: result.data,
    meta: result.meta,
  });
});

const getCourseById = catchAsync(async (req: Request, res: Response) => {
  const course = await courseService.getCourseById(req.params.id as string);
  sendResponse(res, {
    success: true,
    httpStatusCode: httpStatus.OK,
    message: "Course retrieved successfully!",
    data: course,
  });
});

const updateCourse = catchAsync(async (req: Request, res: Response) => {
  const course = await courseService.updateCourse(req.params.id as string, req.body);
  sendResponse(res, {
    success: true,
    httpStatusCode: httpStatus.OK,
    message: "Course updated successfully!",
    data: course,
  });
});

const deleteCourse = catchAsync(async (req: Request, res: Response) => {
  await courseService.deleteCourse(req.params.id as string);
  sendResponse(res, {
    success: true,
    httpStatusCode: httpStatus.OK,
    message: "Course deleted successfully!",
    data: null,
  });
});

export const courseController = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};
