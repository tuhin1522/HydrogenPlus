export interface ICreateStudentProfile {
  userId: string;
  batchId: string;
  guardianName: string;
  guardianPhone: string;
  schoolName?: string;
  address?: string;
  admissionDate: Date;
}