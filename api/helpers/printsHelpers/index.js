const global = require('./globalElement');
const globalReportReceiveds = require('./globalReportCallsReceived');
const globalReportSents = require('./globalReportCallsSent');
const globalInternalsExternals = require('./globalSentsInternalAndExternals');
const endpointsCallsReceiveds = require('./endpointsReceived');
const endpointsCallsSents = require('./endpointsSent');
const hoursReceivedCalls = require('./callsReceivedHours');
const sectorReceivedCalls = require('./callsBySectors');
const logsReport = require('./logsReport');

module.exports = {
  global,
  globalReportReceiveds,
  globalReportSents,
  globalInternalsExternals,
  endpointsCallsReceiveds,
  endpointsCallsSents,
  hoursReceivedCalls,
  sectorReceivedCalls,
  logsReport,
};