const setEndpointsCallsRecsStatus = (receiveds, noReceiveds) => {
  const callsRecevedsAnswered = receiveds.reduce((obj, item) => ((obj[item.endpoints] = item.received_answered), obj),{});
  const callsRecevedsNotAnswer = noReceiveds.reduce((obj, item) => ((obj[item.endpoints] = item.received_no_aswer), obj),{});

  const verifySort = (a, b) => {
    if(a > b) return 1;
    if (a < b) return -1;
    return 0;
  };

  const labelsAnswered = Object.keys(callsRecevedsAnswered);
  const labelNoAnswer = Object.keys(callsRecevedsNotAnswer);
  const labelsVerify = labelsAnswered.concat(labelNoAnswer).sort(verifySort).filter((keylabel) => keylabel.length >= 2 && keylabel.length <= 4);
  const labels = [...new Set(labelsVerify)];

  const dataComplete = labels.map((endpoint, index) => {
    const data = {
      endpoint,
      Atendida: Object.keys(callsRecevedsAnswered).includes(endpoint) ? Number(callsRecevedsAnswered[endpoint]) : 0,
      naoAtendidas: callsRecevedsNotAnswer[endpoint] ? Number(callsRecevedsNotAnswer[endpoint]) : 0,
    };
    return data;
  });

  const global = {
    sheetName: 'recebidas_ramal',
    description: 'Chamadas Recebidas por Ramal',
    titles: [
      'Ramal',
      'Atendidas',
      'Nao Atendidas'
    ],
    data: dataComplete
  };
  return global;
};

module.exports = setEndpointsCallsRecsStatus;
