const { global, globalReportReceiveds, globalReportSents, globalInternalsExternals, endpointsCallsReceiveds, endpointsCallsSents, hoursReceivedCalls, sectorReceivedCalls } = require('../helpers/printsHelpers/');
const excelGenerate = require('../tools/exportExcel');

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

  const result = await excelGenerate([ globalReportRec, globalReportSent, endpointRecsCalls, endpointSentsCalls, callsBySectors, callsByHours, dataGlobal, internalsExternals ]);
  return result;
};

module.exports = { getAllElementsToPrint };
