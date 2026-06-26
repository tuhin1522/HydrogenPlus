import { UserRole } from "@/generated/prisma";

export interface IRequestUser {
  userId: string;
  role: UserRole;
  email: string;
}