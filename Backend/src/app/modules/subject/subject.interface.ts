export interface ICreateSubject {
  name: string;
  classLevelId: string;
  code?: string;
}

export interface IUpdateSubject {
  name?: string;
  code?: string;
}