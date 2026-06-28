import { CourseStatus } from "@/generated/prisma";

export interface ICreateCourse {
  title: string;
  description?: string | null;
  classLevelId: string;
  subjectId: string;
  teacherId: string;
  price: number;
  status?: CourseStatus;
}

export interface IUpdateCourse {
  title?: string;
  description?: string | null;
  price?: number;
  status?: CourseStatus;
}
