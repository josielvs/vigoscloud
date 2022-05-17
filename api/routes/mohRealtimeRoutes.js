const { Router } = require('express');
const path = require('path');
const { conndb } = require('../config');
const { musicOnHoldRealtimeModel } = require('../models');
const { mohRealtimeController } = require('../controllers');
const { authMiddleware } = require('../middlewares')

const mohRoute = Router();

const connRealtimeQueuesAndMembers = musicOnHoldRealtimeModel.factory(conndb);

////////////////////////////////////////////////////// QUEUES ///////////////////////////////////////////////////////////
const createMohRoute = mohRealtimeController.createMohController(connRealtimeQueuesAndMembers);
mohRoute.post('/create', authMiddleware, createMohRoute);

const readAllMohRoute = mohRealtimeController.readAllController(connRealtimeQueuesAndMembers);
mohRoute.get('/', authMiddleware, readAllMohRoute);

const deleteMohRoute = mohRealtimeController.deleteController(connRealtimeQueuesAndMembers);
mohRoute.post('/delete', authMiddleware, deleteMohRoute);

module.exports = mohRoute;
