import { Request, Response } from 'express';
import { catchAsync } from '../../shared/catchAsync';
import { sendResponse } from '../../shared/sendResponse';
import { studentService } from './student.service';

/**
 * GET /students/profile
 * Get the logged-in student's own profile
 */
const getMyProfileHandler = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.userId;

    const profile = await studentService.getMyProfile(userId);

    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'Student profile retrieved successfully',
      data: profile,
    });
  }
);

/**
 * PATCH /students/profile
 * Update the logged-in student's own profile
 */
const updateMyProfileHandler = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.userId;
    const { guardianName, guardianPhone, schoolName, address } = req.body;

    const updated = await studentService.updateMyProfile(userId, {
      guardianName,
      guardianPhone,
      schoolName,
      address,
    });

    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'Student profile updated successfully',
      data: updated,
    });
  }
);

/**
 * GET /students
 * Get all students (Branch Admin / Super Admin)
 */
const getAllStudentsHandler = catchAsync(
  async (_req: Request, res: Response) => {
    const students = await studentService.getAllStudents();

    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'Students retrieved successfully',
      data: students,
    });
  }
);

/**
 * GET /students/:id
 * Get student by StudentProfile ID (Branch Admin / Super Admin)
 */
const getStudentByIdHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const student = await studentService.getStudentById(id as string);

    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'Student retrieved successfully',
      data: student,
    });
  }
);

export const studentController = {
  getMyProfileHandler,
  updateMyProfileHandler,
  getAllStudentsHandler,
  getStudentByIdHandler,
};
