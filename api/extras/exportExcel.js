const xl = require('excel4node');

const informations = [{
  sheetName: 'chamadas_por_hora',
  description: 'Chamadas por Hora',
  titles: [
    'Hora',
    'Atendidas',
    'Nao Atendidas'
  ],
  data: [
    {hour: '7', atendidas: '1', naoAtendidas: '0'},
    {hour: '8', atendidas: '2', naoAtendidas: '0'},
    {hour: '10', atendidas: '2', naoAtendidas: '0'},
    {hour: '11', atendidas: '1', naoAtendidas: '0'},
    {hour: '12', atendidas: '2', naoAtendidas: '0'},
    {hour: '13', atendidas: '0', naoAtendidas: '2'},
    {hour: '15', atendidas: '1', naoAtendidas: '3'},
    {hour: '18', atendidas: '1', naoAtendidas: '5'},
    {hour: '19', atendidas: '0', naoAtendidas: '4'}
  ]},{
    sheetName: 'chamadas_por_setor',
    description: 'Chamadas por Setor',
    titles: [
      'Setor',
      'Atendidas',
      'Nao Atendidas'
    ],
    data: [
      {hour: '7', atendidas: '10', naoAtendidas: '0'},
      {hour: '8', atendidas: '20', naoAtendidas: '0'},
      {hour: '10', atendidas: '20', naoAtendidas: '0'},
      {hour: '11', atendidas: '10', naoAtendidas: '0'},
      {hour: '12', atendidas: '20', naoAtendidas: '0'},
      {hour: '13', atendidas: '00', naoAtendidas: '2'},
      {hour: '15', atendidas: '10', naoAtendidas: '3'},
      {hour: '18', atendidas: '10', naoAtendidas: '5'},
      {hour: '19', atendidas: '00', naoAtendidas: '4'}
    ]},
];

// Params
// Sheet Name
// Description
// Title Name

const excelPrintData = async (params) => {
  const wb = new xl.Workbook();
  const name = 'vigoscloud_report.xlsx';

  params.forEach((worksheet) => {
    const { sheetName, description, titles, data } = worksheet;

    const ws = wb.addWorksheet(sheetName);
    // Style Description
    var descriptionStyle = wb.createStyle({
      font: {
        bold: true,
        size: 14,
      },
      alignment: {
        wrapText: true,
        horizontal: 'center',
      },
    });

    // Insert Description => ws.cell(startRow, startColumn, [[endRow, endColumn], isMerged]);
    ws.cell(1, 1, 1, titles.length, true).string(description).style(descriptionStyle);

    // Insert Header
    let setHeadersColumnIndex = 1;
    titles.forEach((header) => {
      ws.cell(2, setHeadersColumnIndex++).string(header);
    });

    // Insert data
    let setDataInRowsIndex = 3;
    data.forEach((record) => {
      let columnIndex = 1;
      Object.keys(record).forEach((columnName) => {
        ws.cell(setDataInRowsIndex, columnIndex++).string(record[columnName.toString()]);
      });
      setDataInRowsIndex++
    });
  });

  // Record file
  wb.write(`/home/vjpbx/${name}`);
};

excelPrintData(informations);
