const setDataForPrintGlobalCalls = (data) => {
  const global = {
    sheetName: 'recebidas_global',
    description: 'Chamadas Recebidas Global',
    titles: [
      'Atendidas',
      'Nao Atendidas'
    ],
    data: [
      {atendidas: Number(data.answered), naoAtendidas: Number(data.no_answer)}
    ]};
  return global;
};

module.exports = setDataForPrintGlobalCalls;
