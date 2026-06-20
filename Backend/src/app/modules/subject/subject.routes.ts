import { Router } from "express";
import { subjectController } from "./subject.controller";
import { validateRequest } from "@/app/middleware/validateRequest";
import { subjectValidation } from "./subject.validation";
import { authMiddleware } from "@/app/middleware/auth.middleware";

const router = Router();

router.post(
  "/create-subject",
  authMiddleware.authenticate,
  validateRequest(subjectValidation.createSubjectSchema),
  subjectController.createSubject
);

router.get(
  "/all-subjects",
  authMiddleware.authenticate,
  subjectController.getAllSubjects
);

router.get(
  "/:id",
  authMiddleware.authenticate,
  subjectController.getSubjectById
);

router.get(
  "/class/:classLevelId",
  authMiddleware.authenticate,
  subjectController.getSubjectsByClass
);

router.patch(
  "/:id",
  authMiddleware.authenticate,
  validateRequest(subjectValidation.updateSubjectSchema),
  subjectController.updateSubject
);

router.delete(
  "/:id",
  authMiddleware.authenticate,
  subjectController.deleteSubject
);

export const subjectRoutes = router;