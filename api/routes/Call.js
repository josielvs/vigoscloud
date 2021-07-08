const AsteriskAmi = require('asterisk-ami');

const host="192.168.0.150";
const port = '5038';
const username = 'josiel';
const password = 'interfacedesk'
const timeout=60;

const call = (name, dest, exten) => {
  const ami = new AsteriskAmi({ host, port, username, password, timeout });

  ami.connect('connect', function(){
    ami.send({
      'Action': 'Originate',
      'Channel': `PJSIP/${exten}`,
      'Exten': dest,
      'Context': 'ddd-celular',
      'Priority': 1,
      'CallerID': name,
      'Async': 'yes',
    });
    ami.send({ 'Action': 'Logoff' });
  });
}

module.exports = { call };

