const createIpTrunkEndpoint = async (connection, data) => {
  const { type } = data;
  if (type === 'IP') {
    const { provider, ipSbcTrunk, ipLocal, trunkNumber, codec } = data;
    const result = await connection.query(`SELECT trunkIPGenerate(${provider}, ${ipSbcTrunk}, '${ipLocal}', '${trunkNumber}', '${codec}')`);
    return result.rows;
  } else {
  }
};

const createAuthTrunkEndpoint = async (connection, data) => {
  const { provider, ipSbcTrunk, authUsername, password, codec } = data;
  const result = await connection.query(`SELECT trunkAuthGenerate(${provider}, ${ipSbcTrunk}, '${authUsername}', '${password}', '${codec}')`);
  return result.rows;
};

// const readAllEndpoints = async (connection) => {
//   const result = await connection.query(`SELECT endpointsSelect()`);
//   return result.rows;
// };

// const readByIdEndpoints = async (connection, elements) => {
//   const result = await connection.query(`SELECT endpointByIdSelect('{${elements}}')`);
//   return result.rows;
// };

// const updateEndpoints = async (connection, data) => {
//   const { elements, password, transport, context, language, dtmf, state, codec, callGroup, pickupGroup, nat } = data;
//   const result = await connection.query(`SELECT endpointsUpdate('{${elements}}', '${password}', '${transport}', '${context}', '${language}', '${dtmf}', ${state}, '${codec}', '${callGroup}', '${pickupGroup}', '${nat}')`);
//   return result;
// };  

// const deleteEndpoints = async (connection, data) => {
//   const { elements } = data;
//   const result = await connection.query(`SELECT endpointDelete('{${elements}}')`);
//   return result.rows;
// };

const factory = function (connection) {
  return {
    createIpTrunkEndpoint: (data) => {
      return createIpTrunkEndpoint(connection, data);
    },
    createAuthTrunkEndpoint: (data) => {
      return createAuthTrunkEndpoint(connection, data);
    },
    readAllEndpoints: (data) => {
      return readAllEndpoints(connection, data);
    },
    readByIdEndpoints: (data) => {
      return readByIdEndpoints(connection, data);
    },
    updateEndpoints: (data) => {
      return updateEndpoints(connection, data);
    },
    deleteEndpoints: (data) => {
      return deleteEndpoints(connection, data);
    },
  }
};

module.exports = { factory };
