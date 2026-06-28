import { prisma } from "@/app/lib/prisma";

const getOverviewStats = async () => {
  const [
    totalStudents,
    totalTeachers,
    totalBranches,
    totalCourses,
    totalBatches,
    totalRevenue,
    recentStudents,
    recentTeachers,
  ] = await Promise.all([
    prisma.studentProfile.count(),
    prisma.teacherProfile.count(),
    prisma.branch.count(),
    (prisma.course as any).count(),
    prisma.batch.count(),
    (prisma.payment as any).aggregate({ _sum: { amount: true }, where: { status: "COMPLETED" } }),
    // Recent 5 student enrollments
    prisma.studentProfile.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, email: true } },
        batch: { select: { id: true, name: true } },
      },
    }),
    // Recent 5 teacher registrations
    prisma.teacherProfile.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, email: true } },
        branch: { select: { id: true, name: true } },
      },
    }),
  ]);

  return {
    totalStudents,
    totalTeachers,
    totalBranches,
    totalCourses,
    totalBatches,
    totalRevenue: totalRevenue._sum.amount || 0,
    recentStudents,
    recentTeachers,
  };
};

const getBranchAnalytics = async () => {
  const branches = await prisma.branch.findMany({
    include: {
      _count: {
        select: {
          teachers: true,
          batches: true,
        },
      },
      batches: {
        include: {
          _count: { select: { students: true } },
        },
      },
    },
  });

  return branches.map((branch) => ({
    id: branch.id,
    name: branch.name,
    address: branch.address,
    status: branch.status,
    teacherCount: branch._count.teachers,
    batchCount: branch._count.batches,
    studentCount: branch.batches.reduce((sum, batch) => sum + batch._count.students, 0),
  }));
};

const getEnrollmentTrends = async () => {
  // Group student profiles by month (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const enrollments = await prisma.studentProfile.findMany({
    where: { createdAt: { gte: sixMonthsAgo } },
    select: { createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  // Group by month
  const grouped: Record<string, number> = {};
  enrollments.forEach((e) => {
    const month = e.createdAt.toISOString().slice(0, 7); // "YYYY-MM"
    grouped[month] = (grouped[month] || 0) + 1;
  });

  return Object.entries(grouped).map(([month, count]) => ({ month, count }));
};

const getSystemHealth = async () => {
  const [totalUsers, activeStudents, activeBranches, totalNotifications] = await Promise.all([
    prisma.user.count(),
    prisma.studentProfile.count(),
    prisma.branch.count({ where: { status: "ACTIVE" } }),
    (prisma.notification as any).count({ where: { isRead: false } }),
  ]);

  return {
    totalUsers,
    activeStudents,
    activeBranches,
    unreadNotifications: totalNotifications,
    serverStatus: "healthy",
    databaseStatus: "connected",
  };
};

export const analyticsService = {
  getOverviewStats,
  getBranchAnalytics,
  getEnrollmentTrends,
  getSystemHealth,
};
