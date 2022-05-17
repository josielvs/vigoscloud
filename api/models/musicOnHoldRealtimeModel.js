const createMoh = async (connection, data) => {
  const { name, position, entry } = data;
  const result = await connection.query(`SELECT mohGenerate('${name}', '${position}', '${entry}')`);
  return result.rows;
};

const readAllMoh = async (connection) => {
  const result = await connection.query(`SELECT mohSelect()`);
  return result.rows;
};

const deleteMoh = async (connection, data) => {
  const { elements } = data;
  const result = await connection.query(`SELECT mohDelete('{${elements}}')`);
  return result.rows;
};

const factory = function (connection) {
  return {
    create: (data) => {
      return createMoh(connection, data);
    },
    read: (data) => {
      return readAllMoh(connection);
    },
    delete: (data) => {
      return deleteMoh(connection, data);
    },
  }
};

module.exports = { factory };
