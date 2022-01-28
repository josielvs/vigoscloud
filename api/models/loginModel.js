const read = async (connection) => {
  const result = await connection.query('SELECT * FROM users');
  return result.rows;
};

const readById = async (connection, id) => {
  const [[user]] = await connection.query('SELECT * FROM users WHERE id=?', [id]);
  return user;
};

const readByEmail = async (connection, email) => {
  const result = await connection.query(`SELECT * FROM users WHERE email='${email}'`);
  return result.rows[0];
};

const create = async (connection, data) => {
  const { name, email, password, endpoint, role, active } = data;
  const [user] = await connection.query(
  `INSERT INTO users (name, email, password, endpoint, role, active) VALUES ('${name}', '${email}', '${password}', '${endpoint}', '${role}', '${active}' )`);
  return user;
};

const update = async (connection, data) => {
  const { name, email } = data;
  const [user] = await connection.query(
    'UPDATE users SET name=? WHERE email=?', [name, email],
  );
  return user;
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
