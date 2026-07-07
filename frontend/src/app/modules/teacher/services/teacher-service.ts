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
      // Fetch real data from my-profile to derive stats
      const { data } = await axiosInstance.get("/teachers/my-profile");
      const profile = data.data;

      const batchSubjects = profile?.batchSubjects || [];
      const subjects = new Set(batchSubjects.map((bs: any) => bs.subjectId));

      return {
        stats: {
          assignedBatches: batchSubjects.length,
          totalSubjects: subjects.size,
          totalStudents: 0, // Placeholder, would need a different API for this
          todaysClasses: 0,
          upcomingExams: 0,
          publishedCourses: 0,
        },
        charts: {
          performance: [72, 78, 81, 76, 86, 90], // Placeholder chart
        },
        upcomingClasses: batchSubjects.slice(0, 3).map((bs: any) => ({
          title: `${bs.subject?.name} Session`,
          time: "TBD",
          batch: bs.batch?.name || "Unknown Batch",
          subject: bs.subject?.name || "Unknown Subject",
        })),
        activity: [
          { title: "Teacher profile synced", description: "Successfully connected to dashboard", time: "Just now" },
        ],
        schedule: batchSubjects.slice(0, 3).map((bs: any) => ({
          day: "TBD",
          session: "TBD",
          batch: bs.batch?.name || "Unknown Batch",
        })),
      };
    } catch (error) {
      console.error("Failed to load teacher dashboard overview", error);
      toast.error("Unable to load teacher overview right now.");
      return {
        stats: {
          assignedBatches: 0,
          totalSubjects: 0,
          totalStudents: 0,
          todaysClasses: 0,
          upcomingExams: 0,
          publishedCourses: 0,
        },
        charts: {
          performance: [0, 0, 0, 0, 0, 0],
        },
        upcomingClasses: [],
        activity: [],
        schedule: [],
      };
    }
  },

  async getMyProfile() {
    const { data } = await axiosInstance.get("/teachers/my-profile");
    return data;
  },

  async updateMyProfile(data: Record<string, unknown>) {
    const response = await axiosInstance.patch("/teachers/update-my-profile", data);
    return response.data;
  },

  async changePassword(data: Record<string, unknown>) {
    const response = await axiosInstance.post("/auth/change-password", data);
    return response.data;
  }
};

