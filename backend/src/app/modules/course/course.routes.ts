import { Router } from "express";
import { courseController } from "./course.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { UserRole } from "@/generated/prisma";
import { validateRequest } from "../../middleware/validateRequest";
import { CourseValidation } from "./course.validation";

const router = Router();

/**
 * POST /api/v1/courses/create-course
 * Create a new course – Super Admin or Branch Admin
 */
router.post(
  "/create-course",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.BRANCH_ADMIN),
  validateRequest(CourseValidation.createCourseZodSchema),
  courseController.createCourse
);

/**
 * GET /api/v1/courses
 * List all courses
 */
router.get(
  "/",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.BRANCH_ADMIN, UserRole.TEACHER, UserRole.STUDENT),
  courseController.getAllCourses
);

/**
 * GET /api/v1/courses/course/:id
 * Get course by ID
 */
router.get(
  "/course/:id",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.BRANCH_ADMIN, UserRole.TEACHER, UserRole.STUDENT),
  courseController.getCourseById
);

/**
 * PATCH /api/v1/courses/update/:id
 * Update a course – Super Admin or Branch Admin
 */
router.patch(
  "/update/:id",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.BRANCH_ADMIN),
  validateRequest(CourseValidation.updateCourseZodSchema),
  courseController.updateCourse
);

/**
 * DELETE /api/v1/courses/delete/:id
 * Delete a course – Super Admin only
 */
router.delete(
  "/delete/:id",
  checkAuth(UserRole.SUPER_ADMIN),
  courseController.deleteCourse
);

export const courseRoutes = router;
