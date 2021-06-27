const errors = require('./errors');

const validEmail = (email) => {
  const REGEX = /\S+@\S+\.\S+/;
  if (!REGEX.test(email)) throw errors.invalidData;
};

module.exports = validEmail;
