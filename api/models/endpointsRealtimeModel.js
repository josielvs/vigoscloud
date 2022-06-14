/******** PARAMS ********
* First Endpoint - int,
* Qtt - int,
* password - string (50),
* transport - string (50),
* context - string (50),
* dtmf - string (50), 'rfc2833', 'info', 'shortinfo', 'inband', 'auto'
* state busy - int,
* codec string (50), 'ulaw' or 'alaw'
* call_group string (50),
* pickup_group string (50),
* nat string (20), 'yes' or 'no',
*************************/
const createSipEndpoint = async (connection, data) => {
  try {
    const { first, qtt, password, transport, context, dtmf, state, codec, callGroup, pickupGroup, nat } = data;
    const result = await connection.query(`SELECT endpointsSipGenerate(${first}, ${qtt}, '${password}', '${transport}', '${context}', '${dtmf}', ${state}, '${codec}', '${callGroup}', '${pickupGroup}', '${nat}')`);
    return result.rows;
  } catch (error) {
    throw new Error('Não foi possível adicionar os ramais!');
  }
};

const createWebEndpoint = async (connection, data) => {
  const { first, qtt, password, transport, context, dtmf, state, codec, callGroup, pickupGroup, nat } = data;
  const result = await connection.query(`SELECT endpointsWebGenerate(${first}, ${qtt}, '${password}', '${transport}', '${context}', '${dtmf}', ${state}, '${codec}', '${callGroup}', '${pickupGroup}', '${nat}')`);
  return result.rows;
};

const readAllEndpoints = async (connection) => {
  const result = await connection.query(`SELECT endpointsSelect()`);
  return result.rows;
};

const readByIdEndpoints = async (connection, elements) => {
  const result = await connection.query(`SELECT endpointByIdSelect('{${elements}}')`);
  return result.rows;
};

const updateEndpoints = async (connection, data) => {
  const { elements, password, transport, context, language, dtmf, state, codec, callGroup, pickupGroup, nat } = data;
  const result = await connection.query(`SELECT endpointsUpdate('{${elements}}', '${password}', '${transport}', '${context}', '${language}', '${dtmf}', ${state}, '${codec}', '${callGroup}', '${pickupGroup}', '${nat}')`);
  return result;
};  

const deleteEndpoints = async (connection, data) => {
  const { elements } = data;
  const result = await connection.query(`SELECT endpointDelete('{${elements}}')`);
  return result.rows;
};

const factory = function (connection) {
  return {
    createSipEndpoint: (data) => {
      return createSipEndpoint(connection, data);
    },
    createWebEndpoint: (data) => {
      return createWebEndpoint(connection, data);
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
