const { Router } = require('express');
// const path = require('path');
const { conndb } = require('../config');
const { trunksRealtimeModel } = require('../models');
const { trunksRealtimeController } = require('../controllers');
const { authMiddleware } = require('../middlewares')

const dbCallRoute = Router();

const connRealtimeTrunks = trunksRealtimeModel.factory(conndb);


const readAllTrunksRoute = trunksRealtimeController.readAllController(connRealtimeTrunks);
dbCallRoute.get('/', authMiddleware, readAllTrunksRoute);

const readByIdTrunksRoute = trunksRealtimeController.readByIdController(connRealtimeTrunks)
dbCallRoute.post('/id', authMiddleware, readByIdTrunksRoute);

const createTrunksRoute = trunksRealtimeController.createEndpointsController(connRealtimeTrunks);
dbCallRoute.post('/create', authMiddleware, createTrunksRoute);

const deleteTrunksRoute = trunksRealtimeController.deleteController(connRealtimeTrunks);
dbCallRoute.post('/delete', authMiddleware, deleteTrunksRoute);

module.exports = dbCallRoute;
