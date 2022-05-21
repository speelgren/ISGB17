'use strict';

const express = require('express');
const app = express();
const http = require('http').createServer(app);
const cookieParser = require('cookie-parser');
const io = require('socket.io')(http);

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

  response.cookie('nickName', request.body.nickname);
  response.redirect('/');

  console.log('Cookie set.');
});

app.get('/favicon.ico', (request, response) => {

  response.sendFile(__dirname + '/favicon.ico');
});

io.sockets.on('connection', (socket) => {

  console.log('ny användare ansluten');

  let cookieString = socket.handshake.headers.cookie;
  let cookieList = cookieParser.JSONCookies(cookieString);
  let date = new Date().toISOString().split('T')[0];
  /* split('=')[1] för att ta bort "nickName=" ur cookieList */
  let cookieName = cookieList.split('=')[1];

  socket.on('newMessage', (data) => {

      io.emit('message', {

          'date' : date,
          'name' : cookieName,
          'newMessage' : data.messageID,
      });
  });
});
