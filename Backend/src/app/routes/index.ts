import { Router } from "express";
import { branchRoutes } from "../modules/branch/branch.routes";
import { authRoutes } from "../modules/auth/auth.routes";
import { batchRoutes } from "../modules/batch/batch.routes";
import { classLevelRoutes } from "../modules/classLevel/classLevel.routes";

const router = Router();

router.use("/branches", branchRoutes);
router.use("/auth", authRoutes);
router.use("/class-levels", classLevelRoutes);
router.use("/batches", batchRoutes);

export const indexRoutes = router;