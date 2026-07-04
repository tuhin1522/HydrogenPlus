export interface BranchAdminDashboardData {
  stats: {
    totalStudents: number;
    totalTeachers: number;
    totalBatches: number;
    activeCourses: number;
    todaysClasses: number;
    monthlyRevenue: string;
  };
  recentAdmissions: Array<{
    id: number;
    name: string;
    details: string;
  }>;
  recentPayments: Array<{
    id: number;
    label: string;
    amount: string;
  }>;
}