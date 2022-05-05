//Laboration 1

'use strict';

const express = require('express');
const jsDOM = require('jsdom');
const fs = require('fs');
const blogVektor = require('./blogPosts');

let app = express();

//Middleware
app.use('/public', express.static(__dirname + '/public'));
app.use(express.urlencoded( {extended : true} ));

app.listen(81, function() {

    console.log('Servern är igång');
});

app.get('/', function(request, response) {

    fs.readFile(__dirname + '/index.html', function(error, data) {

        if(error) {

            response.status(500).send('500 Server error');
        } else {

            let htmlCODE = data;
            let serverDOM = new jsDOM.JSDOM(htmlCODE);
            let document = serverDOM.window.document;
            let blogSection = document.querySelector('section');

            for(let i = 0; i <= blogVektor.blogPosts.length - 1; i++) {

                let blogDiv = document.createElement('div');
                let h1Name = document.createElement('h1');
                let h1Subject = document.createElement('h3');
                let h1MessageBody = document.createElement('p');
                let h1Time = document.createElement('h6');

                let h1NameNode = document.createTextNode(blogVektor.blogPosts[i].nickName);
                let h1SubjectNode = document.createTextNode(blogVektor.blogPosts[i].msgSubject);
                let h1MessageBodyNode = document.createTextNode(blogVektor.blogPosts[i].msgBody);
                let h1TimeStamp = document.createTextNode(blogVektor.blogPosts[i].timeStamp);

                h1Name.appendChild(h1NameNode);
                h1Subject.appendChild(h1SubjectNode);
                h1MessageBody.appendChild(h1MessageBodyNode);
                h1Time.appendChild(h1TimeStamp);

                blogDiv.appendChild(h1Name);
                blogDiv.appendChild(h1Subject);
                blogDiv.appendChild(h1MessageBody);
                blogDiv.appendChild(h1Time);

                blogSection.appendChild(blogDiv);
            }

            htmlCODE = serverDOM.serialize();
            response.send(htmlCODE);
        }
    });
});

app.get('/skriv', function(request, response) {

    response.sendFile(__dirname + '/skriv.html');
})

app.post('/skriv', function(request, response) {

    console.log(request.body.nickname);

        fs.readFile(__dirname + '/skriv.html', function(error, data) {

            if(error) {

                console.log('fel: ' + error);
            } else {

                let name = request.body.nickname;
                let subject = request.body.subject;
                let messageBody = request.body.msgbody;

                if(name < 3) {

                    response.redirect('/skriv');
                }

                if(subject < 10) {

                    response.redirect('/skriv');
                }

                if(messageBody < 3) {

                    response.redirect('/skriv');
                }

                let date = new Date();

                blogVektor.blogPosts.push({
                    nickName: request.body.nickname,
                    msgSubject: request.body.subject,
                    timeStamp: date.toLocaleString(
                        'sv-SV', {
                                timeZone: 'Europe/Stockholm',
                                dateStyle: 'short',
                                timeStyle: 'short',
                    }),
                    msgBody: request.body.msgbody
                });

                response.redirect('/');
            }
        });
});
