const error = require('./errors');

const regex = /^[a-záàâãéèêíïóôõöúçñ ]+$/i;

const validName = (name) => {
  if (!name || name.length < 2 || !regex.test(name)) throw error.invalidData;
};

module.exports = validName;
