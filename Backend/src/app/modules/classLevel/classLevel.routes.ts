import { Router } from "express";
import { classLevelController } from "./classLevel.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { UserRole } from "@/generated/prisma";
import { validateRequest } from "../../middleware/validateRequest";
import { ClassLevelValidation } from "./classLevel.validation";

const router = Router();

router.post(
  "/create-class-level",
  checkAuth(UserRole.SUPER_ADMIN),
  validateRequest(ClassLevelValidation.createClassLevelZodSchema),
  classLevelController.createClassLevel
);
router.get("/all-class-levels", checkAuth(), classLevelController.getAllClassLevels);
router.get("/class-level/:id", checkAuth(), classLevelController.getClassLevelById);
router.patch(
  "/update/:id",
  checkAuth(UserRole.SUPER_ADMIN),
  validateRequest(ClassLevelValidation.updateClassLevelZodSchema),
  classLevelController.updateClassLevel
);
router.delete("/delete/:id", checkAuth(UserRole.SUPER_ADMIN), classLevelController.deleteClassLevel);

export const classLevelRoutes = router;