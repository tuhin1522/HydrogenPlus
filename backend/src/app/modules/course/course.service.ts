import { prisma } from "@/app/lib/prisma";
import { QueryBuilder } from "@/app/utils/queryBuilder";
import { IQueryParams } from "@/app/interface/query.interface";
import { ICreateCourse, IUpdateCourse } from "./course.interface";
import AppError from "@/app/errorHelpers/appError";
import httpStatus from "http-status";

const INCLUDE_RELATIONS = {
  classLevel: true,
  subject: true,
  teacher: {
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  },
};

const createCourse = async (payload: ICreateCourse) => {
  // Validate teacher exists
  const teacher = await prisma.teacherProfile.findUnique({
    where: { id: payload.teacherId },
  });
  if (!teacher) {
    throw new AppError(httpStatus.NOT_FOUND, "Teacher not found.");
  }

  // Validate classLevel exists
  const classLevel = await prisma.classLevel.findUnique({
    where: { id: payload.classLevelId },
  });
  if (!classLevel) {
    throw new AppError(httpStatus.NOT_FOUND, "Class level not found.");
  }

  // Validate subject exists
  const subject = await (prisma.subject as any).findUnique({
    where: { id: payload.subjectId },
  });
  if (!subject) {
    throw new AppError(httpStatus.NOT_FOUND, "Subject not found.");
  }

  const course = await (prisma.course as any).create({
    data: payload,
    include: INCLUDE_RELATIONS,
  });

  return course;
};

const getAllCourses = async (query: IQueryParams) => {
  const courseQuery = new QueryBuilder(
    prisma.course as any,
    query,
    {
      searchableFields: ["title", "description"],
      filterableFields: ["classLevelId", "subjectId", "teacherId", "status"],
    }
  )
    .search()
    .filter()
    .sort()
    .paginate()
    .fields()
    .dynamicInclude(INCLUDE_RELATIONS, ["classLevel", "subject", "teacher"]);

  return courseQuery.execute();
};

const getCourseById = async (id: string) => {
  const course = await (prisma.course as any).findUnique({
    where: { id },
    include: INCLUDE_RELATIONS,
  });

  if (!course) {
    throw new AppError(httpStatus.NOT_FOUND, "Course not found.");
  }

  return course;
};

const updateCourse = async (id: string, payload: IUpdateCourse) => {
  await getCourseById(id); // ensures course exists

  const course = await (prisma.course as any).update({
    where: { id },
    data: payload,
    include: INCLUDE_RELATIONS,
  });

  return course;
};

const deleteCourse = async (id: string) => {
  await getCourseById(id); // ensures course exists

  const course = await (prisma.course as any).delete({
    where: { id },
  });

  return course;
};

export const courseService = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};
