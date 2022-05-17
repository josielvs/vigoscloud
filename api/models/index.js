const callsModel = require('./dbCallsModel');
const loginModel = require('./loginModel');
const amiCallsModel = require('./amiModel');
const endpointsRealtimeModel = require('./endpointsRealtimeModel');
const trunksRealtimeModel = require('./trunksRealtimeModel');
const queuesAndMembersRealtimeModel = require('./queuesAndMembersRealtimeModel');
const musicOnHoldRealtimeModel = require('./musicOnHoldRealtimeModel');

module.exports = {
  callsModel,
  loginModel,
  amiCallsModel,
  endpointsRealtimeModel,
  trunksRealtimeModel,
  queuesAndMembersRealtimeModel,
  musicOnHoldRealtimeModel,
};
