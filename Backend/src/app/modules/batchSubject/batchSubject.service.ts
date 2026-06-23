import { prisma } from "@/app/lib/prisma";
import { ICreateBatchSubject, IUpdateBatchSubject } from "./batchSubject.interface";
import { IQueryParams } from "@/app/interface/query.interface";
import { QueryBuilder } from "@/app/utils/queryBuilder";

const createBatchSubject = async (payload: ICreateBatchSubject) => {
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