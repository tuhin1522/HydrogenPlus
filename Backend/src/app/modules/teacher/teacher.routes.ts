import { Router } from "express";
import { teacherController } from "./teacher.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { UserRole } from "@/generated/prisma";
import { validateRequest } from "../../middleware/validateRequest";
import { TeacherValidation } from "./teacher.validation";


const router = Router();

router.post(
  "/create-teacher",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.BRANCH_ADMIN),
  validateRequest(TeacherValidation.createTeacherZodSchema),
  teacherController.createTeacher
);
router.get("/all-teachers", checkAuth(UserRole.SUPER_ADMIN, UserRole.BRANCH_ADMIN), teacherController.getAllTeachers);
router.get("/teacher/:id", checkAuth(UserRole.SUPER_ADMIN, UserRole.BRANCH_ADMIN, UserRole.TEACHER), teacherController.getTeacherById);
router.patch(
  "/update/:id",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.BRANCH_ADMIN, UserRole.TEACHER),
  validateRequest(TeacherValidation.updateTeacherZodSchema),
  teacherController.updateTeacher
);
router.delete("/delete/:id", checkAuth(UserRole.SUPER_ADMIN, UserRole.BRANCH_ADMIN), teacherController.deleteTeacher);

export const teacherRoutes = router;