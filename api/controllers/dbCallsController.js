exports.readAllController = (callsDb) => {
  return async (req, res, next) => {
    const { day } = req.body;
    const calls = await callsDb.read(day);
    res.status(200).json(calls);
  }
}

exports.readByDateController = (callsDb) => {
  const { dateStart, dateStop } = req.body;

  try {
    async (req, res, next) => {
      const calls = await callsDb.readByDate(dateStart, dateStop);
      res.status(200).json(calls);
    }
  } catch (error) {
    next(error);
  }
  }
}

exports.readByProtocolController = (callsDb) => {
  return async (req, res, next) => {
    const { protocol } = req.body;
    const call = await callsDb.readByProtocol(protocol);
    res.status(200).json(call);
  }
}

exports.readByAreaCodeController = (callsDb) => {
  return async (req, res, next) => {
    const { code } = req.body;
    const call = await callsDb.readByAreaCode(code);
    res.status(200).json(call);
  }
}