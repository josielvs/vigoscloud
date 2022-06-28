const sethoursCallsRecsStatus = (receiveds, noReceiveds) => {
  const callsHoursAnswered = receiveds.reduce((obj, item) => ((obj[Number(item.hours_calls)] = item.answered), obj),{});
  const callsHoursNotAnswer = noReceiveds.reduce((obj, item) => ((obj[Number(item.hours_calls)] = item.no_answer), obj),{});
  
  const labelsAnswered = Object.keys(callsHoursAnswered);
  const labelNoAnswer = Object.keys(callsHoursNotAnswer);
  const labelsVerify = labelsAnswered.concat(labelNoAnswer).sort((a, b) => a - b);
  const labels = [...new Set(labelsVerify)];

  const dataComplete = labels.map((hour) => {
    const data = {
      hour,
      Atendida: Object.keys(callsHoursAnswered).includes(hour) ? Number(callsHoursAnswered[hour]) : 0,
      naoAtendidas: callsHoursNotAnswer[hour] ? Number(callsHoursNotAnswer[hour]) : 0,
    };
    return data;
  });

  const global = {
    sheetName: 'chamadas_hora',
    description: 'Chamadas Recebidas por Hora',
    titles: [
      'Hora',
      'Atendidas',
      'Nao Atendidas'
    ],
    data: dataComplete
  };
  return global;
};

module.exports = sethoursCallsRecsStatus;
