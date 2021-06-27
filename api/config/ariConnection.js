'use strict';

require('dotenv').config();
const client = require('ari-client');

const url = 'http://172.21.100.9:8088';
const username = 'vigospbx';
const password = 'vigosinterface';

// Click To Call - Funcional
// client.connect(url, username, password)
//   .then(function (ari) {
//     const channel = ari.Channel();
//     return channel.originate({endpoint: 'PJSIP/7001', extension: "7000", context:"ddd-celular", callerId: 'Telefonista <7000>', priority: 1});
//   })
//   .then((channel) => {
//     console.log('channel: ', channel);
//   })
//   .catch(function (err) {
//     console.log(err);
//   })
//////////////////////////////////////////////////////////////////////////////////

// Mute example
// http://172.21.100.9:8088/ari/channels/11f366b9-0de7-471b-9f5e-e97813f7a09d/mute?api_key=vigospbx:vigosinterface&direction=both

