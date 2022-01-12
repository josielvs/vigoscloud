const { status } = require('../helpers');

const verifyCaracterSegurity = (caracter) => {
  if (caracter === '') return;
  if(caracter.includes('<') || caracter.includes('>') || caracter.includes(';')) throw status.sqlDataInvalid;
  if(caracter.includes('SELECT') || caracter.includes('INSERT') || caracter.includes('DROP')) throw status.sqlDataInvalid;
  return;
};

const verifyDatesExists = (dateReceived) => {
  if (dateReceived === '') return;
  const dateIsReal = Date.parse(dateReceived);
  if(typeof Date.parse(dateIsReal) !== 'number' || isNaN(dateIsReal) || dateReceived === '') throw status.invalidData;
  return;
};

const verifySector = (sector) => {
  if (sector === '') return;
  if(typeof sector !== 'string' || !isNaN(Number(sector))) throw status.invalidData;
  return;
};

const verifyItemsNumber = (myNumber) => {
  if (myNumber === '') return;
  if(typeof Date.parse(myNumber) !== 'number' || isNaN(myNumber)) throw status.invalidData;
  return;
};

const verifyAllData = (data) => {
  const checkData = data.reduce((acc, curr, index, data) => {
    const elementKey = Object.keys(curr)[0];
    let elementValue = Object.values(curr)[0];

    if(elementValue === null || elementValue === undefined) elementValue = '';

    switch (elementKey) {
      case 'checkedDateInit':
        verifyCaracterSegurity(elementValue);
        verifyDatesExists(elementValue);
        acc.push(elementValue);
        break;

      case 'checkedSector':
        verifyCaracterSegurity(elementValue);
        verifySector(elementValue);
        acc.push(elementValue);
        break;

      case 'checkedGetEndpoint':
        verifyCaracterSegurity(elementValue);
        verifyItemsNumber(elementValue);
        acc.push(elementValue);
        break;

      case 'checkedTelNumber':
        verifyCaracterSegurity(elementValue);
        verifyItemsNumber(elementValue);
        acc.push(elementValue);
        break;

      case 'checkedGetProtocol':
        verifyCaracterSegurity(elementValue);
        verifyItemsNumber(elementValue);
        acc.push(elementValue);
        break;
                      
      default:
        acc.push(elementValue);
    }
    return acc;
  },[]);
  return checkData;
}

module.exports = {
  verifyAllData
};
