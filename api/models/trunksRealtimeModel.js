const createTrunk = async (connection, data) => {
  const { type } = data;
  if (type === 'IP') {
    const { provider, ipSbcTrunk, ipLocal, trunkNumber, codec } = data;
    const result = await connection.query(`SELECT trunkIPGenerate(${provider}, ${ipSbcTrunk}, '${ipLocal}', '${trunkNumber}', '${codec}')`);
    return result.rows;
  } else {
    const { provider, ipSbcTrunk, authUsername, password, codec } = data;
    const result = await connection.query(`SELECT trunkAuthGenerate(${provider}, ${ipSbcTrunk}, '${authUsername}', '${password}', '${codec}')`);
    return result.rows;
  }
};

const readAllTrunks = async (connection) => {
  const result = await connection.query(`SELECT trunksSelect()`);
  return result.rows;
};

const readTrunkById = async (connection, elements) => {
  const result = await connection.query(`SELECT endpointByIdSelect(${elements})`);
  return result.rows;
};

const deleteTrunks = async (connection, data) => {
  const { elements } = data;
  const result = await connection.query(`SELECT endpointDelete('{${elements}}')`);
  return result.rows;
};

const factory = function (connection) {
  return {
    createTrunk: (data) => {
      return createTrunk(connection, data);
    },
    readAllTrunks: (data) => {
      return readAllTrunks(connection, data);
    },
    readTrunkById: (data) => {
      return readTrunkById(connection, data);
    },
    deleteTrunks: (data) => {
      return deleteTrunks(connection, data);
    },
  }
};

module.exports = { factory };
