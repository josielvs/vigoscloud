const createSipEndpoint = async (connection, data) => {
  const { first, qtt } = data;
  const result = await connection.query(`SELECT endpointsSipGenerate(${first}, ${qtt})`);
  return result;
};

const createWebEndpoint = async (connection, data) => {
  const { first, qtt } = data;
  const result = await connection.query(`SELECT endpointsWebGenerate(${first}, ${qtt})`);
  return result;
};


const factory = function (connection) {
  return {
    createSipEndpoint: (data) => {
      return createSipEndpoint(connection, data);
    },
    createWebEndpoint: (data) => {
      return createWebEndpoint(connection, data);
    },
  }
};

module.exports = { factory };
