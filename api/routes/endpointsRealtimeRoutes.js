const { Router } = require('express');
const path = require('path');
const { conndb } = require('../config');
const { endpointsRealtimeModel } = require('../models');
const { endpointsRealtimeController } = require('../controllers');
const { dbCallsMiddleware, authMiddleware } = require('../middlewares')

const dbCallRoute = Router();

const connRealtimeEndpoints = endpointsRealtimeModel.factory(conndb);


const readAllEndpointsRoute = endpointsRealtimeController.readAllController(connRealtimeEndpoints);
dbCallRoute.get('/', authMiddleware, readAllEndpointsRoute);

const readByIdEndpointsRoute = endpointsRealtimeController.readByIdController(connRealtimeEndpoints)
dbCallRoute.post('/id', authMiddleware, readByIdEndpointsRoute);

const createEndpointsRoute = endpointsRealtimeController.createEndpointsController(connRealtimeEndpoints);
dbCallRoute.post('/create', authMiddleware, createEndpointsRoute);

const updateEndpointsRoute = endpointsRealtimeController.updateController(connRealtimeEndpoints);
dbCallRoute.post('/update', authMiddleware, updateEndpointsRoute);

const deleteEndpointsRoute = endpointsRealtimeController.deleteController(connRealtimeEndpoints);
dbCallRoute.post('/delete', authMiddleware, deleteEndpointsRoute);

module.exports = dbCallRoute;
