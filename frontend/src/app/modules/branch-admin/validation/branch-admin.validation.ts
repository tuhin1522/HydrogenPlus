import { z } from "zod";

export const branchAdminDashboardSchema = z.object({
  stats: z.object({
    totalStudents: z.number(),
    totalTeachers: z.number(),
    totalBatches: z.number(),
    activeCourses: z.number(),
    todaysClasses: z.number(),
    monthlyRevenue: z.string(),
  }),
  recentAdmissions: z.array(
    z.object({
      id: z.number(),
      name: z.string().min(1),
      details: z.string().min(1),
    }),
  ),
  recentPayments: z.array(
    z.object({
      id: z.number(),
      label: z.string().min(1),
      amount: z.string().min(1),
    }),
  ),
});

export type BranchAdminDashboardInput = z.infer<typeof branchAdminDashboardSchema>;
