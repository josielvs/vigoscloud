const setDataForPrintGlobalCallsSents = (data) => {
  const global = {
    sheetName: 'externas_realizadas',
    description: 'Geral Ligacoes Externas Realizadas',
    titles: [
      'Total Contato',
      'Total Contatos Atendidos',
      'Total Contatos Nao Atendidos',
      'Total Contatos Ocupados',
      'Total Contatos com Falha',
      'Duracao Total',
      'Tempo Medio',
    ],
    data: [data],
  };
  return global;
};

module.exports = setDataForPrintGlobalCallsSents;
