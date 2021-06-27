const { Router } = require('express');
const { ami } = require('../config');
const { amiCallsModel } = require('../models');
const { callsRealTimeController } = require('../controllers');
const { authMiddleware } = require('../middlewares')

const callsRoutes = Router();

const data = amiCallsModel.factory(ami);

const click2CallController = callsRealTimeController.clickController(data);
callsRoutes.post('/click', authMiddleware, click2CallController);

const cancelClick2CallController = callsRealTimeController.cancelClickController(data);
callsRoutes.post('/cancel-click', authMiddleware, cancelClick2CallController);

const spyCallController = callsRealTimeController.spyController(data);
callsRoutes.post('/spy', authMiddleware, spyCallController);

const transferCallController = callsRealTimeController.transferController(data);
callsRoutes.post('/transfer', authMiddleware, transferCallController);

const cancelTransferCallController = callsRealTimeController.cancelTransferController(data);
callsRoutes.post('/cancel-transfer', authMiddleware, cancelTransferCallController);

module.exports = callsRoutes;
