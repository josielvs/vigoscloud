const { errorMiddleware } = require('./errorMiddleware');
const { authMiddleware } = require('./authMiddleware');
const { dbCallsMiddleware } = require('./dbCallsMiddleware');

module.exports = {
  errorMiddleware,
  authMiddleware,
  dbCallsMiddleware,
};
