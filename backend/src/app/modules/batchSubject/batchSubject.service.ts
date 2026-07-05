import { prisma } from "@/app/lib/prisma";
import { ICreateBatchSubject, IUpdateBatchSubject } from "./batchSubject.interface";
import { IQueryParams } from "@/app/interface/query.interface";
import { QueryBuilder } from "@/app/utils/queryBuilder";

import AppError from "@/app/errorHelpers/appError";
import httpStatus from "http-status";

const createBatchSubject = async (payload: ICreateBatchSubject) => {
    // validate referenced records
    const [batch, subject, teacher] = await Promise.all([
        prisma.batch.findUnique({ where: { id: payload.batchId } }),
        prisma.subject.findUnique({ where: { id: payload.subjectId } }),
        prisma.teacherProfile.findUnique({ where: { id: payload.teacherId } }),
    ]);

    if (!batch) throw new AppError(httpStatus.BAD_REQUEST, "Batch not found");
    if (!subject) throw new AppError(httpStatus.BAD_REQUEST, "Subject not found");
    if (!teacher) throw new AppError(httpStatus.BAD_REQUEST, "Teacher not found");

    // prevent duplicate assignment for same batch+subject
    const existing = await prisma.batchSubject.findFirst({ where: { batchId: payload.batchId, subjectId: payload.subjectId } });
    if (existing) throw new AppError(httpStatus.CONFLICT, "This subject is already assigned to the selected batch.");

    const batchSubject = await prisma.batchSubject.create({
        data: payload,
    });

    return batchSubject;
};

const getAllBatchSubjects = async (query: IQueryParams) => {
    const batchSubjectQuery = new QueryBuilder(
        prisma.batchSubject as any,
        query,
        {
            searchableFields: [],
            filterableFields: ['batchId', 'subjectId', 'teacherId'],
        }
    )
        .search()
        .filter()
        .sort()
        .paginate()
        .fields()
        .dynamicInclude({
            batch: true,
            subject: true,
            teacher: {
                include: {
                    user: { select: { id: true, name: true, email: true } },
                },
            },
        }, ['batch', 'subject', 'teacher']);

    return batchSubjectQuery.execute();
};

const getBatchSubjectById = async (id: string) => {
    const batchSubject = await prisma.batchSubject.findUnique({
        where: { id },
        include: {
            batch: true,
            subject: true,
            teacher: {
                include: {
                    user: { select: { id: true, name: true, email: true } },
                },
            },
        },
    });
    return batchSubject;
};

const updateBatchSubject = async (id: string, payload: IUpdateBatchSubject) => {
    const batchSubject = await prisma.batchSubject.update({
        where: { id },
        data: payload,
    });
    return batchSubject;
};

const deleteBatchSubject = async (id: string) => {
    const batchSubject = await prisma.batchSubject.delete({
        where: { id },
    });
    return batchSubject;
};

export const batchSubjectService = {
    createBatchSubject,
    getAllBatchSubjects,
    getBatchSubjectById,
    updateBatchSubject,
    deleteBatchSubject,
};