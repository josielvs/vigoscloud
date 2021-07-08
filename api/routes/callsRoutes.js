const { Router } = require('express');
const { ami } = require('../config');
const { amiCallsModel } = require('../models');
const { callsRealTimeController } = require('../controllers');
const { authMiddleware } = require('../middlewares')
const { call } = require('./Call');

const callsRoutes = Router();

const data = amiCallsModel.factory(ami);

// const click2CallController = callsRealTimeController.clickController(data);
const click2CallController = callsRealTimeController.clickController(data);
callsRoutes.post('/click', authMiddleware, (req, res) => {
  const { name, dest, exten } = req.body;
    try {
      call(name, dest, exten);
      res.status(200).send({message: 'Ligação realizada com sucesso!'});
    } catch (error) {
      res.status(500).send({ error, message: 'Não foi possivel realizar a ligação!'});
    }
});

const cancelClick2CallController = callsRealTimeController.cancelClickController(data);
callsRoutes.post('/cancel-click', authMiddleware, cancelClick2CallController);

const spyCallController = callsRealTimeController.spyController(data);
callsRoutes.post('/spy', authMiddleware, spyCallController);

const transferCallController = callsRealTimeController.transferController(data);
callsRoutes.post('/transfer', authMiddleware, transferCallController);

const cancelTransferCallController = callsRealTimeController.cancelTransferController(data);
callsRoutes.post('/cancel-transfer', authMiddleware, cancelTransferCallController);

module.exports = callsRoutes;
