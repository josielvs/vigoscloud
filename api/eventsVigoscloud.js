const WebSocket = require('ws');
const fs = require('fs');

const pbxEvents = new WebSocket(`ws://localhost:8088/ari/events?api_key=vigospbx:vigosinterface&app=pbxLogEvents&subscribeAll=true`);
pbxEvents.onerror = function error(error){ console.log(error); };

pbxEvents.onmessage = (event) => {
  const obj = JSON.parse(event.data);

  if(obj.type === 'Dial' && obj.caller) {
    const { caller: { dialplan: { context } } } = obj;
    if(context === 'dial-entrance') {
      if(obj.dialstatus === 'ANSWER') {
        const { peer: { connected: { number }, creationtime, caller } } = obj;

        const date = new Date(creationtime);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const hour = date.getHours();
        const minute = date.getMinutes();
        const second = date.getSeconds();

        const dateBr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;

        const dateBrFull = `${dateBr} ${time}`;

        let content = `${dateBrFull}, ${number}, ${caller.number}`;
        content += '\n'

        const isExternal = number.length;
        if(isExternal > 4) {
          fs.appendFile('/home/tamarozzi/calls.csv', content, function(erro) {
            if(erro) {
                throw erro;
            }
            return;
          });
        };
        return;
      }
    }
  }
};
