export interface ISubject {
  id?: string;
  name: string;
  code?: string | null;
  classLevelId: string;
  createdAt?: Date;
  updatedAt?: Date;
}
