require('dotenv').config();
const AsteriskAmi = require('asterisk-ami');

const host= 'localhost';
const port = 5038;
const username = 'josiel';
const password = 'interfacedesk';
const timeout = 60;

const ami = new AsteriskAmi({ host, port, username, password, timeout });

module.exports = { ami };
