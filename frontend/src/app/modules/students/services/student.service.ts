import axiosInstance from "@/app/services/axiosInstance";
import type { StudentDashboardOverview } from "@/app/modules/students/types";
import { normalizeStudentDashboardOverview } from "@/app/modules/students/validation/student.validation";

function buildFallbackOverview(): StudentDashboardOverview {
  return {
      stats: {
        currentClass: "Class 10",
        currentBatch: "Batch A",
        enrolledCourses: 4,
        upcomingExams: 2,
        completedExams: 6,
        attendancePercentage: 92,
      },
      performance: [
        { label: "Mathematics", value: 88 },
        { label: "Science", value: 84 },
        { label: "English", value: 91 },
        { label: "History", value: 79 },
      ],
      upcomingClasses: [
        { title: "Physics revision", time: "09:00", batch: "Batch A", subject: "Physics" },
        { title: "Live MCQ practice", time: "11:30", batch: "Batch A", subject: "Math" },
        { title: "Essay review", time: "14:00", batch: "Batch A", subject: "English" },
      ],
      quickActions: [
        { title: "Join today’s class", href: "/student/routine", icon: "🎓" },
        { title: "View routine", href: "/student/routine", icon: "🗓️" },
        { title: "Open course", href: "/student/courses", icon: "📚" },
        { title: "Start MCQ exam", href: "/student/exams", icon: "📝" },
      ],
      recentActivity: [
        { title: "New lesson unlocked", description: "Chapter 8 notes are now available in Biology", time: "10m ago" },
        { title: "Exam result published", description: "Your mock test result is available now", time: "1h ago" },
        { title: "Announcement updated", description: "A new batch reminder was posted", time: "3h ago" },
      ],
    };
}

export const studentService = {
  async getMyProfile() {
    const { data } = await axiosInstance.get("/students/my-profile");
    return data;
  },

  async getDashboardOverview(): Promise<StudentDashboardOverview> {
    try {
      const { data } = await axiosInstance.get("/students/my-profile");
      const profile = data?.data;
      
      const batch = profile?.batch;
      const routines = batch?.routines || [];
      const subjects = batch?.subjects || [];
      
      // Calculate today's classes
      const today = new Date().toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();
      const todaysClasses = routines
        .filter((r: any) => r.dayOfWeek === today)
        .map((r: any) => ({
          title: `${r.batchSubject?.subject?.name || "Unknown"} Class`,
          time: new Date(r.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
          batch: batch.name,
          subject: r.batchSubject?.subject?.name || "Unknown",
        }));
        
      return {
        stats: {
          currentClass: batch?.classLevel?.name || "Unknown",
          currentBatch: batch?.name || "Unknown",
          enrolledCourses: subjects.length,
          upcomingExams: 0,
          completedExams: 0,
          attendancePercentage: 100, // Placeholder
        },
        performance: [
          { label: "Mathematics", value: 88 },
          { label: "Science", value: 84 },
          { label: "English", value: 91 },
        ],
        upcomingClasses: todaysClasses.slice(0, 3),
        quickActions: [
          { title: "View routine", href: "/student/routine", icon: "🗓️" },
          { title: "Open course", href: "/student/courses", icon: "📚" },
        ],
        recentActivity: [
          { title: "Profile Synced", description: "Successfully connected to dashboard", time: "Just now" },
        ],
      };
    } catch {
      return buildFallbackOverview();
    }
  },

  async updateMyProfile(data: Record<string, unknown>) {
    const response = await axiosInstance.patch("/students/update-my-profile", data);
    return response.data;
  },

  async changePassword(data: Record<string, unknown>) {
    const response = await axiosInstance.post("/auth/change-password", data);
    return response.data;
  }
};
