const { Router } = require('express');
const path = require('path');
const { reportController } = require('../controllers');

const reportRoutes = Router();

// const createReportFile = reportController.exportReportController();
// reportRoutes.post('/export', (req, res) => {
//     const result = reportController.exportReportController();
//     res.status(200).json(result);
//     // res.download(path.join(__dirname, `../../../../home/vjpbx/'vigoscloud_report.xlsx`), (err)=>{
//     //   if(err) return err;
//     // });
// });

const createReportFile = reportController.exportReportController();
reportRoutes.post('/export', createReportFile);

reportRoutes.get('/download', (req, res) => {
  const id = req.params.id;
  res.download(path.join(__dirname, '../../../../home/vjpbx/vigoscloud_report.xlsx'), (err)=>{
    if(err) console.log(err);
  });
});

module.exports = reportRoutes;
