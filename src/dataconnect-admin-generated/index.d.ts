import { ConnectorConfig, DataConnect, OperationOptions, ExecuteOperationResponse } from 'firebase-admin/data-connect';

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

/** Generated Node Admin SDK operation action function for the 'CreateJobApplication' Mutation. Allow users to execute without passing in DataConnect. */
export function createJobApplication(dc: DataConnect, vars: CreateJobApplicationVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateJobApplicationData>>;
/** Generated Node Admin SDK operation action function for the 'CreateJobApplication' Mutation. Allow users to pass in custom DataConnect instances. */
export function createJobApplication(vars: CreateJobApplicationVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateJobApplicationData>>;

/** Generated Node Admin SDK operation action function for the 'GetJobApplicationsByUser' Query. Allow users to execute without passing in DataConnect. */
export function getJobApplicationsByUser(dc: DataConnect, vars: GetJobApplicationsByUserVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetJobApplicationsByUserData>>;
/** Generated Node Admin SDK operation action function for the 'GetJobApplicationsByUser' Query. Allow users to pass in custom DataConnect instances. */
export function getJobApplicationsByUser(vars: GetJobApplicationsByUserVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetJobApplicationsByUserData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateJobApplicationStatus' Mutation. Allow users to execute without passing in DataConnect. */
export function updateJobApplicationStatus(dc: DataConnect, vars: UpdateJobApplicationStatusVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateJobApplicationStatusData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateJobApplicationStatus' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateJobApplicationStatus(vars: UpdateJobApplicationStatusVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateJobApplicationStatusData>>;

/** Generated Node Admin SDK operation action function for the 'ListCompanies' Query. Allow users to execute without passing in DataConnect. */
export function listCompanies(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListCompaniesData>>;
/** Generated Node Admin SDK operation action function for the 'ListCompanies' Query. Allow users to pass in custom DataConnect instances. */
export function listCompanies(options?: OperationOptions): Promise<ExecuteOperationResponse<ListCompaniesData>>;

