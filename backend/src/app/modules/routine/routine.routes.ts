import { Router } from "express";
import { routineController } from "./routine.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { UserRole } from "@/generated/prisma";
import { validateRequest } from "../../middleware/validateRequest";
import { RoutineValidation } from "./routine.validation";

const router = Router();


router.get(
  "/",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.BRANCH_ADMIN, UserRole.TEACHER, UserRole.STUDENT),
  routineController.getAllRoutines
);
router.get(
  "/batch/:batchId",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.BRANCH_ADMIN, UserRole.TEACHER, UserRole.STUDENT),
  routineController.getBatchSchedule
);

router.get(
  "/:id",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.BRANCH_ADMIN, UserRole.TEACHER, UserRole.STUDENT),
  routineController.getRoutineById
);

router.post(
  "/create-routine",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.BRANCH_ADMIN),
  validateRequest(RoutineValidation.createRoutineZodSchema),
  routineController.createRoutine
);

router.delete(
  "/branch/:branchId",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.BRANCH_ADMIN),
  routineController.clearBranchRoutines
);

router.delete(
  "/:id",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.BRANCH_ADMIN),
  routineController.deleteRoutine
);

export const routineRoutes = router;
