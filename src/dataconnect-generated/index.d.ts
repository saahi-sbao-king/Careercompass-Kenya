import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface Company_Key {
  id: UUIDString;
  __typename?: 'Company_Key';
}

export interface CreateJobApplicationData {
  jobApplication_insert: JobApplication_Key;
}

export interface CreateJobApplicationVariables {
  companyId: UUIDString;
  userId: UUIDString;
  applicationDate: DateString;
  positionTitle: string;
  status: string;
}

export interface GetJobApplicationsByUserData {
  jobApplications: ({
    id: UUIDString;
    company: {
      name: string;
    };
      applicationDate: DateString;
      positionTitle: string;
      status: string;
  } & JobApplication_Key)[];
}

export interface GetJobApplicationsByUserVariables {
  userId: UUIDString;
}

export interface Interview_Key {
  id: UUIDString;
  __typename?: 'Interview_Key';
}

export interface JobApplication_Key {
  id: UUIDString;
  __typename?: 'JobApplication_Key';
}

export interface ListCompaniesData {
  companies: ({
    id: UUIDString;
    name: string;
    industry?: string | null;
    website?: string | null;
  } & Company_Key)[];
}

export interface UpdateJobApplicationStatusData {
  jobApplication_update?: JobApplication_Key | null;
}

export interface UpdateJobApplicationStatusVariables {
  id: UUIDString;
  status: string;
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreateJobApplicationRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateJobApplicationVariables): MutationRef<CreateJobApplicationData, CreateJobApplicationVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateJobApplicationVariables): MutationRef<CreateJobApplicationData, CreateJobApplicationVariables>;
  operationName: string;
}
export const createJobApplicationRef: CreateJobApplicationRef;

export function createJobApplication(vars: CreateJobApplicationVariables): MutationPromise<CreateJobApplicationData, CreateJobApplicationVariables>;
export function createJobApplication(dc: DataConnect, vars: CreateJobApplicationVariables): MutationPromise<CreateJobApplicationData, CreateJobApplicationVariables>;

interface GetJobApplicationsByUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetJobApplicationsByUserVariables): QueryRef<GetJobApplicationsByUserData, GetJobApplicationsByUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetJobApplicationsByUserVariables): QueryRef<GetJobApplicationsByUserData, GetJobApplicationsByUserVariables>;
  operationName: string;
}
export const getJobApplicationsByUserRef: GetJobApplicationsByUserRef;

export function getJobApplicationsByUser(vars: GetJobApplicationsByUserVariables): QueryPromise<GetJobApplicationsByUserData, GetJobApplicationsByUserVariables>;
export function getJobApplicationsByUser(dc: DataConnect, vars: GetJobApplicationsByUserVariables): QueryPromise<GetJobApplicationsByUserData, GetJobApplicationsByUserVariables>;

interface UpdateJobApplicationStatusRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateJobApplicationStatusVariables): MutationRef<UpdateJobApplicationStatusData, UpdateJobApplicationStatusVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateJobApplicationStatusVariables): MutationRef<UpdateJobApplicationStatusData, UpdateJobApplicationStatusVariables>;
  operationName: string;
}
export const updateJobApplicationStatusRef: UpdateJobApplicationStatusRef;

export function updateJobApplicationStatus(vars: UpdateJobApplicationStatusVariables): MutationPromise<UpdateJobApplicationStatusData, UpdateJobApplicationStatusVariables>;
export function updateJobApplicationStatus(dc: DataConnect, vars: UpdateJobApplicationStatusVariables): MutationPromise<UpdateJobApplicationStatusData, UpdateJobApplicationStatusVariables>;

interface ListCompaniesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListCompaniesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListCompaniesData, undefined>;
  operationName: string;
}
export const listCompaniesRef: ListCompaniesRef;

export function listCompanies(): QueryPromise<ListCompaniesData, undefined>;
export function listCompanies(dc: DataConnect): QueryPromise<ListCompaniesData, undefined>;

