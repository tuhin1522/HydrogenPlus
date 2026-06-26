export interface ICreateBatchSubject {
    batchId: string;
    subjectId: string;
    teacherId: string;
}

export interface IUpdateBatchSubject {
    batchId?: string;
    subjectId?: string;
    teacherId?: string;
}   