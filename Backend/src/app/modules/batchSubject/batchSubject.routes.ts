import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { UserRole } from "@/generated/prisma";
import { validateRequest } from "../../middleware/validateRequest";
import { batchSubjectController } from "./batchSubject.controller";
import { BatchSubjectValidation } from "./batchSubject.validation";

const router = Router();

router.post(
    "/",
    checkAuth(UserRole.SUPER_ADMIN, UserRole.BRANCH_ADMIN),
    validateRequest(BatchSubjectValidation.createBatchSubjectZodSchema),
    batchSubjectController.createBatchSubject
);

router.get(
    "/",
    checkAuth(UserRole.SUPER_ADMIN, UserRole.BRANCH_ADMIN, UserRole.TEACHER, UserRole.STUDENT),
    batchSubjectController.getAllBatchSubjects
);

router.get(
    "/:id",
    checkAuth(UserRole.SUPER_ADMIN, UserRole.BRANCH_ADMIN, UserRole.TEACHER, UserRole.STUDENT),
    batchSubjectController.getBatchSubjectById
);

router.patch(
    "/:id",
    checkAuth(UserRole.SUPER_ADMIN, UserRole.BRANCH_ADMIN),
    batchSubjectController.updateBatchSubject
);

router.delete(
    "/:id",
    checkAuth(UserRole.SUPER_ADMIN, UserRole.BRANCH_ADMIN),
    batchSubjectController.deleteBatchSubject
);

export const batchSubjectRoutes = router;
