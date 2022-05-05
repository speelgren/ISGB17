//Laboration 1

'use strict';

const express = require('express');
const jsDOM = require('jsdom');
const fs = require('fs');
const http = require('http');
const blogPosts = require('./blogPosts');
const bodyParser = require('body-parser');

let app = express();

//Middleware
app.use('/public', express.static(__dirname + '/public'));
app.use(express.urlencoded( {extended : true} ));

app.listen(81, function() {

    //datum för inlägg:
    let oDate = new Date();
        console.log(
            oDate.toLocaleString('sv-SV', {
            timeZone: 'Europe/Stockholm',
            dateStyle: 'full',
            timeStyle: 'short',
        }),
    );
    console.log('Servern är igång');
});

app.get('/', function(request, response) {

    response.sendFile(__dirname + '/index.html', function(error) {

        if(error) {

            response.status(500).send('500 Server error');
        } else {

            console.log('File sent');
        }
    })
})

app.get('/', function(request, response) {

    fs.readFile(__dirname + '/index.html', function(error, data) {

        if(error) {

            console.log('fel: ' + error);
        } else {

            let htmlCODE = data;
            let serverDOM = new jsDOM.JSDOM(htmlCODE);
            let document = serverDOM.window.document;
            let blogSection = document.querySelector('section');

            htmlCODE = serverDOM.serialize();
            response.send(htmlCODE);
        }
    });
});

app.get('/skriv', function(request, response) {

    response.sendFile(__dirname + '/skriv.html');
});

app.post('/', function(request, response) {

    fs.readFile(__dirname + '/index.html');
});
