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

const readAllSectors = async (connection) => {
  const result = await connection.query(`SELECT * FROM "get_sectors"()`);
  return result.rows;
};

const readAllRows = async (connection, dateStart, dateStop, hourStart, hourStop, sector, getEndpoint, telNumber, getProtocol, statusCall, typeRecOrEfet, limitGet, offsetGet) => {
  const result = await connection.query(`
    SELECT * FROM
      "get_all_calls_rows"(
        '${dateStart}',
        '${dateStop}',
        '${hourStart}',
        '${hourStop}',
        '${sector}',
        '${getEndpoint}',
        '${telNumber}',
        '${getProtocol}',
        '${statusCall}',
        '${typeRecOrEfet}',
        '${limitGet}',
        '${offsetGet}'
      )`);
  return result.rows;
};

const readAllQueriesReport = async (connection, dateStart, dateStop, hourStart, hourStop, sector, getEndpoint, telNumber, getProtocol) => {
  const result = await connection.query(`
    BEGIN;
    SELECT get_itens_report('Ref1', 'Ref2', 'Ref3', 'Ref4', 'Ref5', 'Ref6', 'Ref7', 'Ref8', 'Ref9', 'Ref10', 'Ref11', 'Ref12', '${dateStart}', '${dateStop}', '${hourStart}', '${hourStop}', '${sector}', '${getEndpoint}', '${telNumber}', '${getProtocol}');
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
      FETCH ALL IN "Ref11";
      FETCH ALL IN "Ref12";
    COMMIT;
  `);

  const returnPersonalized = {
    volumeEndpointsReceivedAnswered: result[2].rows,
    volumeEndpointsReceivedNotAnswer: result[3].rows,
    volumeEndpointsSentAnswered: result[4].rows,
    volumeEndpointsSentNoAnswer: result[5].rows,
    volumeCallsInternalsAndExternals: result[6].rows[0],
    volumeSectorsReceivedAnswered: result[7].rows,
    volumeSectorsReceivedNotAnswer: result[8].rows,
    volumeHourReceivedAnswered: result[9].rows,
    volumeHourReceivedNoAnswer: result[10].rows,
    globalAnsweredAndNotAnswer: result[11].rows[0],
    globalReportToTableReceived: result[12].rows[0],
    globalReportToTableSent: result[13].rows[0]
  }
  
  return returnPersonalized;
};

const readRowsChartSector = async (connection, dateStart, dateStop, hourStart, hourStop, sector, getEndpoint, statusCall, limitGet, offsetGet) => {
  const result = await connection.query(`
    SELECT * FROM
      "get_chart_by_sectors_rows"(
        '${dateStart}',
        '${dateStop}',
        '${hourStart}',
        '${hourStop}',
        '${sector}',
        '${getEndpoint}',
        '${statusCall}',
        '${limitGet}',
        '${offsetGet}'
      )`);
  return result.rows;
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
    readAllQueriesReport: (dateStart, dateStop, hourStart, hourStop, sector, getEndpoint, telNumber, getProtocol) => {
      return readAllQueriesReport(connection, dateStart, dateStop, hourStart, hourStop, sector, getEndpoint, telNumber, getProtocol);
    },
    readAllSectors: () => {
      return readAllSectors(connection);
    },
    readAllRows: (dateStart, dateStop, hourStart, hourStop, sector, getEndpoint, telNumber, getProtocol, statusCall, typeRecOrEfet, limitGet, offsetGet) => {
      return readAllRows(connection, dateStart, dateStop, hourStart, hourStop, sector, getEndpoint, telNumber, getProtocol, statusCall, typeRecOrEfet, limitGet, offsetGet);
    },
    readRowsChartSector: (dateStart, dateStop, hourStart, hourStop, sector, getEndpoint, statusCall, limitGet, offsetGet) => {
      return readRowsChartSector(connection, dateStart, dateStop, hourStart, hourStop, sector, getEndpoint, statusCall, limitGet, offsetGet);
    },
  }
};
module.exports = { factory }; 
