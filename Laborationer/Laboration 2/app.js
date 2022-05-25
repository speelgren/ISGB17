'use strict';

const express = require('express');
const app = express();
const http = require('http').createServer(app);
const cookieParser = require('cookie-parser');
const io = require('socket.io')(http);
const cookieParse = require('cookie');

app.use(cookieParser());
app.use(express.urlencoded( { extended : true } ));
app.use('/public', express.static(__dirname + '/public'));

let server = http.listen(3001, () => {

  console.log('Server is running ' + server.address().port);
});

app.get('/', (request, response) => {

  let cookie = request.cookies.nickName;

  if(cookie == null) {

      response.sendFile(__dirname + '/loggain.html');
  } else {

      response.sendFile(__dirname + '/index.html');
  }
});

app.get('/loggain', (request, response) => {

  response.sendFile(__dirname + '/loggain.html');
});

app.post('/', (request, response) => {

  response.cookie('nickName', request.body.nickname, {
    maxAge: 1000*60*60*24,
    httpOnly: true
  });

  try {

    if(request.body.nickname.length < 3) throw new Error ('För kort nickname');

    response.redirect('/');
  } catch ( error ) {

    console.log(error);
    response.sendFile(__dirname + '/loggain.html');
  }
});

app.get('/favicon.ico', (request, response) => {

  response.sendFile(__dirname + '/favicon.ico');
});

/* Använder npm i cookie modul istället. */
io.sockets.on('connection', (socket) => {

  let cookieString = socket.handshake.headers.cookie;
  let cookieObject = cookieParse.parse(cookieString);
  let date = new Date().toISOString().split('T')[0];

  socket.on('newMessage', (data) => {

      io.emit('message', {

          'date' : date,
          'name' : cookieObject.nickName,
          'newMessage' : data.messageID,
      });
  });
});
