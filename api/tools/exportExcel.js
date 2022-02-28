const xl = require('excel4node');

const excelPrintData = async (params) => {
  const wb = new xl.Workbook();
  const name = 'vigoscloud_report.xlsx';

  params.forEach((worksheet) => {
    const { sheetName, description, titles, data } = worksheet;

    const ws = wb.addWorksheet(sheetName);
    // Style Description
    //(Border Line Styles) ['none', 'thin', 'medium', 'dashed', 'dotted', 'thick', 'double', 'hair', 'mediumDashed', 'dashDot', 'mediumDashDot', 'dashDotDot', 'mediumDashDotDot', 'slantDashDot']
    const descriptionStyle = wb.createStyle({
      font: {
        bold: true,
        size: 14,
        color: '000000'
      },
      alignment: {
        wrapText: false,
        horizontal: 'center',
      },
      border: {
        left: {
            style: 'thin',
            color: '000000'
        },
        right: {
            style: 'thin',
            color: '000000'
        },
        top: {
            style: 'thin',
            color: '000000'
        },
        bottom: {
            style: 'thin',
            color: '000000'
        },
      },
      fill: {
        type: 'pattern',
        patternType: 'solid',
        fgColor: '808080', 
      },
    });

    const headerStyle = wb.createStyle({
      font: {
        bold: true,
        color: '000000',
      },
      alignment: {
        wrapText: true,
        horizontal: 'center',
      },
      border: {
        left: {
            style: 'thin',
            color: '000000'
        },
        right: {
            style: 'thin',
            color: '000000'
        },
        top: {
            style: 'thin',
            color: '000000'
        },
        bottom: {
            style: 'thin',
            color: '000000'
        },
      },
      fill: {
        type: 'pattern',
        patternType: 'solid',
        fgColor: '808080', 
      },
    });

    const bodyStyle = wb.createStyle({
      alignment: {
        horizontal: 'center',
      },
      border: {
        left: {
            style: 'thin',
            color: '000000'
        },
        right: {
            style: 'thin',
            color: '000000'
        },
        top: {
            style: 'thin',
            color: '000000'
        },
        bottom: {
            style: 'thin',
            color: '000000'
        },
      },
    });

    const bodyTripedStyle = wb.createStyle({
      alignment: {
        horizontal: 'center',
      },
      border: {
        left: {
            style: 'thin',
            color: '000000'
        },
        right: {
            style: 'thin',
            color: '000000'
        },
        top: {
            style: 'thin',
            color: '000000'
        },
        bottom: {
            style: 'thin',
            color: '000000'
        },
      },
      fill: {
        type: 'pattern',
        patternType: 'solid',
        fgColor: 'DCDCDC', 
      },
    });

    // Load image on report
    ws.addImage({
      path: '/opt/vigoscloud/api/img/logo_name_mini.png',
      type: 'picture',
      position: {
        type: 'twoCellAnchor',
        from: {
          col: 1,
          colOff: "0.50mm",
          row: 1,
          rowOff: "0.50mm"
        },
        to: {
          col: 1,
          colOff: "25mm",
          row: 1,
          rowOff: "25mm"
        }
      }
    });

    for (let index = 1; index <= titles.length; index++) {
      ws.column(index).setWidth(28);
    }

    // Insert Description => ws.cell(startRow, startColumn, [[endRow, endColumn], isMerged]);
    ws.cell(1, 1, 1, titles.length, true).string(description).style(descriptionStyle);

    // Insert Header
    let setHeadersColumnIndex = 1;
    titles.forEach((header) => {
      ws.cell(2, setHeadersColumnIndex++).string(header).style(headerStyle);
    });

    // Insert data
    let setDataInRowsIndex = 3;
    data.forEach((record) => {
      let columnIndex = 1;
      const striped = setDataInRowsIndex;
      Object.keys(record).forEach((columnName) => {
        if (typeof record[columnName] === 'number') {
          striped % 2 === 0 ?
            ws.cell(setDataInRowsIndex, columnIndex++).number(record[columnName]).style(bodyTripedStyle) :
            ws.cell(setDataInRowsIndex, columnIndex++).number(record[columnName]).style(bodyStyle);
        } else {
          striped % 2 === 0 ?
            ws.cell(setDataInRowsIndex, columnIndex++).string(record[columnName]).style(bodyTripedStyle) :
            ws.cell(setDataInRowsIndex, columnIndex++).string(record[columnName]).style(bodyStyle);
        }
      });
      setDataInRowsIndex++
    });
  });

  // Record file
  try {
    wb.write(`/home/vjpbx/${name}`);
    return { status: true, message: 'Relatorio criado com sucesso!' };
  } catch (error) {
    return error;
  }
};

module.exports = excelPrintData;
