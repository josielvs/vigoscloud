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
app.use('/api/config', route.configRealtimeRoutes);
app.use('/api/download', route.dbCallsRoutes);

app.use(errorMiddleware);

app.listen(port, () => console.log(`API started in port ${port}`));
