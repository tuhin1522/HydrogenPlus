import { Router } from "express";
import { branchRoutes } from "../modules/branch/branch.routes";
import { authRoutes } from "../modules/auth/auth.routes";

const router = Router();

router.use("/branches", branchRoutes);
router.use("/auth", authRoutes);

export const indexRoutes = router;