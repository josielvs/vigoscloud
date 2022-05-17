exports.createMohController = (mohRealtime) => {
  return async (req, res, next) => {
    const data = req.body;
      const result = await mohRealtime.create(data);
      res.status(200).json(result);
  }
}

exports.readAllController = (mohRealtime) => {
  return async (req, res, next) => {
    const { day } = req.body;
    const result = await mohRealtime.read();
    res.status(200).json(result);
  }
}

exports.deleteController = (mohRealtime) => {
  return async (req, res, next) => {
    const data = req.body;
    const result = await mohRealtime.delete(data);
    res.status(200).json(result);
  }
}
