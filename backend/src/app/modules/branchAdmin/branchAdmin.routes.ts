import { Router } from "express";
import { branchAdminController } from "./branchAdmin.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { UserRole } from "@/generated/prisma";
import { validateRequest } from "../../middleware/validateRequest";
import { BranchAdminValidation } from "./branchAdmin.validation";

const router = Router();

router.post(
  "/create-branch-admin",
  checkAuth(UserRole.SUPER_ADMIN),
  validateRequest(BranchAdminValidation.createBranchAdminZodSchema),
  branchAdminController.createBranchAdmin
);

router.get(
  "/all-branch-admins",
  checkAuth(UserRole.SUPER_ADMIN),
  branchAdminController.getAllBranchAdmins
);

router.get(
  "/branch-admin/:id",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.BRANCH_ADMIN),
  branchAdminController.getBranchAdminById
);

router.patch(
  "/update/:id",
  checkAuth(UserRole.SUPER_ADMIN),
  validateRequest(BranchAdminValidation.updateBranchAdminZodSchema),
  branchAdminController.updateBranchAdmin
);

router.delete(
  "/delete/:id",
  checkAuth(UserRole.SUPER_ADMIN),
  branchAdminController.deleteBranchAdmin
);

export const branchAdminRoutes = router;
