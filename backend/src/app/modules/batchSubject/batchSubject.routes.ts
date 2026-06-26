import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { UserRole } from "@/generated/prisma";
import { validateRequest } from "../../middleware/validateRequest";
import { batchSubjectController } from "./batchSubject.controller";
import { BatchSubjectValidation } from "./batchSubject.validation";

const router = Router();

router.post(
    "/create-batch-subject",
    checkAuth(UserRole.SUPER_ADMIN, UserRole.BRANCH_ADMIN),
    validateRequest(BatchSubjectValidation.createBatchSubjectZodSchema),
    batchSubjectController.createBatchSubject
);

router.get(
    "/batch-subjects",
    checkAuth(UserRole.SUPER_ADMIN, UserRole.BRANCH_ADMIN, UserRole.TEACHER, UserRole.STUDENT),
    batchSubjectController.getAllBatchSubjects
);

router.get(
    "/batch-subject/:id",
    checkAuth(UserRole.SUPER_ADMIN, UserRole.BRANCH_ADMIN, UserRole.TEACHER, UserRole.STUDENT),
    batchSubjectController.getBatchSubjectById
);

router.patch(
    "/update/:id",
    checkAuth(UserRole.SUPER_ADMIN, UserRole.BRANCH_ADMIN),
    batchSubjectController.updateBatchSubject
);

router.delete(
    "/delete/:id",
    checkAuth(UserRole.SUPER_ADMIN, UserRole.BRANCH_ADMIN),
    batchSubjectController.deleteBatchSubject
);

export const batchSubjectRoutes = router;
