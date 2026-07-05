import axiosInstance from "@/app/services/axiosInstance";
import { BranchAdminDashboardData } from "../type";

export const branchAdminService = {
  async getDashboardOverview(): Promise<BranchAdminDashboardData> {
    try {
      const [studentsData, teachersData, batchesData, routinesData] = await Promise.all([
        this.getStudents().catch(() => ({ data: [] })),
        this.getTeachers().catch(() => ({ data: [] })),
        this.getBatches().catch(() => ({ data: [] })),
        this.getAllRoutines().catch(() => ({ data: [] }))
      ]);

      const students = studentsData.data || [];
      const teachers = teachersData.data || [];
      const batches = batchesData.data || [];
      const routines = routinesData.data || [];

      const today = new Date().toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();
      const todaysClasses = routines.filter((r: any) => r.dayOfWeek === today).length;

      const recentAdmissions = students.slice(0, 5).map((s: any, i: number) => ({
        id: i + 1,
        name: s.user?.name || "Unknown",
        details: s.batch?.name ? `Batch: ${s.batch.name}` : "Newly Admitted",
      }));

      return {
        stats: {
          totalStudents: students.length,
          totalTeachers: teachers.length,
          totalBatches: batches.length,
          activeCourses: 15,
          todaysClasses,
          monthlyRevenue: "$12,450",
        },
        recentAdmissions: recentAdmissions.length > 0 ? recentAdmissions : [
          { id: 1, name: "John Doe", details: "Class 10" },
          { id: 2, name: "Jane Smith", details: "Class 9" }
        ],
        recentPayments: [
          { id: 1, label: "Monthly Fee", amount: "$50" },
          { id: 2, label: "Course Registration", amount: "$100" }
        ],
      };
    } catch (error) {
      console.error("Dashboard overview error:", error);
      throw new Error("Failed to load dashboard overview data");
    }
  },

  async getStudents() {
    const { data } = await axiosInstance.get("/students/all-students");
    return data;
  },

  async getStudentById(id: string) {
    const { data } = await axiosInstance.get(`/students/student/${id}`);
    return data;
  },

  async updateStudent(id: string, data: Record<string, unknown>) {
    const response = await axiosInstance.patch(`/students/update/${id}`, data);
    return response.data;
  },

  async getTeachers() {
    const { data } = await axiosInstance.get("/teachers/all-teachers");
    return data;
  },

  async getTeacherById(id: string) {
    const { data } = await axiosInstance.get(`/teachers/teacher/${id}`);
    return data;
  },

  async updateTeacher(id: string, data: Record<string, unknown>) {
    const response = await axiosInstance.patch(`/teachers/update/${id}`, data);
    return response.data;
  },

  async getClassLevels() {
    const { data } = await axiosInstance.get("/class-levels/all-class-levels");
    return data;
  },

  async getBatches() {
    const { data } = await axiosInstance.get("/batches");
    return data;
  },

  async createBatch(data: Record<string, unknown>) {
    const response = await axiosInstance.post("/batches/create-batch", data);
    return response.data;
  },

  async updateBatch(id: string, data: Record<string, unknown>) {
    const response = await axiosInstance.patch(`/batches/update/${id}`, data);
    return response.data;
  },

  async deleteBatch(id: string) {
    const response = await axiosInstance.delete(`/batches/delete/${id}`);
    return response.data;
  },

  async getSubjects() {
    const { data } = await axiosInstance.get("/subjects");
    return data;
  },

  async createBatchSubject(data: Record<string, unknown>) {
    const response = await axiosInstance.post("/batch-subjects/create-batch-subject", data);
    return response.data;
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

  async getAllRoutines(params?: Record<string, unknown>) {
    const { data } = await axiosInstance.get("/routines", { params });
    return data;
  },

  async getBatchSubjects() {
    const { data } = await axiosInstance.get("/batch-subjects/batch-subjects");
    return data;
  },

  async createRoutine(data: Record<string, unknown>) {
    const response = await axiosInstance.post("/routines/create-routine", data);
    return response.data;
  },

  async updateRoutine(id: string, data: Record<string, unknown>) {
    const response = await axiosInstance.patch(`/routines/update/${id}`, data);
    return response.data;
  },

  async deleteRoutine(id: string) {
    const response = await axiosInstance.delete(`/routines/${id}`);
    return response.data;
  },
};
