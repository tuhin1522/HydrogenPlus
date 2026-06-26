export interface ICreateSubject {
  name: string;
  classLevelId: string;
  code: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUpdateSubject {
  name?: string;
  code?: string;
}