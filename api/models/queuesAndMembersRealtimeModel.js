const createQueue = async (connection, data) => {
  const {
    name,
    music,
    strategy,
    autofill,
    maxlen,
    ringinuse,
    announcePosition,
    announceFrequency,
    announceHoldTime,
    minAnnounceFrequency,
    setQueueEntryVarQueue,
    wrapuptime,
    joinempty,
    leavewhenempty
  } = data;

  const result = await connection.query(`SELECT queuesGenerate('${name}', '${music}', '${strategy}', '${autofill}', ${maxlen}, '${ringinuse}', '${announcePosition}', ${announceFrequency}, '${announceHoldTime}', ${minAnnounceFrequency}, '${setQueueEntryVarQueue}', ${wrapuptime}, '${joinempty}', '${leavewhenempty}')`);
  return result.rows;
};

const readAllQueues = async (connection) => {
  const result = await connection.query(`SELECT queuesSelect()`);
  return result.rows;
};

const readQueuesByName = async (connection, elements) => {
  const result = await connection.query(`SELECT queueByNameSelect('{${elements}}')`);
  return result.rows;
};

const updateQueues = async (connection, data) => {
  const {
    name,
    music,
    strategy,
    autofill,
    maxlen,
    ringinuse,
    announcePosition,
    announceFrequency,
    announceHoldTime,
    minAnnounceFrequency,
    setQueueEntryVarQueue,
    wrapuptime,
    joinempty,
    leavewhenempty
  } = data;
  const result = await connection.query(`SELECT queuesUpdate('${name}', '${music}', '${strategy}', '${autofill}', ${maxlen}, '${ringinuse}', '${announcePosition}', ${announceFrequency}, '${announceHoldTime}', ${minAnnounceFrequency}, '${setQueueEntryVarQueue}', ${wrapuptime}, '${joinempty}', '${leavewhenempty}')`);
  return result;
};

const deleteQueues = async (connection, data) => {
  const { elements } = data;
  const result = await connection.query(`SELECT queueDelete('{${elements}}')`);
  return result.rows;
};

const createMembersQueue = async (connection, data) => {
  const { name, endpointInit, endpointFinal } = data;

  const result = await connection.query(`SELECT queuesMembersGenerate('${name}', ${endpointInit}, ${endpointFinal})`);
  return result.rows;
};

const readAllMembersQueues = async (connection) => {
  const result = await connection.query(`SELECT membersQueuesAllSelect()`);
  return result.rows;
};

const readMembersQueuesByName = async (connection, names) => {
  const result = await connection.query(`SELECT membersByQueueNameSelect('{${names}}')`);
  return result.rows;
};

const readMembersQueuesByEndpoint = async (connection, endpoint) => {
  const result = await connection.query(`SELECT membersByEndpointSelect('${endpoint}')`);
  return result.rows;
};

const deleteMemberQueues = async (connection, data) => {
  const { queue, endpoint } = data;
  const result = await connection.query(`SELECT memberDelete('${endpoint}', '${queue}')`);
  return result.rows;
};

const factory = function (connection) {
  return {
    createQueue: (data) => {
      return createQueue(connection, data);
    },
    readAllQueues: (data) => {
      return readAllQueues(connection);
    },
    readQueuesByName: (data) => {
      return readQueuesByName(connection, data);
    },
    updateQueues: (data) => {
      return updateQueues(connection, data);
    },
    deleteQueues: (data) => {
      return deleteQueues(connection, data);
    },
    createMembersQueue: (data) => {
      return createMembersQueue(connection, data);
    },
    readAllMembersQueues: (data) => {
      return readAllMembersQueues(connection);
    },
    readMembersQueuesByName: (data) => {
      return readMembersQueuesByName(connection, data);
    },
    readMembersQueuesByEndpoint: (data) => {
      return readMembersQueuesByEndpoint(connection, data);
    },
    deleteMemberQueues: (data) => {
      return deleteMemberQueues(connection, data);
    },
  }
};

module.exports = { factory };
