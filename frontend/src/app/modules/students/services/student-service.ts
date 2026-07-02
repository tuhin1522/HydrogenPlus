import axiosInstance from "@/app/services/axiosInstance";
import { toast } from "sonner";
import type { StudentDashboardOverview } from "@/app/modules/students/types";
import { normalizeStudentDashboardOverview } from "@/app/modules/students/validation/student-dashboard-validation";

export const studentService = {
  async getDashboardOverview(): Promise<StudentDashboardOverview> {
    try {
      const { data } = await axiosInstance.get<unknown>("/student/dashboard");
      const normalized = normalizeStudentDashboardOverview(data);
      if (normalized) {
        return normalized;
      }
    } catch (error) {
      console.error("Failed to load student dashboard overview", error);
      toast.error("Unable to load student overview right now.");
    }

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
  },
};
