const excelGenerate = require('../tools/exportExcel');
const { conndb } = require('../config');
const { callsModel } = require('../models');
const { global, globalReportReceiveds, globalReportSents, globalInternalsExternals, endpointsCallsReceiveds, endpointsCallsSents, hoursReceivedCalls, sectorReceivedCalls, logsReport } = require('../helpers/printsHelpers/');

const getAllElementsToPrint = async (elements) => {
  const {
    globalAnsweredAndNotAnswer,
    globalReportToTableReceived,
    globalReportToTableSent,
    volumeCallsInternalsAndExternals,
    volumeEndpointsReceivedAnswered,
    volumeEndpointsReceivedNotAnswer,
    volumeEndpointsSentAnswered,
    volumeEndpointsSentNoAnswer,
    volumeHourReceivedAnswered,
    volumeHourReceivedNoAnswer,
    volumeSectorsReceivedAnswered,
    volumeSectorsReceivedNotAnswer,
  } = elements;
  
  const dataGlobal = global(globalAnsweredAndNotAnswer);
  const globalReportRec = globalReportReceiveds(globalReportToTableReceived);
  const globalReportSent = globalReportSents(globalReportToTableSent);
  const internalsExternals = globalInternalsExternals(volumeCallsInternalsAndExternals);
  const endpointRecsCalls = endpointsCallsReceiveds(volumeEndpointsReceivedAnswered, volumeEndpointsReceivedNotAnswer);
  const endpointSentsCalls = endpointsCallsSents(volumeEndpointsSentAnswered, volumeEndpointsSentNoAnswer);
  const callsByHours = hoursReceivedCalls(volumeHourReceivedAnswered, volumeHourReceivedNoAnswer);
  const callsBySectors = sectorReceivedCalls(volumeSectorsReceivedAnswered, volumeSectorsReceivedNotAnswer);

  const nameReport = 'vigoscloud_report.xlsx';
  const report = await excelGenerate(nameReport, [ globalReportRec, globalReportSent, endpointRecsCalls, endpointSentsCalls, callsBySectors, callsByHours, dataGlobal, internalsExternals ]);
  return report;
};

const setLogsToPrint = async (elements) => {
  const dataReceived = Object.values(elements);
  const callsDb = callsModel.factory(conndb);
  
  const getRows = await callsDb.readAllRows(...dataReceived);
  const logs = logsReport(getRows);
 
  const nameLogs = 'vigoscloud_logscalls.xlsx';
  const result = await excelGenerate(nameLogs, [ logs ]);
  return result;
};

module.exports = { getAllElementsToPrint, setLogsToPrint };
