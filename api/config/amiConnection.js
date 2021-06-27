require('dotenv').config();
const AsteriskAmi = require('asterisk-ami');

const host= process.env.PBX_IP_HOST_LOCAL;
const port = process.env.AMI_PORT;
const username = process.env.AMI_USER;
const password = process.env.AMI_PASSWORD;
const timeout = process.env.AMI_TIMEOUT;

const ami = new AsteriskAmi({ host, port, username, password, timeout });

module.exports = { ami };
