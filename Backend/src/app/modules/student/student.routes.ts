import { Router } from "express";
import { studentController } from "./student.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { UserRole } from "@/generated/prisma";
import { validateRequest } from "../../middleware/validateRequest";
import { StudentValidation } from "./student.validation";

const router = Router();

router.post(
  "/create-student-profile",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.BRANCH_ADMIN, UserRole.STUDENT),
  validateRequest(StudentValidation.createStudentProfileZodSchema),
  studentController.createStudentProfile
);
router.get("/my-profile", checkAuth(UserRole.STUDENT), studentController.getMyProfile);
router.get("/all-students", checkAuth(UserRole.SUPER_ADMIN, UserRole.BRANCH_ADMIN, UserRole.TEACHER), studentController.getAllStudents);
router.get("student/:id", checkAuth(UserRole.SUPER_ADMIN, UserRole.BRANCH_ADMIN), studentController.getStudentById);
router.patch("/update-my-profile", checkAuth(UserRole.STUDENT), validateRequest(StudentValidation.updateStudentProfileZodSchema), studentController.updateMyprofile);
router.patch(
  "/update/:id",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.BRANCH_ADMIN),
  validateRequest(StudentValidation.updateStudentProfileZodSchema),
  studentController.updateProfilebyId
);
router.delete("/delete/:id", checkAuth(UserRole.SUPER_ADMIN, UserRole.BRANCH_ADMIN), studentController.deleteStudentProfile);

export const studentRoutes = router;