const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
const cors = require('cors');
const asteriskManager = require('asterisk-manager');

/*
    Use's express
*/
app.use(cors());



/* 
    Nova conexao com o asterisk 
*/


// ##### Ok #####
// io.on('connection', (socket) => {
//   console.log(`Usuário conectado com ID: ${socket.id}!`);

//   socket.emit('back-to-front', { message: 'BackEnd to FrontEnd'})
// });



const ami = new asteriskManager(5038, '127.0.0.1', 'josiel', 'interfacedesk', true);
ami.keepConnected(); // Esta opcao tenta reconectar caso perca a conexao com o Asterisk

io.on('connection', (socket) => {
  console.log(`Usuário conectado com ID: ${socket.id}!`);
});

// Evento de quando a chamada entra na fila
ami.on('queuecallerjoin', evt => {
    console.log("### Emitindo no canal "+evt.queue+" a mensagem: \r\n "+JSON.stringify(evt)+" \r\n \r\n \r\n");
    io.emit(evt.queue, evt);
});

// Evento de quando a chamada sai da fila (quando e atendida ou abandonada)
ami.on('queuecallerleave', evt => {
    console.log("### Emitindo no canal "+evt.queue+" a mensagem: \r\n "+JSON.stringify(evt)+" \r\n \r\n \r\n");
    io.emit(evt.queue, evt);
});

// Evento de quando a chamada e abandonada
ami.on('queuecallerabandon', evt => {
    console.log("### Emitindo no canal "+evt.queue+" a mensagem: \r\n "+JSON.stringify(evt)+" \r\n \r\n \r\n");
    io.emit(evt.queue, evt);
});
  
//Evento de quando o membro da fila (agente) muda de status
ami.on('queuememberstatus', evt => {
    console.log("### Emitindo no canal "+evt.queue+" a mensagem: \r\n "+JSON.stringify(evt)+" \r\n \r\n \r\n");
    io.emit(evt.queue, evt);
});

// Evento de quando a chamada é atendida
ami.on('agentconnect', evt => {
    console.log("### Emitindo no canal "+evt.queue+" a mensagem: \r\n "+JSON.stringify(evt)+" \r\n \r\n \r\n");
    io.emit(evt.queue, evt);
});

// Evento de membros de uma fila (que so aparece quando voce da um queue show na fila)
ami.on('queuemember', evt => {
  console.log("### Emitindo no canal "+evt.queue+" a mensagem: \r\n "+JSON.stringify(evt)+" \r\n \r\n \r\n");
  io.emit(evt.queue, evt);
});

// Evento de parametros de uma fila (que so aparece quando voce da um queue show na fila)
ami.on('queueparams', evt => {
    console.log("### Emitindo no canal "+evt.queue+" a mensagem: \r\n "+JSON.stringify(evt)+" \r\n \r\n \r\n");
    io.emit(evt.queue, evt);
});

// Evento de membros de uma fila (que so aparece quando voce da um queue show na fila)
ami.on('queueentry', evt => {
  console.log("### Emitindo no canal "+evt.queue+" a mensagem: \r\n "+JSON.stringify(evt)+" \r\n \r\n \r\n");
  io.emit(evt.queue, evt);
});

app.get('/queue-stats', function(req, res) {
  let queue = req.query.queue;

  if(queue != ""){
    ami.action({
        'action': 'QueueStatus',
        'queue': queue,
    }, function(err, res2){
        if(err){
            console.log("#### ERRO: "+JSON.stringify(err));
        }

        if(res2){
          res.statusCode = 200;
          res.send(res2);
        }
    });
  }
});

/* 
    Init do webserver
*/
http.listen(3002, () => {
    console.log("Backend is online in port 3002");
})
