const dbCallsController = require('./dbCallsController');
const loginController = require('./loginController');
const callsRealTimeController = require('./callsRealTimeController');
const reportController = require('./exportReportController');
const endpointsRealtimeController = require('./endpointsRealtimeController');
const trunksRealtimeController = require('./trunksRealtimeController');
const queuesAndMembersRealtimeController = require('./queuesAndMembersRealtimeController');
const mohRealtimeController = require('./mohRealtimeController')

module.exports = {
  dbCallsController,
  loginController,
  callsRealTimeController,
  reportController,
  endpointsRealtimeController,
  trunksRealtimeController,
  queuesAndMembersRealtimeController,
  mohRealtimeController,
};