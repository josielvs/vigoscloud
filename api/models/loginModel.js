const read = async (connection) => {
  try {
    const result = await connection.query('SELECT * FROM users');
    return result.rows;
  } catch (error) {
    throw error;
  }
};

const readById = async (connection, id) => {
  try {
    const [[user]] = await connection.query('SELECT * FROM users WHERE id=?', [id]);
    return user;
  } catch (error) {
    throw error;
  }
};

const readByEmail = async (connection, email) => {
  try {
    const result = await connection.query(`SELECT * FROM users WHERE email='${email}'`);
    return result.rows[0];   
  } catch (error) {
    throw error;
  }
};

const create = async (connection, data) => {
  const { name, email, password, endpoint, role, active } = data;
  try {
    const result = await connection.query(
    `INSERT INTO users (name, email, password, endpoint, role, active) VALUES ('${name}', '${email}', '${password}', '${endpoint}', '${role}', '${active}' )`);
    return result;    
  } catch (error) {
    throw error;
  }
};

const update = async (connection, data) => {
  const { name, email } = data;
  try {
    const [user] = await connection.query(
      'UPDATE users SET name=? WHERE email=?', [name, email],
    );
    return user;
  } catch (error) {
    throw error;
  }
};

const factory = function (connection) {
  return {
    read: () => {
      return read(connection);
    },
    readById: (id) => {
      return readById(connection, id);
    },
    readByEmail: (email) => {
      return readByEmail(connection, email);
    },
    create: (data) => {
      return create(connection, data);
    },
    update: (data) => {
      return update(connection, data);
    }
  }
};

module.exports = { factory };
