import { Router } from "express";
import { branchRoutes } from "../modules/branch/branch.routes";
import { authRoutes } from "../modules/auth/auth.routes";
import { studentRoutes } from "../modules/student/student.routes";
import { batchRoutes } from "../modules/batch/batch.routes";
import { classLevelRoutes } from "../modules/classLevel/classLevel.routes";
import { teacherRoutes } from "../modules/teacher/teacher.routes";
import { subjectRoutes } from "../modules/subject/subject.routes";
import { routineRoutes } from "../modules/routine/routine.routes";
import { batchSubjectRoutes } from "../modules/batchSubject/batchSubject.routes";
import { branchAdminRoutes } from "../modules/branchAdmin/branchAdmin.routes";

const router = Router();

router.use("/branches", branchRoutes);
router.use("/auth", authRoutes);
router.use("/students", studentRoutes);
router.use("/class-levels", classLevelRoutes);
router.use("/batches", batchRoutes);
router.use("/teachers", teacherRoutes);
router.use("/subjects", subjectRoutes);
router.use("/routines", routineRoutes);
router.use("/batch-subjects", batchSubjectRoutes);
router.use("/branch-admins", branchAdminRoutes);

export const indexRoutes = router;