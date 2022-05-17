const express = require('express');
const cors = require('cors');
const port = 3001;
const { errorMiddleware } = require('./middlewares');
const route = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/db', route.dbCallsRoutes);
app.use('/api/login', route.loginRoutes);
app.use('/api/calls', route.callsRoutes);
app.use('/api/download', route.dbCallsRoutes);
app.use('/api/report', route.exportReportRoutes);
app.use('/api/config/endpoints', route.endpointsRealtimeRoutes);
app.use('/api/config/trunks', route.trunksRealtimeRoutes);
app.use('/api/config/queues', route.queuesAndMembersRealtimeRoutes);
app.use('/api/config/moh', route.mohRealtimeRoutes)

app.use(errorMiddleware);

app.listen(port, () => console.log(`API started in port ${port}`));
