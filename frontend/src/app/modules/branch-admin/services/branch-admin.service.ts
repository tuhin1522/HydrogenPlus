import axiosInstance from "@/app/services/axiosInstance";

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

export const branchAdminService = {
  async getDashboardOverview(): Promise<BranchAdminDashboardData> {
    const { data } = await axiosInstance.get<BranchAdminDashboardData>("/branch-admin/dashboard");
    return data;
  },

  async getStudents() {
    const { data } = await axiosInstance.get("/students/all-students");
    return data;
  },

  async getTeachers() {
    const { data } = await axiosInstance.get("/teachers/all-teachers");
    return data;
  },

  async getClassLevels() {
    const { data } = await axiosInstance.get("/class-levels/all-class-levels");
    return data;
  },

  async createStudent(data: Record<string, unknown>) {
    const response = await axiosInstance.post("/students/create-student-profile", data);
    return response.data;
  },

  async createTeacher(data: Record<string, unknown>) {
    const response = await axiosInstance.post("/teachers/create-teacher", data);
    return response.data;
  },

  async deleteStudent(id: string) {
    const response = await axiosInstance.delete(`/students/delete/${id}`);
    return response.data;
  },

  async deleteTeacher(id: string) {
    const response = await axiosInstance.delete(`/teachers/delete/${id}`);
    return response.data;
  },
};
