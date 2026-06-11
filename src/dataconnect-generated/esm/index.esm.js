import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'studio',
  location: 'us-east4'
};

export const createJobApplicationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateJobApplication', inputVars);
}
createJobApplicationRef.operationName = 'CreateJobApplication';

export function createJobApplication(dcOrVars, vars) {
  return executeMutation(createJobApplicationRef(dcOrVars, vars));
}

export const getJobApplicationsByUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetJobApplicationsByUser', inputVars);
}
getJobApplicationsByUserRef.operationName = 'GetJobApplicationsByUser';

export function getJobApplicationsByUser(dcOrVars, vars) {
  return executeQuery(getJobApplicationsByUserRef(dcOrVars, vars));
}

export const updateJobApplicationStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateJobApplicationStatus', inputVars);
}
updateJobApplicationStatusRef.operationName = 'UpdateJobApplicationStatus';

export function updateJobApplicationStatus(dcOrVars, vars) {
  return executeMutation(updateJobApplicationStatusRef(dcOrVars, vars));
}

export const listCompaniesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListCompanies');
}
listCompaniesRef.operationName = 'ListCompanies';

export function listCompanies(dc) {
  return executeQuery(listCompaniesRef(dc));
}

