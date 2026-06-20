import { Router } from "express";
import { branchRoutes } from "../modules/branch/branch.routes";
import { authRoutes } from "../modules/auth/auth.routes";
import { studentRoutes } from "../modules/student/student.routes";

const router = Router();

router.use("/branches", branchRoutes);
router.use("/auth", authRoutes);
router.use("/students", studentRoutes);

export const indexRoutes = router;