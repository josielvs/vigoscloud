const { StatusCodes } = require('http-status-codes');

const invalidData = {
  isError: true,
  status: StatusCodes.BAD_REQUEST,
  message: 'Invalid data request',
};

const userAlredyExists = {
  isError: true,
  status: StatusCodes.UNAUTHORIZED,
  message: 'Usuario ja cadastrado!',
};

const invalidToken = {
  isError: true,
  status: StatusCodes.UNAUTHORIZED,
  message: 'User unauthorized',
};

module.exports = {
  invalidData,
  userAlredyExists,
  invalidToken,
};
