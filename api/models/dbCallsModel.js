const read = async (connection, day) => {
  const result = await connection.query(`SELECT * FROM cdr WHERE calldate > current_date - interval '${day} days' ORDER BY calldate DESC`);
  return result;
};

const readByDate = async (connection, dateStart, dateStop) => {
  const result = await connection.query(`SELECT * FROM cdr WHERE (calldate BETWEEN '${dateStart}T00:00:01.000Z' AND '${dateStop}T23:59:59.000Z') ORDER BY calldate DESC`);
  return result;
};

const readByProtocol = async (connection, protocol) => {
  const result = await connection.query(`SELECT * FROM cdr WHERE callprotocol = '${protocol}' ORDER BY calldate DESC`);
  return result;
};

const readByAreaCode = async (connection, code) => {
  const result = await connection.query(`SELECT * FROM cdr WHERE src LIKE '55${code}%' OR dst LIKE '0${code}%' ORDER BY calldate DESC`);
  return result;
};

const readAllQueriesReport = async (connection, dateStart, dateStop, sector, getEndpoint, telNumber, getProtocol) => {
  const result = await connection.query(`
    BEGIN;
    SELECT get_itens_report('Ref1', 'Ref2', 'Ref3', 'Ref4', 'Ref5', 'Ref6', 'Ref7', 'Ref8', 'Ref9', 'Ref10', '${dateStart} 00:00:00', '${dateStop} 23:59:59', '${sector}', '${getEndpoint}', '${telNumber}', '${getProtocol}');
    FETCH ALL IN "Ref1";
      FETCH ALL IN "Ref2";
      FETCH ALL IN "Ref3";
      FETCH ALL IN "Ref4";
      FETCH ALL IN "Ref5";
      FETCH ALL IN "Ref6";
      FETCH ALL IN "Ref7";
      FETCH ALL IN "Ref8";
      FETCH ALL IN "Ref9";
      FETCH ALL IN "Ref10";
    COMMIT;
  `);

  const returnPersonalized = {
    volumeEndpointsReceived: result[2].rows,
    volumeEndpointsSent: result[3].rows,
    volumeCallsInternalsAndExternals: result[4].rows[0],
    volumeSectorsReceivedAnswered: result[5].rows,
    volumeSectorsReceivedNotAnswer: result[6].rows,
    volumeHourReceivedAnswered: result[7].rows,
    volumeHourReceivedNoAnswer: result[8].rows,
    globalAnsweredAndNotAnswer: result[9].rows[0],
    globalReportToTableReceived: result[10].rows[0],
    globalReportToTableSent: result[11].rows[0]
  }
  
  return returnPersonalized;
};


const factory = function (connection) {
  return {
    read: (day) => {
      return read(connection, day);
    },
    readByDate: (dateStart, dateStop) => {
      return readByDate(connection, dateStart, dateStop);
    },
    readByProtocol: (protocol) => {
      return readByProtocol(connection, protocol);
    },
    readByAreaCode: (code) => {
      return readByAreaCode(connection, code);
    },
    readAllQueriesReport: (dateStart, dateStop, sector, getEndpoint, telNumber, getProtocol) => {
      return readAllQueriesReport(connection, dateStart, dateStop, sector, getEndpoint, telNumber, getProtocol);
    }
  }
};
module.exports = { factory }; 
