import axiosInstance from "@/app/services/axiosInstance";

// ─── Students ────────────────────────────────────────────────────────────────
export const branchAdminApi = {
  // Students
  getAllStudents: () => axiosInstance.get("/students/all-students"),
  getStudent: (id: string) => axiosInstance.get(`/students/${id}`),
  createStudent: (data: any) => axiosInstance.post("/students/create-student-profile", data),
  updateStudent: (id: string, data: any) => axiosInstance.patch(`/students/update/${id}`, data),
  deleteStudent: (id: string) => axiosInstance.delete(`/students/delete/${id}`),

  // Teachers
  getAllTeachers: () => axiosInstance.get("/teachers/all-teachers"),
  getTeacher: (id: string) => axiosInstance.get(`/teachers/teacher/${id}`),
  createTeacher: (data: any) => axiosInstance.post("/teachers/create-teacher", data),
  updateTeacher: (id: string, data: any) => axiosInstance.patch(`/teachers/update/${id}`, data),
  deleteTeacher: (id: string) => axiosInstance.delete(`/teachers/delete/${id}`),

  // Batches
  getAllBatches: () => axiosInstance.get("/batches"),
  getBatch: (id: string) => axiosInstance.get(`/batches/${id}`),
  createBatch: (data: any) => axiosInstance.post("/batches", data),
  updateBatch: (id: string, data: any) => axiosInstance.patch(`/batches/${id}`, data),
  deleteBatch: (id: string) => axiosInstance.delete(`/batches/${id}`),

  // Subjects
  getAllSubjects: () => axiosInstance.get("/subjects"),
  getSubject: (id: string) => axiosInstance.get(`/subjects/${id}`),
  createSubject: (data: any) => axiosInstance.post("/subjects", data),
  updateSubject: (id: string, data: any) => axiosInstance.patch(`/subjects/${id}`, data),
  deleteSubject: (id: string) => axiosInstance.delete(`/subjects/${id}`),

  // Class Levels
  getAllClassLevels: () => axiosInstance.get("/class-levels/all-class-levels"),

  // Branches
  getAllBranches: () => axiosInstance.get("/branches/all-branches"),

  // Routines
  getAllRoutines: () => axiosInstance.get("/routines"),
  getRoutineByBatch: (batchId: string) => axiosInstance.get(`/routines/batch/${batchId}`),
  createRoutine: (data: any) => axiosInstance.post("/routines", data),
  deleteRoutine: (id: string) => axiosInstance.delete(`/routines/${id}`),
};

export default branchAdminApi;
