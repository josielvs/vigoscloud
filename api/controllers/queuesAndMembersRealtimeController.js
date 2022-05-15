// const { dbCallsServices } = require('../services');

exports.createQueueController = (queuesRealtime) => {
  return async (req, res, next) => {
    const data = req.body;
    const result = await queuesRealtime.createQueue(data);
    res.status(200).json(result);
  }
}

exports.readAllQueuesController = (queuesRealtime) => {
  return async (req, res, next) => {
    const result = await queuesRealtime.readAllQueues();
    res.status(200).json(result);
  }
}

exports.readQueueByNameController = (queuesRealtime) => {
  return async (req, res, next) => {
    const { names } = req.body;
    const result = await queuesRealtime.readQueuesByName(names);
    res.status(200).json(result);
  }
}

exports.updateQueueController = (queuesRealtime) => {
  return async (req, res, next) => {
    const data = req.body;
    // console.log('Controller', data);
    const result = await queuesRealtime.updateQueues(data);
    res.status(200).json(result);
  }
}

exports.deleteQueuesController = (queuesRealtime) => {
  return async (req, res, next) => {
    const data = req.body;
    const result = await queuesRealtime.deleteQueues(data);
    res.status(200).json(result);
  }
}

exports.createMembersQueuesController = (queuesRealtime) => {
  return async (req, res, next) => {
    const data = req.body;
      const result = await queuesRealtime.createMembersQueue(data);
      res.status(200).json(result);
  }
}

exports.readAllMembersQueuesController = (queuesRealtime) => {
  return async (req, res, next) => {
    const result = await queuesRealtime.readAllMembersQueues();
    res.status(200).json(result);
  }
}

exports.readMembersByQueueNameController = (queuesRealtime) => {
  return async (req, res, next) => {
    const { names } = req.body;
    const result = await queuesRealtime.readMembersQueuesByName(names);
    res.status(200).json(result);
  }
}

exports.readMembersByQueueEndpointController = (queuesRealtime) => {
  return async (req, res, next) => {
    const { endpoints } = req.body;
    const result = await queuesRealtime.readMembersQueuesByEndpoint(endpoints);
    res.status(200).json(result);
  }
}

exports.deleteMembersController = (queuesRealtime) => {
  return async (req, res, next) => {
    const data = req.body;
    const result = await queuesRealtime.deleteMemberQueues(data);
    res.status(200).json(result);
  }
}
