import { Router } from "express";
import { analyticsController } from "./analytics.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { UserRole } from "@/generated/prisma";

const router = Router();

// All analytics routes are SUPER_ADMIN only
router.get("/overview", checkAuth(UserRole.SUPER_ADMIN), analyticsController.getOverviewStats);
router.get("/branches", checkAuth(UserRole.SUPER_ADMIN), analyticsController.getBranchAnalytics);
router.get("/enrollment-trends", checkAuth(UserRole.SUPER_ADMIN), analyticsController.getEnrollmentTrends);
router.get("/system-health", checkAuth(UserRole.SUPER_ADMIN), analyticsController.getSystemHealth);

export const analyticsRoutes = router;
