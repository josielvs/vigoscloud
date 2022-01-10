const { Router } = require('express');
const path = require('path');
const { conndb } = require('../config');
const { callsModel } = require('../models');
const { dbCallsController } = require('../controllers');
const { dbCallsMiddleware, authMiddleware } = require('../middlewares')

const dbCallRoute = Router();

const callsDb = callsModel.factory(conndb);

const readCallsRoute = dbCallsController.readAllController(callsDb);
dbCallRoute.post('/', authMiddleware, readCallsRoute);

const readByDateRoute = dbCallsController.readByDateController(callsDb);
dbCallRoute.post('/by-date', authMiddleware, readByDateRoute);

const readByProtocolRoute = dbCallsController.readByProtocolController(callsDb);
dbCallRoute.post('/protocol', authMiddleware, readByProtocolRoute);

const readByAreaCodeRoute = dbCallsController.readByAreaCodeController(callsDb);
dbCallRoute.post('/code', authMiddleware, readByAreaCodeRoute);

const readAllQueriesReportRoute = dbCallsController.readAllQueriesReportController(callsDb);
dbCallRoute.post('/report', authMiddleware, readAllQueriesReportRoute);

const downloadAudioCall = dbCallRoute.get('/file/:id', (req, res) => {
    const id = req.params.id;
    res.download(path.join(__dirname, `../recs/${id}.wav`), (err)=>{
    if(err) console.log(err);
  });
});

module.exports = dbCallRoute;
