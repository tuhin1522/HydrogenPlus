export interface ICreateSubject {
  name: string;
  classLevelId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUpdateSubject {
  name?: string;
  code?: string;
}