const setCallsBySector = (receiveds, noReceiveds) => {
  const callsReceivedSector = receiveds.reduce((obj, item) => ((obj[item.sectors] = item.answered), obj),{});
  const callsSentSector = noReceiveds.reduce((obj, item) => ((obj[item.sectors] = item.no_answer), obj),{});

  const verifySort = (a, b) => {
    if(a > b) return 1;
    if (a < b) return -1;
    return 0;
  };
  
  const labelsAnswered = Object.keys(callsReceivedSector);
  const labelNoAnswer = Object.keys(callsSentSector);
  const labelsVerify = labelsAnswered.concat(labelNoAnswer).sort(verifySort);
  const labels = [...new Set(labelsVerify)].filter((sector) => sector !== 'Porteiros');

  const dataComplete = labels.map((sector) => {
    const data = {
      sector,
      Atendida: Object.keys(callsReceivedSector).includes(sector) ? Number(callsReceivedSector[sector]) : 0,
      naoAtendidas: callsSentSector[sector] ? Number(callsSentSector[sector]) : 0,
    };
    return data;
  });

  const global = {
    sheetName: 'chamadas_setores',
    description: 'Chamadas Recebidas por Setor',
    titles: [
      'Setor',
      'Atendidas',
      'Nao Atendidas'
    ],
    data: dataComplete
  };
  return global;
};

module.exports = setCallsBySector;
