// const { dbCallsServices } = require('../services');

exports.createEndpointsController = (trunkRealtime) => {
  return async (req, res, next) => {
    const data = req.body;
      const result = await trunkRealtime.createTrunk(data);
      res.status(200).json(result);
  }
}

exports.readAllController = (trunkRealtime) => {
  return async (req, res, next) => {
    const { day } = req.body;
    const result = await trunkRealtime.readAllTrunks();
    res.status(200).json(result);
  }
}

exports.readByIdController = (trunkRealtime) => {
  return async (req, res, next) => {
    const { elements } = req.body;
    const result = await trunkRealtime.readTrunkById(elements);
    res.status(200).json(result);
  }
} 

exports.deleteController = (trunkRealtime) => {
  return async (req, res, next) => {
    const data = req.body;
    const result = await trunkRealtime.deleteTrunks(data);
    res.status(200).json(result);
  }
}
