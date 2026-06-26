export interface ICreateTeacher {
    userId: string;
    branchId: string;
    qualification?: string;
    experience?: number;
    specialization?: string;
    bio?: string;
}

export interface IUpdateTeacher {
    branchId?: string;
    qualification?: string;
    experience?: number;
    specialization?: string;
    bio?: string;
}