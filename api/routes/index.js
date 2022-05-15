const dbCallsRoutes = require('./dbCallsRoutes');
const loginRoutes =  require('./loginRoutes');
const callsRoutes = require('./callsRoutes');
const exportReportRoutes = require('./exportReportRoutes');
const endpointsRealtimeRoutes = require('./endpointsRealtimeRoutes');
const trunksRealtimeRoutes = require('./trunksRealtimeRoutes');
const queuesAndMembersRealtimeRoutes = require('./queuesAndMembersRealtimeRoutes');

module.exports = {
  dbCallsRoutes,
  loginRoutes,
  callsRoutes,
  exportReportRoutes,
  endpointsRealtimeRoutes,
  trunksRealtimeRoutes,
  queuesAndMembersRealtimeRoutes, 
};
