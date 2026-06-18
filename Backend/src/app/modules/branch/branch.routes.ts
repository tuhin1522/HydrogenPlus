import { Router } from "express";
import { branchController } from "./branch.controller";

const router = Router();

router.post("/create-branch", branchController.createBranch);
router.get("/all-branches", branchController.getAllBranches);
router.get("/branch/:id", branchController.getBranchById);
router.patch("/update/:id", branchController.updateBranch);
router.delete("/delete/:id", branchController.deleteBranch);

export const branchRoutes = router;