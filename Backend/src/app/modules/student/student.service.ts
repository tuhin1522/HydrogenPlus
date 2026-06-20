import { prisma } from "@/app/lib/prisma";
import { ICreateStudentProfile } from "./student.interface";
import { QueryBuilder } from "@/app/utils/queryBuilder";
import { IQueryParams } from "@/app/interface/query.interface";

const createStudentProfile = async (data: ICreateStudentProfile) => {
  const existingStudent = await prisma.studentProfile.findUnique({
    where: { userId: data.userId }
  });

  if (existingStudent) {
    throw new Error('Student profile already exists for this user');
  }

  return prisma.studentProfile.create({
    data,
  });
};

const getMyProfile = async (userId: string) => {
  return await prisma.studentProfile.findUnique({
    where: { userId },
  });
};

const getAllStudents = async (query: IQueryParams) => {
  const studentQuery = new QueryBuilder(
    prisma.studentProfile as any,
    query,
    {
      searchableFields: ['guardianName', 'guardianPhone', 'schoolName', 'address', 'user.name', 'user.email'],
      filterableFields: ['batchId', 'userId'],
    }
  )
    .search()
    .filter()
    .sort()
    .paginate()
    .fields()
    .dynamicInclude({
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          isActive: true,
        }
      },
      batch: true,
    }, ['user', 'batch']);

  const result = await studentQuery.execute();
  return result;
};

const getStudentById = async (id: string) => {
  return await prisma.studentProfile.findUnique({
    where: { id },
  });
};

const updateMyProfile = async (id: string, data: Partial<ICreateStudentProfile>) => {
  return await prisma.studentProfile.update({
    where: { id },
    data,
  });
};

const deleteStudentProfile = async (id: string) => {
  return await prisma.studentProfile.delete({
    where: { id },
  });
};

export const studentService = {
  createStudentProfile,
  getMyProfile,
  getAllStudents,
  getStudentById,
  updateMyProfile,
  deleteStudentProfile,
};