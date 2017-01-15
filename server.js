'use strict';

const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');
var alarma;
var notificacion;
var Fecha=new Date().toTimeString();

const PORT = process.env.PORT || 3001;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const wss = new SocketServer({ server });

wss.on('connection', function(ws) {
	  console.log('client conected');
    ws.on('message', function(message) {
        console.log('received: %s', message);
        if(message.comando=='buscar' || message.comando=='notificar' || message.comando=='restaurar'){
        	notificacion=message;
        }else{
        alarma=message;
          }
       });
    ws.on('close',() =>console.log('client disconected'));
});




setInterval(() => {
  wss.clients.forEach((client) => {
  	if(alarma.comando!==undefined){
  		client.send(alarma);
  	}else{
  		client.send(notificacion);
  	 }
   });
},1000);



  