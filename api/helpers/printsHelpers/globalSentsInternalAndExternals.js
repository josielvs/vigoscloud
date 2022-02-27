const setDataForPrintInternalsExternals = (data) => {
  const global = {
    sheetName: 'realizadas_inter-exter',
    description: 'Geral Ligacoes Realizadas Internas e Externas',
    titles: [
      'Externas',
      'Internas'
    ],
    data: [ data ],
  };
  return global;
};

module.exports = setDataForPrintInternalsExternals;
