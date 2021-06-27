const { StatusCodes } = require('http-status-codes');
const { loginServices } = require('../services');

// Login
exports.signIn = (readUsers) => {
  return async (req, res, next) => {
    const data = req.body;
    try {
      const result = await loginServices.signInLogin(readUsers, data);
      return res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  };
};

// Cadastro
exports.signUp = (createUsers) => {
    return async (req, res, next) => {
    const data = req.body;
    try {
      const result = await loginServices.signUpLogin(createUsers, data);
      return res.status(StatusCodes.CREATED).json(result);
    } catch (error) {
      next(error);
    }
  };
};

/*
// Update 
const updateUser = async (req, res, next) => {
  const data = req.body;
  try {
    const result = await loginServices.updateUser(data);
    return res.status(StatusCodes.CREATED).json(result);
  } catch (error) {
    next(error);
  }
};
module.exports = {
  signIn,
  signUp,
  updateUser,
};
*/
