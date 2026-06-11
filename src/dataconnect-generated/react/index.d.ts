import { CreateJobApplicationData, CreateJobApplicationVariables, GetJobApplicationsByUserData, GetJobApplicationsByUserVariables, UpdateJobApplicationStatusData, UpdateJobApplicationStatusVariables, ListCompaniesData } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateJobApplication(options?: useDataConnectMutationOptions<CreateJobApplicationData, FirebaseError, CreateJobApplicationVariables>): UseDataConnectMutationResult<CreateJobApplicationData, CreateJobApplicationVariables>;
export function useCreateJobApplication(dc: DataConnect, options?: useDataConnectMutationOptions<CreateJobApplicationData, FirebaseError, CreateJobApplicationVariables>): UseDataConnectMutationResult<CreateJobApplicationData, CreateJobApplicationVariables>;

export function useGetJobApplicationsByUser(vars: GetJobApplicationsByUserVariables, options?: useDataConnectQueryOptions<GetJobApplicationsByUserData>): UseDataConnectQueryResult<GetJobApplicationsByUserData, GetJobApplicationsByUserVariables>;
export function useGetJobApplicationsByUser(dc: DataConnect, vars: GetJobApplicationsByUserVariables, options?: useDataConnectQueryOptions<GetJobApplicationsByUserData>): UseDataConnectQueryResult<GetJobApplicationsByUserData, GetJobApplicationsByUserVariables>;

export function useUpdateJobApplicationStatus(options?: useDataConnectMutationOptions<UpdateJobApplicationStatusData, FirebaseError, UpdateJobApplicationStatusVariables>): UseDataConnectMutationResult<UpdateJobApplicationStatusData, UpdateJobApplicationStatusVariables>;
export function useUpdateJobApplicationStatus(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateJobApplicationStatusData, FirebaseError, UpdateJobApplicationStatusVariables>): UseDataConnectMutationResult<UpdateJobApplicationStatusData, UpdateJobApplicationStatusVariables>;

export function useListCompanies(options?: useDataConnectQueryOptions<ListCompaniesData>): UseDataConnectQueryResult<ListCompaniesData, undefined>;
export function useListCompanies(dc: DataConnect, options?: useDataConnectQueryOptions<ListCompaniesData>): UseDataConnectQueryResult<ListCompaniesData, undefined>;
