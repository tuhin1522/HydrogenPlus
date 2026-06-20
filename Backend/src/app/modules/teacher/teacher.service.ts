import { prisma } from "@/app/lib/prisma";
import { ICreateTeacher } from "./teacher.interface";

const createTeacherProfile = async (teacherData: ICreateTeacher) => {
    const teacher = await prisma.teacherProfile.create({
        data: teacherData,
    })
    return teacher;
};

const getAllTeachers = async () => {
    const teachers = await prisma.teacherProfile.findMany();
    return teachers;
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