exports.clickController = (dataCall) => {
  return async (req, res, next) => {
    const { name, dest, exten } = req.body;
    const call = await dataCall.click({ name, dest, exten })
    res.status(200).json({ message: 'Chamada realizada com sucesso!'});
  }
};

exports.spyController = (dataCall) => {
  return async (req, res, next) => {
    const { dest, exten } = req.body;
    const call = await dataCall.spy({ dest, exten })
    res.status(200).json({ message: 'Spy actived!'});
  }
};

exports.transferController = (dataCall) => {
  return async (req, res, next) => {
    const { dest, channel } = req.body;
    const call = await dataCall.transfer({ dest, channel });
    res.status(200).json({ message: 'Transferência realizada com sucesso!'});
  }
};

exports.cancelTransferController = (dataCall) => {
  return async (req, res, next) => {
    const { dest, channel } = req.body;
    const call = await dataCall.cancelTransfer({ dest, channel });
    res.status(200).json({ message: 'Transferência cancelada com sucesso!'});
  }
};

exports.cancelClickController = (dataCall) => {
  return async (req, res, next) => {
    const { channel } = req.body;
    const call = await dataCall.cancelClick({ channel });
    res.status(200).json({ message: 'Ligação cancelada com sucesso!'});
  }
};