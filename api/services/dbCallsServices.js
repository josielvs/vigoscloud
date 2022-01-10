const tokenServices = require('./tokenServices');
const { status } = require('../helpers');

// dateStart, dateStop, sector, getEndpoint, telNumber, getProtocol

const caracterSegurityCheck = (caracter) => {
    if(caracter.includes('<') || caracter.includes('>') || caracter.includes(';')) throw status.invalidData;
    return;
};

const checkDatesExists = (dateReceived) => {
  const dateIsReal = Date.parse(dateReceived);
  if(typeof Date.parse(dateIsReal) !== 'number' || isNaN(dateIsReal)) throw status.invalidData;
  caracterSegurityCheck(dateReceived);
  return;
};

const checkSector = (sector) => {
  if(sector === null || sector === undefined) return sector = '';
  if(sector === '') return
  if(typeof sector !== 'string' || !isNaN(Number(sector))) throw status.invalidData;
  if(sector.includes('<') || sector.includes('>') || sector.includes(';')) throw status.invalidData;
  caracterSegurityCheck(sector);
  return;
};

const variableExist = () => {

};

const verifyAllData = (data) => {
  const checkData = data.reduce((acc, curr, index, data) => {
    acc.push(Object.values(curr)[0]);
    return acc;
  },[]);
  return checkData;
}

module.exports = {
  verifyAllData
};
