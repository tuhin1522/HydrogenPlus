import { Router } from "express";
import { systemController } from "./system.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { UserRole } from "@/generated/prisma";
import { validateRequest } from "../../middleware/validateRequest";
import { SystemValidation } from "./system.validation";

const router = Router();

// ====== USER MANAGEMENT – SUPER_ADMIN ONLY ======
router.get("/users", checkAuth(UserRole.SUPER_ADMIN), systemController.getAllUsers);
router.get("/users/:id", checkAuth(UserRole.SUPER_ADMIN), systemController.getUserById);
router.post(
  "/users",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.BRANCH_ADMIN),
  validateRequest(SystemValidation.createUserZodSchema),
  systemController.createUser
);
router.patch(
  "/users/:id",
  checkAuth(UserRole.SUPER_ADMIN),
  validateRequest(SystemValidation.updateUserZodSchema),
  systemController.updateUser
);
router.patch(
  "/users/:id/status",
  checkAuth(UserRole.SUPER_ADMIN),
  validateRequest(SystemValidation.updateUserStatusZodSchema),
  systemController.updateUserStatus
);
router.delete("/users/:id", checkAuth(UserRole.SUPER_ADMIN), systemController.deleteUser);

// ====== NOTIFICATIONS – SUPER_ADMIN ONLY ======
router.get("/notifications", checkAuth(UserRole.SUPER_ADMIN), systemController.getAllNotifications);
router.post(
  "/notifications",
  checkAuth(UserRole.SUPER_ADMIN),
  validateRequest(SystemValidation.createNotificationZodSchema),
  systemController.createNotification
);
router.patch("/notifications/:id/read", checkAuth(UserRole.SUPER_ADMIN), systemController.markNotificationRead);
router.delete("/notifications/:id", checkAuth(UserRole.SUPER_ADMIN), systemController.deleteNotification);

// ====== SETTINGS – SUPER_ADMIN ONLY ======
router.get("/settings", checkAuth(UserRole.SUPER_ADMIN), systemController.getAllSettings);
router.put(
  "/settings",
  checkAuth(UserRole.SUPER_ADMIN),
  validateRequest(SystemValidation.upsertSettingZodSchema),
  systemController.upsertSetting
);
router.delete("/settings/:key", checkAuth(UserRole.SUPER_ADMIN), systemController.deleteSetting);

// ====== AUDIT LOGS – SUPER_ADMIN ONLY ======
router.get("/audit-logs", checkAuth(UserRole.SUPER_ADMIN), systemController.getAuditLogs);

export const systemRoutes = router;
