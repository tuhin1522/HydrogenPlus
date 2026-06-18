import { Router } from "express";
import { branchRoutes } from "../modules/branch/branch.routes";

const router = Router();

router.use("/branches", branchRoutes);

export const indexRoutes = router;