import { Router } from "express";
import { teacherController } from "./teacher.controller";


const router = Router();

router.post("/create-teacher", teacherController.createTeacher);
router.get("/all-teachers", teacherController.getAllTeachers);
router.get("/teacher/:id", teacherController.getTeacherById);
router.patch("/update/:id", teacherController.updateTeacher);
router.delete("/delete/:id", teacherController.deleteTeacher);

export const teacherRoutes = router;