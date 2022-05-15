'use strict';

const express = require('express');
const app = express();
const http = require('http').createServer(app);
const myModule = require('./my-module.js');
const cookieParser = require('cookie-parser');
const { response } = require('express');
const io = require('socket.io')(http);

app.use(cookieParser());
app.use(express.urlencoded({ extended : true }));
app.use('/public', express.static(__dirname + '/public'));

let server = http.listen(81, () => {

    console.log('Server running on port ' + server.address().port);
});

app.get('/', function(request, response) {

    /* Kolla om nickname-kaka existerar */
    let cookie = request.cookies.nickName;

    if(cookie == null) {

        response.sendFile(__dirname + '/loggain.html');
    } else {

        response.sendFile(__dirname + '/index.html');
    }
});

app.get('/favicon.ico', function(request, respoonse) {

    response.sendFile(__dirname + '/favicon.ico');
});

app.post('/', function(request, response) {

    response.cookie('nickName', request.body.nickname, {maxAge: 1000*60*60});
    console.log('kaka satt');
    response.redirect('/');
});

io.on('connection', function(socket) {

    let cookieString = socket.handshake.headers.cookie;
    let cookieList = myModule.parseCookies(cookieString);

    if(cookieList.nickName != null) {

        socket.nickName = cookieList.nickName;
    }

    socket.on('newBackGround', function(data) {

        io.emit('bytbild', {
            'imgageid': data['background-id'],
            'time': myModule.getTimeStamp(),
            'name': socket.nickName,
        });
    });

});