import { Router } from "express";
import { subjectController } from "./subject.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { UserRole } from "@/generated/prisma";
import { validateRequest } from "../../middleware/validateRequest";
import { SubjectValidation } from "./subject.validation";

const router = Router();

router.post(
  "/createSubject",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.BRANCH_ADMIN),
  validateRequest(SubjectValidation.createSubjectZodSchema),
  subjectController.createSubject
);

router.get(
  "/",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.BRANCH_ADMIN, UserRole.TEACHER, UserRole.STUDENT),
  subjectController.getAllSubjects
);

router.get(
  "/:id",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.BRANCH_ADMIN, UserRole.TEACHER, UserRole.STUDENT),
  subjectController.getSubjectById
);

router.patch(
  "/:id",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.BRANCH_ADMIN),
  validateRequest(SubjectValidation.updateSubjectZodSchema),
  subjectController.updateSubject
);

router.delete(
  "/:id",
  checkAuth(UserRole.SUPER_ADMIN),
  subjectController.deleteSubject
);

export const subjectRoutes = router;