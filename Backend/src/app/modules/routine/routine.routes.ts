import { Router } from "express";
import { routineController } from "./routine.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { UserRole } from "@/generated/prisma";
import { validateRequest } from "../../middleware/validateRequest";
import { RoutineValidation } from "./routine.validation";

const router = Router();

router.post(
  "/generate",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.BRANCH_ADMIN),
  validateRequest(RoutineValidation.generateRoutineZodSchema),
  routineController.generateRoutine
);

router.get(
  "/",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.BRANCH_ADMIN, UserRole.TEACHER, UserRole.STUDENT),
  routineController.getAllRoutines
);

router.delete(
  "/branch/:branchId",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.BRANCH_ADMIN),
  routineController.clearBranchRoutines
);

router.get(
  "/batch/:batchId",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.BRANCH_ADMIN, UserRole.TEACHER, UserRole.STUDENT),
  routineController.getBatchSchedule
);

router.post(
  "/",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.BRANCH_ADMIN),
  validateRequest(RoutineValidation.createRoutineZodSchema),
  routineController.createRoutine
);

router.get(
  "/:id",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.BRANCH_ADMIN, UserRole.TEACHER, UserRole.STUDENT),
  routineController.getRoutineById
);

router.delete(
  "/:id",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.BRANCH_ADMIN),
  routineController.deleteRoutine
);

export const routineRoutes = router;
