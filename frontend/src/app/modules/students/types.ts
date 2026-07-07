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

export interface StudentProfile { 
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  guardianName: string;
  guardianPhone: string;
  studentId: string;
  classLevelId: string;
  batchId: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    role: string;
    isActive: boolean;
  };
  batch: {
    id: string;
    classLevelId: string;
    status: string;
    classLevel: {
      id: string;
      name: string;
    };
  };
}
