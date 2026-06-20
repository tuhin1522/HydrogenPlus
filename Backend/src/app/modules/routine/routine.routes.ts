import { Router } from "express";
import { routineController } from "./routine.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { UserRole } from "@/generated/prisma";
import { validateRequest } from "../../middleware/validateRequest";
import { RoutineValidation } from "./routine.validation";

const router = Router();

/**
 * POST /api/v1/routines/generate
 * Trigger automatic routine generation for a branch.
 * Body: { branchId, clearExisting?, workDays?, startHour?, endHour? }
 *
 * IMPORTANT: this route MUST be defined before /:id routes to avoid
 * the word "generate" being captured as an :id param.
 */
router.post(
  "/generate",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.BRANCH_ADMIN),
  validateRequest(RoutineValidation.generateRoutineZodSchema),
  routineController.generateRoutine
);

/**
 * DELETE /api/v1/routines/branch/:branchId
 * Clear all routines for a specific branch.
 * Also defined before /:id so "branch" is not captured as id.
 */
router.delete(
  "/branch/:branchId",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.BRANCH_ADMIN),
  routineController.clearBranchRoutines
);

/**
 * GET /api/v1/routines/batch/:batchId
 * Get a weekly schedule view (grouped by day) for a specific batch.
 */
router.get(
  "/batch/:batchId",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.BRANCH_ADMIN, UserRole.TEACHER, UserRole.STUDENT),
  routineController.getBatchSchedule
);

/**
 * POST /api/v1/routines
 * Manually add a single routine slot.
 */
router.post(
  "/",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.BRANCH_ADMIN),
  validateRequest(RoutineValidation.createRoutineZodSchema),
  routineController.createRoutine
);

/**
 * GET /api/v1/routines
 * List all routines with filter/search/pagination.
 * Query: branchId, batchId, dayOfWeek, searchTerm, page, limit, sortBy, sortOrder
 */
router.get(
  "/",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.BRANCH_ADMIN, UserRole.TEACHER, UserRole.STUDENT),
  routineController.getAllRoutines
);

/**
 * GET /api/v1/routines/:id
 * Get a single routine by ID.
 */
router.get(
  "/:id",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.BRANCH_ADMIN, UserRole.TEACHER, UserRole.STUDENT),
  routineController.getRoutineById
);

/**
 * DELETE /api/v1/routines/:id
 * Delete a single routine slot.
 */
router.delete(
  "/:id",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.BRANCH_ADMIN),
  routineController.deleteRoutine
);

export const routineRoutes = router;
