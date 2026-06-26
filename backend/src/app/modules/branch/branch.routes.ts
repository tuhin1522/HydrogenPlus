import { Router } from "express";
import { branchController } from "./branch.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { UserRole } from "@/generated/prisma";
import { validateRequest } from "../../middleware/validateRequest";
import { BranchValidation } from "./branch.validation";

const router = Router();

router.post(
  "/create-branch",
  checkAuth(UserRole.SUPER_ADMIN),
  validateRequest(BranchValidation.createBranchZodSchema),
  branchController.createBranch
);
router.get("/all-branches", checkAuth(UserRole.SUPER_ADMIN, UserRole.BRANCH_ADMIN), branchController.getAllBranches);
router.get("/branch/:id", checkAuth(UserRole.SUPER_ADMIN, UserRole.BRANCH_ADMIN), branchController.getBranchById);
router.patch(
  "/update/:id",
  checkAuth(UserRole.SUPER_ADMIN),
  validateRequest(BranchValidation.updateBranchZodSchema),
  branchController.updateBranch
);
router.delete("/delete/:id", checkAuth(UserRole.SUPER_ADMIN), branchController.deleteBranch);

export const branchRoutes = router;