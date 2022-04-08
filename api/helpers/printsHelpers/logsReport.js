const logsReport = (resource) => {
  const filtredLogs = resource.map((log) => {
    const date = new Date(log.data);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    const dateBr = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
    const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;

    log.data = `${dateBr} ${time}`;

    delete log.sequencia;
    delete log.tipo_saida;
    delete log.id;
    delete log.encerramento;
    delete log.full_count;
    return log;
  });

  // console.log('LogsReport: ', filtredLogs)

  const global = {
    sheetName: 'Logs_Chamadas',
    description: 'Logs de Chamadas sem Filtro',
    titles: [
      'Data',
      'Origem',
      'Origem Secundaria',
      'Destino',
      'Destino Secundario',
      'Setor',
      'Tempo Espera',
      'Total da Ligação',
      'Status',
      'Tipo',
      'Protocolo'
    ],
    data: filtredLogs,
  };
  return global;
};

module.exports = logsReport;
