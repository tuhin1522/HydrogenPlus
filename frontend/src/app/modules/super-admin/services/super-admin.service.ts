import axiosInstance from "@/app/services/axiosInstance";
import { CreateBranchAdminPayload } from "../types";

export interface CreateBranchPayload {
  name: string;
  location: string;
  phone?: string;
  email?: string;
}

export const createBranchAdmin = async (
  data: CreateBranchAdminPayload
) => {
  const response = await axiosInstance.post(
    "/branch-admins/create-branch-admin",
    data
  );
  return response.data;
};

export const getAllBranchAdmins = async () => {
  const response = await axiosInstance.get("/branch-admins/all-branch-admins");
  return response.data;
};

export const createBranch = async (data: CreateBranchPayload) => {
  const response = await axiosInstance.post("/branches/create-branch", data);
  return response.data;
};

export const getAllBranches = async () => {
  const response = await axiosInstance.get("/branches/all-branches");
  return response.data;
};

export const getAllTeachers = async () => {
  const response = await axiosInstance.get("/teachers/all-teachers");
  return response.data;
};

export const getAllStudents = async () => {
  const response = await axiosInstance.get("/students/all-students");
  return response.data;
};

export const getAllBatches = async () => {
  const response = await axiosInstance.get("/batches");
  return response.data;
};