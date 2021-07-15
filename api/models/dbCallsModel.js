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
    }
  }
};
module.exports = { factory }; 
