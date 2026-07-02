export interface StudentDashboardOverview {
  stats: {
    currentClass: string;
    currentBatch: string;
    enrolledCourses: number;
    upcomingExams: number;
    completedExams: number;
    attendancePercentage: number;
  };
  performance: Array<{ label: string; value: number }>;
  upcomingClasses: Array<{ title: string; time: string; batch: string; subject: string }>;
  quickActions: Array<{ title: string; href: string; icon: string }>;
  recentActivity: Array<{ title: string; description: string; time: string }>;
}
