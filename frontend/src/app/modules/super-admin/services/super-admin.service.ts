import axiosInstance from "@/app/services/axiosInstance";

// ========== TYPES ==========
export interface CreateBranchPayload {
  name: string;
  managerName: string;
  address: string;
  phone: string;
  email?: string;
  status?: "ACTIVE" | "INACTIVE";
}

export interface CreateBranchAdminPayload {
  userId: string;
  branchId: string;
  joiningDate?: string;
  designation?: string;
}

export interface CreateCoursePayload {
  title: string;
  description?: string;
  classLevelId: string;
  subjectId: string;
  teacherId: string;
  price: number;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}

// ========== BRANCHES ==========
export const createBranch = (data: CreateBranchPayload) =>
  axiosInstance.post("/branches/create-branch", data).then((r) => r.data);

export const getAllBranches = (params?: Record<string, any>) =>
  axiosInstance.get("/branches/all-branches", { params }).then((r) => r.data);

export const getBranchById = (id: string) =>
  axiosInstance.get(`/branches/branch/${id}`).then((r) => r.data);

export const updateBranch = (id: string, data: Partial<CreateBranchPayload>) =>
  axiosInstance.patch(`/branches/update/${id}`, data).then((r) => r.data);

export const deleteBranch = (id: string) =>
  axiosInstance.delete(`/branches/delete/${id}`).then((r) => r.data);

// ========== BRANCH ADMINS ==========
export const createBranchAdmin = (data: CreateBranchAdminPayload) =>
  axiosInstance.post("/branch-admins/create-branch-admin", data).then((r) => r.data);

export const getAllBranchAdmins = (params?: Record<string, any>) =>
  axiosInstance.get("/branch-admins/all-branch-admins", { params }).then((r) => r.data);

export const getBranchAdminById = (id: string) =>
  axiosInstance.get(`/branch-admins/branch-admin/${id}`).then((r) => r.data);

export const updateBranchAdmin = (id: string, data: any) =>
  axiosInstance.patch(`/branch-admins/update/${id}`, data).then((r) => r.data);

export const deleteBranchAdmin = (id: string) =>
  axiosInstance.delete(`/branch-admins/delete/${id}`).then((r) => r.data);

// ========== STUDENTS ==========
export const getAllStudents = (params?: Record<string, any>) =>
  axiosInstance.get("/students/all-students", { params }).then((r) => r.data);

export const getStudentById = (id: string) =>
  axiosInstance.get(`/students/student/${id}`).then((r) => r.data);

export const updateStudent = (id: string, data: any) =>
  axiosInstance.patch(`/students/update/${id}`, data).then((r) => r.data);

export const deleteStudent = (id: string) =>
  axiosInstance.delete(`/students/delete/${id}`).then((r) => r.data);

// ========== TEACHERS ==========
export const getAllTeachers = (params?: Record<string, any>) =>
  axiosInstance.get("/teachers/all-teachers", { params }).then((r) => r.data);

export const getTeacherById = (id: string) =>
  axiosInstance.get(`/teachers/teacher/${id}`).then((r) => r.data);

export const updateTeacher = (id: string, data: any) =>
  axiosInstance.patch(`/teachers/update/${id}`, data).then((r) => r.data);

export const deleteTeacher = (id: string) =>
  axiosInstance.delete(`/teachers/delete/${id}`).then((r) => r.data);

// ========== CLASS LEVELS ==========
export const getAllClassLevels = (params?: Record<string, any>) =>
  axiosInstance.get("/class-levels/all-class-levels", { params }).then((r) => r.data);

export const createClassLevel = (data: { name: string }) =>
  axiosInstance.post("/class-levels/create-class-level", data).then((r) => r.data);

export const updateClassLevel = (id: string, data: { name: string }) =>
  axiosInstance.patch(`/class-levels/update/${id}`, data).then((r) => r.data);

export const deleteClassLevel = (id: string) =>
  axiosInstance.delete(`/class-levels/delete/${id}`).then((r) => r.data);

// ========== BATCHES ==========
export const getAllBatches = (params?: Record<string, any>) =>
  axiosInstance.get("/batches", { params }).then((r) => r.data);

export const getBatchById = (id: string) =>
  axiosInstance.get(`/batches/batch/${id}`).then((r) => r.data);

export const createBatch = (data: any) =>
  axiosInstance.post("/batches/create-batch", data).then((r) => r.data);

export const updateBatch = (id: string, data: any) =>
  axiosInstance.patch(`/batches/update/${id}`, data).then((r) => r.data);

export const deleteBatch = (id: string) =>
  axiosInstance.delete(`/batches/delete/${id}`).then((r) => r.data);

// ========== SUBJECTS ==========
export const getAllSubjects = (params?: Record<string, any>) =>
  axiosInstance.get("/subjects", { params }).then((r) => r.data);

export const createSubject = (data: any) =>
  axiosInstance.post("/subjects/create-subject", data).then((r) => r.data);

export const updateSubject = (id: string, data: any) =>
  axiosInstance.patch(`/subjects/update/${id}`, data).then((r) => r.data);

export const deleteSubject = (id: string) =>
  axiosInstance.delete(`/subjects/delete/${id}`).then((r) => r.data);

// ========== COURSES ==========
export const getAllCourses = (params?: Record<string, any>) =>
  axiosInstance.get("/courses", { params }).then((r) => r.data);

export const getCourseById = (id: string) =>
  axiosInstance.get(`/courses/course/${id}`).then((r) => r.data);

export const createCourse = (data: CreateCoursePayload) =>
  axiosInstance.post("/courses/create-course", data).then((r) => r.data);

export const updateCourse = (id: string, data: Partial<CreateCoursePayload>) =>
  axiosInstance.patch(`/courses/update/${id}`, data).then((r) => r.data);

export const deleteCourse = (id: string) =>
  axiosInstance.delete(`/courses/delete/${id}`).then((r) => r.data);

// ========== ANALYTICS ==========
export const getOverviewStats = () =>
  axiosInstance.get("/analytics/overview").then((r) => r.data);

export const getBranchAnalytics = () =>
  axiosInstance.get("/analytics/branches").then((r) => r.data);

export const getEnrollmentTrends = () =>
  axiosInstance.get("/analytics/enrollment-trends").then((r) => r.data);

export const getSystemHealth = () =>
  axiosInstance.get("/analytics/system-health").then((r) => r.data);

// ========== SYSTEM ==========
export const getAllUsers = (params?: Record<string, any>) =>
  axiosInstance.get("/system/users", { params }).then((r) => r.data);

export const getAllNotifications = (params?: Record<string, any>) =>
  axiosInstance.get("/system/notifications", { params }).then((r) => r.data);

export const createNotification = (data: { title: string; message: string; type?: string; userId?: string }) =>
  axiosInstance.post("/system/notifications", data).then((r) => r.data);

export const markNotificationRead = (id: string) =>
  axiosInstance.patch(`/system/notifications/${id}/read`, {}).then((r) => r.data);

export const deleteNotification = (id: string) =>
  axiosInstance.delete(`/system/notifications/${id}`).then((r) => r.data);

export const getAllSettings = () =>
  axiosInstance.get("/system/settings").then((r) => r.data);

export const upsertSetting = (data: { key: string; value: string; description?: string }) =>
  axiosInstance.put("/system/settings", data).then((r) => r.data);

export const getAuditLogs = (params?: Record<string, any>) =>
  axiosInstance.get("/system/audit-logs", { params }).then((r) => r.data);

// ========== BATCH SUBJECTS ==========
export const getAllBatchSubjects = (params?: Record<string, any>) =>
  axiosInstance.get("/batch-subjects/batch-subjects", { params }).then((r) => r.data);

export const createBatchSubject = (data: { batchId: string; subjectId: string; teacherId: string }) =>
  axiosInstance.post("/batch-subjects/create-batch-subject", data).then((r) => r.data);

export const updateBatchSubject = (id: string, data: { teacherId?: string }) =>
  axiosInstance.patch(`/batch-subjects/update/${id}`, data).then((r) => r.data);

export const deleteBatchSubject = (id: string) =>
  axiosInstance.delete(`/batch-subjects/delete/${id}`).then((r) => r.data);

// ========== ROUTINES ==========
export const getAllRoutines = (params?: Record<string, any>) =>
  axiosInstance.get("/routines", { params }).then((r) => r.data);

export const createRoutine = (data: any) =>
  axiosInstance.post("/routines/create-routine", data).then((r) => r.data);

export const updateRoutine = (id: string, data: any) =>
  axiosInstance.patch(`/routines/update/${id}`, data).then((r) => r.data);

export const deleteRoutine = (id: string) =>
  axiosInstance.delete(`/routines/${id}`).then((r) => r.data);

// ========== SYSTEM USERS ==========
export const getUserById = (id: string) =>
  axiosInstance.get(`/system/users/${id}`).then((r) => r.data);

export const createUser = (data: {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: "BRANCH_ADMIN" | "TEACHER" | "STUDENT";
}) => axiosInstance.post("/system/users", data).then((r) => r.data);

export const updateUser = (id: string, data: any) =>
  axiosInstance.patch(`/system/users/${id}`, data).then((r) => r.data);

export const updateUserStatus = (id: string, isActive: boolean) =>
  axiosInstance.patch(`/system/users/${id}/status`, { isActive }).then((r) => r.data);

export const deleteUser = (id: string) =>
  axiosInstance.delete(`/system/users/${id}`).then((r) => r.data);

export const deleteSetting = (key: string) =>
  axiosInstance.delete(`/system/settings/${key}`).then((r) => r.data);

export const createStudentProfile = (data: any) =>
  axiosInstance.post("/students/create-student-profile", data).then((r) => r.data);

export const createTeacher = (data: any) =>
  axiosInstance.post("/teachers/create-teacher", data).then((r) => r.data);