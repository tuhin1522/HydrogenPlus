import { Router } from "express";
import { classLevelController } from "./classLevel.controller";

const router = Router();

router.post("/create-class-level", classLevelController.createClassLevel);
router.get("/all-class-levels", classLevelController.getAllClassLevels);
router.get("/class-level/:id", classLevelController.getClassLevelById);
router.patch("/update/:id", classLevelController.updateClassLevel);
router.delete("/delete/:id", classLevelController.deleteClassLevel);

export const classLevelRoutes = router;