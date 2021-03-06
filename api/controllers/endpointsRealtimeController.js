// const { dbCallsServices } = require('../services');

exports.createEndpointsController = (endpointsRealtime) => {
  return async (req, res, next) => {
    const { type } = req.body;
    const data = req.body;

    if(type === 'SIP') {
      try {
        const result = await endpointsRealtime.createSipEndpoint(data);
      res.status(200).json(result);
      } catch (error) {
        res.status(200).json(error);
      }
    } else {
      const result = await endpointsRealtime.createWebEndpoint(data);
      res.status(500).json(result);
    }
  }
}

exports.readAllController = (endpointsRealtime) => {
  return async (req, res, next) => {
    const { day } = req.body;
    const result = await endpointsRealtime.readAllEndpoints();
    res.status(200).json(result);
  }
}

exports.readByIdController = (endpointsRealtime) => {
  return async (req, res, next) => {
    const { body } = req;
    const result = await endpointsRealtime.readByIdEndpoints(body);
    res.status(200).json(result);
  }
}

exports.updateController = (endpointsRealtime) => {
  return async (req, res, next) => {
    const data = req.body;
    const result = await endpointsRealtime.updateEndpoints(data);
    res.status(200).json(result);
  }
}

exports.deleteController = (endpointsRealtime) => {
  return async (req, res, next) => {
    const data = req.body;
    const result = await endpointsRealtime.deleteEndpoints(data);
    res.status(200).json(result);
  }
}
