import { prisma } from "@/app/lib/prisma";
import { ICreateTeacher } from "./teacher.interface";
import { QueryBuilder } from "@/app/utils/queryBuilder";
import { IQueryParams } from "@/app/interface/query.interface";

const createTeacherProfile = async (teacherData: ICreateTeacher) => {
    const teacher = await prisma.teacherProfile.create({
        data: teacherData,
    });
    await prisma.user.update({
        where: { id: teacherData.userId },
        data: { role: 'TEACHER' },
    });
    return teacher;
};

const getAllTeachers = async (query: IQueryParams) => {
    const teacherQuery = new QueryBuilder(
        prisma.teacherProfile as any,
        query,
        {
            searchableFields: ['qualification', 'specialization', 'bio', 'user.name', 'user.email'],
            filterableFields: ['branchId', 'userId'],
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
        branch: true,
    }, ['user', 'branch']);

    const result = await teacherQuery.execute();
    return result;
};

const getTeacherById = async (id: string) => {
    const teacher = await prisma.teacherProfile.findUnique({
        where: { id },
    });
    return teacher;
};

const updateTeacherProfile = async (id: string, teacherData: Partial<ICreateTeacher>) => {
    const teacher = await prisma.teacherProfile.update({
        where: { id },
        data: teacherData,
    });
    return teacher;
};

const deleteTeacherProfile = async (id: string) => {
    const teacher = await prisma.teacherProfile.delete({
        where: { id },
    });
    return teacher;
};

export const teacherService = {
    createTeacherProfile,
    getAllTeachers,
    getTeacherById,
    updateTeacherProfile,
    deleteTeacherProfile,
};