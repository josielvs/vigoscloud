const { dbCallsServices } = require('../services');

exports.readAllController = (callsDb) => {
  return async (req, res, next) => {
    const { day } = req.body;
    const calls = await callsDb.read(day);
    res.status(200).json(calls);
  }
}

exports.readByDateController = (callsDb) => {
  return async (req, res, next) => {
    const { dateStart, dateStop } = req.body;
    const calls = await callsDb.readByDate(dateStart, dateStop);
    res.status(200).json(calls);
  }
}

exports.readByProtocolController = (callsDb) => {
  return async (req, res, next) => {
    const { protocol } = req.body;
    const call = await callsDb.readByProtocol(protocol);
    res.status(200).json(call);
  }
}

exports.readByAreaCodeController = (callsDb) => {
  return async (req, res, next) => {
    const { code } = req.body;
    const call = await callsDb.readByAreaCode(code);
    res.status(200).json(call);
  }
}

exports.readAllQueriesReportController = (callsDb) => {
  return async (req, res, next) => {
    let { dateStart, dateStop, sector, getEndpoint, telNumber, getProtocol } = req.body;
    try {
      const checked = dbCallsServices.verifyAllData([
        {'checkedDateInit': dateStart },
        {'checkedDateFinal': dateStop},
        {'checkedSector': sector},
        {'checkedGetEndpoint': getEndpoint},
        {'checkedTelNumber': telNumber},
        {'checkedGetProtocol': getProtocol}
      ]);
      const checkedResult = checked;
      const calls = await callsDb.readAllQueriesReport(...checkedResult);
      res.status(200).json(calls);
    } catch (error) {
      next(error);
    }
  }
}