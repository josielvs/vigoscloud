const { ami } = require('../config');

const clickToCall = (connection, data) => {
  const { name, dest, exten } = data;
  try {
    connection.connect('connect', () => {
console.log('Data_Name: ', name);
console.log('Data_Dest: ', dest);
console.log('Data_Ext: ', exten);
      connection.send({
        'Action': 'Originate',
        'Channel': `PJSIP/${exten}`,
        'Exten': dest,
        'Context': 'from-system',
        'Priority': 1,
        'CallerID': name,
        'Async': 'yes',
      });
      connection.send({ 'Action': 'Logoff' });
    });
    return 200;   
  } catch (error) {
    return 400;
  }
};

const cancelClickToCall = (connection, data) => {
  const { channel } = data;
  try {
    connection.connect('connect', () => {
      connection.send({
        'Action': 'Hangup',
        'Channel': channel,
        'Cause': 127,
      });
      connection.send({ 'Action': 'Logoff' });
    });
    return 200;   
  } catch (error) {
    return 400;
  }
};

const ExtenSpy = (connection, data) => {
  const { dest, exten } = data;
  const extenSpy = `*591${dest}`;
  connection.connect('connect', function(){
    connection.send({
      'Action': 'Originate',
      'Channel': `PJSIP/${exten}`,
      'Exten': extenSpy,
      'Context': 'from-facilities',
      'Priority': 1,
      'Async': 'yes',
    });
    connection.send({ 'Action': 'Logoff' });
  });
}

const transferCall = (connection, data) => {
  const { dest, channel } = data;
  connection.connect('connect', function(){
    connection.send({
      'Action': 'Atxfer',
      'Channel': channel,
      'Exten': dest,
      'Context': 'ddd-celular',
    });
    connection.send({ 'Action': 'Logoff' });
  });
}

const cancelTransfer = (connection, data) => {
  const { dest, channel } = data;
  connection.connect('connect', function(){
    connection.send({
      'Action': 'CancelAtxfer',
      'Channel': channel,
    });
    connection.send({ 'Action': 'Logoff' });
  });
}

const factory = function (connection) {
  return {
    click: (data) => {
      return clickToCall(connection, data);
    },
    spy: (data) => {
      return ExtenSpy(connection, data);
    },
    transfer: (data) => {
      return transferCall(connection, data);
    },
    cancelTransfer: (data) => {
      return cancelTransfer(connection, data);
    },
    cancelClick: (data) => {
      return cancelClickToCall(connection, data);
    }
  }
};
  

module.exports = { factory };
