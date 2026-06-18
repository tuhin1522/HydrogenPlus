import { Router } from "express";
import { branchController } from "./branch.controller";

const router = Router();

router.post("/create-branch", branchController.createBranch);

export const branchRoutes = router;