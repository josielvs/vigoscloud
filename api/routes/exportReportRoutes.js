const { Router } = require('express');
const path = require('path');
const { reportController } = require('../controllers');

const reportRoutes = Router();

const createReportFile = reportController.exportReportController();
reportRoutes.post('/export', createReportFile);

const createReportLogFile = reportController.exportLogController();
reportRoutes.post('/export-logs', createReportLogFile);

reportRoutes.get('/download-stats', (req, res) => {
  const id = req.params.id;
  res.download(path.join(__dirname, '../../../../home/vjpbx/vigoscloud_report.xlsx'), (err)=>{
    if(err) console.log(err);
  });
});

reportRoutes.get('/download-logs', (req, res) => {
  const id = req.params.id;
  res.download(path.join(__dirname, '../../../../home/vjpbx/vigoscloud_logscalls.xlsx'), (err)=>{
    if(err) console.log(err);
  });
});

module.exports = reportRoutes;
