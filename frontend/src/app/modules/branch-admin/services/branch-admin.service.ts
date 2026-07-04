import axiosInstance from "@/app/services/axiosInstance";
import { BranchAdminDashboardData } from "../type";

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

  async getBatches() {
    const { data } = await axiosInstance.get("/batches");
    return data;
  },

  async getBranches() {
    const { data } = await axiosInstance.get("/branches/all-branches");
    return data;
  },

  async createUser(data: Record<string, unknown>) {
    const response = await axiosInstance.post("/system/users", data);
    return response.data;
  },

  async createStudentProfile(data: Record<string, unknown>) {
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
