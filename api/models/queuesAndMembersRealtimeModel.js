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

const readQueuesById = async (connection, elements) => {
  const result = await connection.query(`SELECT queueByIdSelect('{${elements}}')`);
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
  const result = await connection.query(`SELECT endpointsUpdate('${name}', '${music}', '${strategy}', '${autofill}', ${maxlen}, '${ringinuse}', '${announcePosition}', ${announceFrequency}, '${announceHoldTime}', ${minAnnounceFrequency}, '${setQueueEntryVarQueue}', ${wrapuptime}, '${joinempty}', '${leavewhenempty}')`);
  return result;
};

const deleteQueues = async (connection, data) => {
  const { elements } = data;
  const result = await connection.query(`SELECT queueDelete('{${elements}}')`);
  return result.rows;
};

const factory = function (connection) {
  return {
    createQueue: (data) => {
      return createQueue(connection, data);
    },
    readAllQueues: (data) => {
      return readAllQueues(connection, data);
    },
    readQueuesById: (data) => {
      return readQueuesById(connection, data);
    },
    updateQueues: (data) => {
      return updateQueues(connection, data);
    },
    deleteQueues: (data) => {
      return deleteQueues(connection, data);
    },
  }
};

module.exports = { factory };
