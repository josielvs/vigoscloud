const { StatusCodes } = require('http-status-codes');

const invalidData = {
  isError: true,
  status: StatusCodes.BAD_REQUEST,
  message: 'Dados da requisicao invalidos',
};

const userAlredyExists = {
  isError: true,
  status: StatusCodes.UNAUTHORIZED,
  message: 'Usuario ja cadastrado!',
};

const invalidToken = {
  isError: true,
  status: StatusCodes.UNAUTHORIZED,
  message: 'Usuario nao autorizado',
};

const sqlDataInvalid = {
  isError: true,
  status: StatusCodes.BAD_REQUEST,
  message: 'Voce nao deveria estar tentando fazer isso! Um e-mail foi reportado!',
};

module.exports = {
  invalidData,
  userAlredyExists,
  invalidToken,
  sqlDataInvalid,
};
