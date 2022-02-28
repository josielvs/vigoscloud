const { exportReportServices } = require('../services');

exports.exportReportController = () => {
  return async (req, res, next) => {
    const { body } = req;
    try {
      const create = await exportReportServices.getAllElementsToPrint(body);
      res.status(200).json(create);
    } catch (error) {
      next(error);
    }
  }
}
