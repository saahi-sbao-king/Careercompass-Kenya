const { validateAdminArgs } = require('firebase-admin/data-connect');

const connectorConfig = {
  connector: 'example',
  serviceId: 'studio',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;

function createJobApplication(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeMutation('CreateJobApplication', inputVars, inputOpts);
}
exports.createJobApplication = createJobApplication;

function getJobApplicationsByUser(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('GetJobApplicationsByUser', inputVars, inputOpts);
}
exports.getJobApplicationsByUser = getJobApplicationsByUser;

function updateJobApplicationStatus(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeMutation('UpdateJobApplicationStatus', inputVars, inputOpts);
}
exports.updateJobApplicationStatus = updateJobApplicationStatus;

function listCompanies(dcOrOptions, options) {
  const { dc: dcInstance, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrOptions, options, undefined);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('ListCompanies', undefined, inputOpts);
}
exports.listCompanies = listCompanies;

