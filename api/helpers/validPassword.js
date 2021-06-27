const errors = require('./errors');

const validPassword = (password) => {
  if (!password || password.length < 6) throw errors.invalidData;
};

module.exports = validPassword;
