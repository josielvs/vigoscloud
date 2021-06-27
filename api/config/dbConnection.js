require('dotenv').config();
const Pool = require('pg').Pool

const conndb = new Pool({
    host: 'localhost', // process.env.PBX_IP_HOST_LOCAL,
    database: 'vigoscloud', // process.env.API_DATABASE_NAME_DB,
    user: 'postgres', // process.env.API_USER_DB,
    password: '!pgsqlServer@Vigos#',// process.env.API_PASSWORD_DB,
    port: 5432,// Number(process.env.API_PORT_DB),
/*    host: process.env.PBX_IP_HOST_LOCAL,
    database: process.env.API_DATABASE_NAME_DB,
    user: process.env.API_USER_DB,
    password: process.env.API_PASSWORD_DB,
    port: Number(process.env.API_PORT_DB), */
});

module.exports = { conndb };
