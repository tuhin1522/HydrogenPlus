import axiosInstance from "@/app/services/axiosInstance";
import { toast } from "sonner";

export interface TeacherDashboardOverview {
  stats: {
    assignedBatches: number;
    totalSubjects: number;
    totalStudents: number;
    todaysClasses: number;
    upcomingExams: number;
    publishedCourses: number;
  };
  charts: {
    performance: number[];
  };
  upcomingClasses: Array<{
    title: string;
    time: string;
    batch: string;
    subject: string;
  }>;
  activity: Array<{
    title: string;
    description: string;
    time: string;
  }>;
  schedule: Array<{
    day: string;
    session: string;
    batch: string;
  }>;
}

export const teacherService = {
  async getDashboardOverview(): Promise<TeacherDashboardOverview> {
    try {
      const { data } = await axiosInstance.get<TeacherDashboardOverview>("/teacher/dashboard");
      return data;
    } catch (error) {
      console.error("Failed to load teacher dashboard overview", error);
      toast.error("Unable to load teacher overview right now.");
      return {
        stats: {
          assignedBatches: 6,
          totalSubjects: 8,
          totalStudents: 142,
          todaysClasses: 4,
          upcomingExams: 3,
          publishedCourses: 5,
        },
        charts: {
          performance: [72, 78, 81, 76, 86, 90],
        },
        upcomingClasses: [
          { title: "Physics Lab", time: "09:00", batch: "Batch A", subject: "Physics" },
          { title: "Mathematics Revision", time: "11:30", batch: "Batch B", subject: "Math" },
          { title: "Chemistry Practice", time: "14:00", batch: "Batch C", subject: "Chemistry" },
        ],
        activity: [
          { title: "New course content uploaded", description: "Chapter 7 notes and slides shared", time: "12m ago" },
          { title: "Student question resolved", description: "A learner asked for clarification on integration", time: "38m ago" },
          { title: "Assignment reminder sent", description: "Deadline reminder published for Batch A", time: "1h ago" },
        ],
        schedule: [
          { day: "Monday", session: "09:00 - 10:30", batch: "Batch A" },
          { day: "Tuesday", session: "11:00 - 12:30", batch: "Batch C" },
          { day: "Thursday", session: "14:00 - 15:30", batch: "Batch B" },
        ],
      };
    }
  },
};
