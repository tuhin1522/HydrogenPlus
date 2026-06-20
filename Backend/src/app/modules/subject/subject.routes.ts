import { Router } from "express";
import { subjectController } from "./subject.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { UserRole } from "@/generated/prisma";
import { validateRequest } from "../../middleware/validateRequest";
import { SubjectValidation } from "./subject.validation";

const router = Router();

/**
 * POST /api/v1/subjects
 * Create a new subject (SUPER_ADMIN, BRANCH_ADMIN)
 */
router.post(
  "/",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.BRANCH_ADMIN),
  validateRequest(SubjectValidation.createSubjectZodSchema),
  subjectController.createSubject
);

/**
 * GET /api/v1/subjects
 * Get all subjects with search/filter/pagination (all authenticated users)
 * Query params: searchTerm, classLevelId, page, limit, sortBy, sortOrder, include
 */
router.get(
  "/",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.BRANCH_ADMIN, UserRole.TEACHER, UserRole.STUDENT),
  subjectController.getAllSubjects
);

/**
 * GET /api/v1/subjects/:id
 * Get a specific subject by ID
 */
router.get(
  "/:id",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.BRANCH_ADMIN, UserRole.TEACHER, UserRole.STUDENT),
  subjectController.getSubjectById
);

/**
 * PATCH /api/v1/subjects/:id
 * Update subject name or code (SUPER_ADMIN, BRANCH_ADMIN)
 */
router.patch(
  "/:id",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.BRANCH_ADMIN),
  validateRequest(SubjectValidation.updateSubjectZodSchema),
  subjectController.updateSubject
);

/**
 * DELETE /api/v1/subjects/:id
 * Delete a subject (SUPER_ADMIN only)
 */
router.delete(
  "/:id",
  checkAuth(UserRole.SUPER_ADMIN),
  subjectController.deleteSubject
);

export const subjectRoutes = router;
