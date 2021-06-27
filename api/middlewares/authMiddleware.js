const { verifyToken } = require('../services/tokenServices');
const errors = require('../helpers/errors');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) throw errors.invalidToken;
  try {
    const result = verifyToken(token);
    req.user = result;
    next();
  } catch (error) {
    next(errors.invalidToken);  
  }
};

module.exports = { authMiddleware };
