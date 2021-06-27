const { status } = require('../helpers');
const dbCallsMiddleware = (req, res, next) => {
  const { day } = req.body;
  
  try {
    if (typeof day !== 'number') throw status.invalidData;
    next();
  } catch (error) {
    next(error);  
  }
};

module.exports = { dbCallsMiddleware };
