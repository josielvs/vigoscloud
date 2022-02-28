const setDataForPrintGlobalCallsReceiveds = (data) => {
  const global = {
    sheetName: 'externas_recebidas',
    description: 'Geral Ligacoes Externas Recebidas',
    titles: [
      'Total Contato',
      'Total Contatos Atendidos',
      'Total Contatos Nao Atendidos',
      'Total Contatos Ocupados',
      'Chamadas de Transbordo',
      'Duracao Total',
      'Tempo Medio',
      'Tempo Medio na Fila'
    ],
    data: [data],
  };
  return global;
};

module.exports = setDataForPrintGlobalCallsReceiveds;
