const WebSocket = require('ws');
const fs = require('fs');

const dateBrGenerate = (dateAndTime) => {
  const date = new Date(dateAndTime);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  const dateBr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;

  const dateBrFull = `${dateBr} ${time}`;

  return dateBrFull;
};

const writeOnFile = (content) => {
  fs.appendFile('/home/tamarozzi/calls.csv', content, function(erro) {
    if(erro) {
        throw erro;
    }
    return;
  });
};

const pbxEvents = new WebSocket(`ws://localhost:8088/ari/events?api_key=vigospbx:vigosinterface&app=pbxLogEvents&subscribeAll=true`);
pbxEvents.onerror = function error(error){ console.log(error); };

pbxEvents.onmessage = (event) => {
  const obj = JSON.parse(event.data);

  if(obj.type === 'Dial' && obj.caller) {
    const { caller: { dialplan: { context } } } = obj;
    if(context !== 'dial-send') {
      if(obj.dialstatus === 'ANSWER') {
        const { peer: { connected: { number }, creationtime, caller } } = obj;

        const dateBrTransformed = dateBrGenerate(creationtime);

        let content = `${dateBrTransformed}, ${number}, ${caller.number}`;
        content += '\n'
        writeOnFile(content);
        return;
      }
    };
  };

  if(obj.type === 'BridgeAttendedTransfer') {
    const { transferer_first_leg: { dialplan: { context } } } = obj;
    const { transferer_second_leg: { creationtime } } = obj;

    const dateBrTransformed = dateBrGenerate(creationtime);

    const print = context !== 'dial-send'?
        `${dateBrTransformed}, ${obj.transferee.caller.number}, ${obj.transferer_second_leg.connected.number}`
      :
        `${dateBrTransformed}, ${obj.transferer_second_leg.dialplan.app_data.split('/')[1].split('@')[0]}, ${obj.transferer_second_leg.connected.number}`;
    
    writeOnFile(print);
    
    return;
  };

  if(obj.type === 'BridgeBlindTransfer') {
    const { channel: { dialplan: { context }, creationtime } } = obj;

    const dateBrTransformed = dateBrGenerate(creationtime);

    const print = context !== 'dial-send'?
        `${dateBrTransformed}, ${obj.channel.connected.number}, ${obj.exten}`
      :
        `${dateBrTransformed}, ${obj.channel.dialplan.app_data.split('/')[1].split('@')[0]}, ${obj.exten}`;
        
    writeOnFile(print);

    return;
  };
};
