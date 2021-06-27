exports.readAllController = (callsDb) => {
  return async (req, res, next) => {
    const { day } = req.body;
    const calls = await callsDb.read(day);
    res.status(200).json(calls);
  }
}

exports.readByDateController = (callsDb) => {
  return async (req, res, next) => {
    const { dateStart, dateStop } = req.body;
    const calls = await callsDb.readByDate(dateStart, dateStop);
    res.status(200).json(calls);
  }
}
