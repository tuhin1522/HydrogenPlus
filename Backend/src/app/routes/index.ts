import { Router } from "express";
import { branchRoutes } from "../modules/branch/branch.routes";
import { authRoutes } from "../modules/auth/auth.routes";
import { studentRoutes } from "../modules/student/student.routes";
import { batchRoutes } from "../modules/batch/batch.routes";
import { classLevelRoutes } from "../modules/classLevel/classLevel.routes";
import { teacherRoutes } from "../modules/teacher/teacher.routes";

const router = Router();

router.use("/branches", branchRoutes);
router.use("/auth", authRoutes);
router.use("/students", studentRoutes);
router.use("/class-levels", classLevelRoutes);
router.use("/batches", batchRoutes);
router.use("/teachers", teacherRoutes);

export const indexRoutes = router;