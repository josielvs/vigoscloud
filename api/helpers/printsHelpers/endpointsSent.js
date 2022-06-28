const setEndpointsCallsSentsStatus = (receiveds, noReceiveds) => {
  const callsSentsAnswered = receiveds.reduce((obj, item) => ((obj[item.endpoints] = item.sent_answered), obj),{});
  const callsSentsNotAnswer = noReceiveds.reduce((obj, item) => ((obj[item.endpoints] = item.sent_no_aswer), obj),{});

  const verifySort = (a, b) => {
    if(a > b) return 1;
    if (a < b) return -1;
    return 0;
  };

  const labelsAnswered = Object.keys(callsSentsAnswered);
  const labelNoAnswer = Object.keys(callsSentsNotAnswer);
  const labelsVerify = labelsAnswered.concat(labelNoAnswer).sort(verifySort).filter((keylabel) => keylabel.length >= 2 && keylabel.length <= 4);
  const labels = [...new Set(labelsVerify)];

  const dataComplete = labels.map((endpoint, index) => {
    const data = {
      endpoint,
      Atendida: Object.keys(callsSentsAnswered).includes(endpoint) ? Number(callsSentsAnswered[endpoint]) : 0,
      naoAtendidas: callsSentsNotAnswer[endpoint] ? Number(callsSentsNotAnswer[endpoint]) : 0,
    };
    return data;
  });

  const global = {
    sheetName: 'efetuadas_ramal',
    description: 'Chamadas Realizadas por Ramal',
    titles: [
      'Ramal',
      'Atendidas',
      'Nao Atendidas'
    ],
    data: dataComplete
  };
  return global;
};

module.exports = setEndpointsCallsSentsStatus;
