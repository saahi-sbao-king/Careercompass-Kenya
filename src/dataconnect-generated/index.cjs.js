const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'studio',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;

const createJobApplicationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateJobApplication', inputVars);
}
createJobApplicationRef.operationName = 'CreateJobApplication';
exports.createJobApplicationRef = createJobApplicationRef;

exports.createJobApplication = function createJobApplication(dcOrVars, vars) {
  return executeMutation(createJobApplicationRef(dcOrVars, vars));
};

const getJobApplicationsByUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetJobApplicationsByUser', inputVars);
}
getJobApplicationsByUserRef.operationName = 'GetJobApplicationsByUser';
exports.getJobApplicationsByUserRef = getJobApplicationsByUserRef;

exports.getJobApplicationsByUser = function getJobApplicationsByUser(dcOrVars, vars) {
  return executeQuery(getJobApplicationsByUserRef(dcOrVars, vars));
};

const updateJobApplicationStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateJobApplicationStatus', inputVars);
}
updateJobApplicationStatusRef.operationName = 'UpdateJobApplicationStatus';
exports.updateJobApplicationStatusRef = updateJobApplicationStatusRef;

exports.updateJobApplicationStatus = function updateJobApplicationStatus(dcOrVars, vars) {
  return executeMutation(updateJobApplicationStatusRef(dcOrVars, vars));
};

const listCompaniesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListCompanies');
}
listCompaniesRef.operationName = 'ListCompanies';
exports.listCompaniesRef = listCompaniesRef;

exports.listCompanies = function listCompanies(dc) {
  return executeQuery(listCompaniesRef(dc));
};
