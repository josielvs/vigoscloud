const read = async (connection, day) => {
  const result = await connection.query(`SELECT * FROM cdr WHERE calldate > current_date - interval '${day} days' ORDER BY calldate DESC`);
  return result;
};

const readByDate = async (connection, dateStart, dateStop) => {
  console.log('Model_DateBy ', dateStart, dateStop);
  const result = await connection.query(`SELECT * FROM cdr WHERE (calldate BETWEEN '${dateStart}T00:00:01.000Z' AND '${dateStop}T23:59:59.000Z') ORDER BY calldate DESC`);
  return result;
};

// const getCallsOfEndpoint = (id) => {
//   const splitId = id.split('|');
//   const ramalId = splitId[0];
//   const dateId = splitId[1];
//   return new Promise(function(resolve, reject) {
//     pool.query(`
//       SELECT calldate, date_trunc('day', timestamp 'now()') as teste
//       FROM cdr
//       WHERE disposition = 'ANSWERED' 
//       AND dstchannel LIKE '%${ramalId}%'
//       ORDER BY calldate DESC;
//     `, (error, results) => {
//       if (error) {
//         reject(error)
//       }
//       resolve(results.rows);
//     })
//   })
// }

const factory = function (connection) {
  return {
    read: (day) => {
      return read(connection, day);
    },
    readByDate: (dateStart, dateStop) => {
      return readByDate(connection, dateStart, dateStop);
    }
  }
};
module.exports = { factory }; 
