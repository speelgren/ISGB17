//Laboration 1

'use strict';

const express = require('express');
const jsDOM = require('jsdom');
const fs = require('fs');
const bloggVektor = require('./blogPosts');
/* Används/behövs ej i express 4.16.0 och över (?) */
//const bodyParser = require('body-parser');

let app = express();

/* Middleware */
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

            /* Skapar virtuell DOM från data: */
            let htmlCODE = data;
            let serverDOM = new jsDOM.JSDOM(htmlCODE);
            let document = serverDOM.window.document;
            let blogSection = document.querySelector('section');

            for(let i = 0; i < bloggVektor.blogPosts.length; i++) {

                /* Skapar en div att lägga varje blogginlägg i. */
                let blogDiv = document.createElement('div');

                let h1Name = document.createElement('h1');
                let h3Subject = document.createElement('h3');
                let pMessageBody = document.createElement('p');
                let h6Time = document.createElement('h6');

                /* Skapar textnode med information från blogPosts-vektor. */
                let h1NameNode = document.createTextNode(bloggVektor.blogPosts[i].nickName);
                let h3SubjectNode = document.createTextNode(bloggVektor.blogPosts[i].msgSubject);
                let pMessageBodyNode = document.createTextNode(bloggVektor.blogPosts[i].msgBody);
                let h6TimeStamp = document.createTextNode(bloggVektor.blogPosts[i].timeStamp);

                h1Name.appendChild(h1NameNode);
                h3Subject.appendChild(h3SubjectNode);
                pMessageBody.appendChild(pMessageBodyNode);
                h6Time.appendChild(h6TimeStamp);

                blogDiv.appendChild(h1Name);
                blogDiv.appendChild(h3Subject);
                blogDiv.appendChild(pMessageBody);
                blogDiv.appendChild(h6Time);

                blogSection.appendChild(blogDiv);
            }

            /* Konverterar virtuell DOM till textsträng. */
            htmlCODE = serverDOM.serialize();
            response.send(htmlCODE);
        }
    });
});

/* Läser in filen skriv.html och presenterar den
 * när användaren besöker localhost:81/skriv */
app.get('/skriv', function(request, response) {

    response.sendFile(__dirname + '/skriv.html');
})

app.post('/skriv', function(request, response) {

        fs.readFile(__dirname + '/skriv.html', function(error, data) {

            if(error) {

                console.log('fel: ' + error);
            } else {

                /* Loggar ett JSON-objekt med allt som skickas med POST från /skriv.html-formuläret. 
                 * Kan sedan välja ut just nickname, subject och msgbody från objektet.*/
                console.log(request.body);

                let name = request.body.nickname;
                let subject = request.body.subject;
                let messageBody = request.body.msgbody;

                /* Namn minst 3 tecken.
                 * Om fel dirigeras till localhost:81/skriv */
                if(name < 3) {

                    response.redirect('/skriv');
                }

                /* Ämne minst 3 tecken.
                 * Om fel dirigeras till localhost:81/skriv */
                if(subject < 3) {

                    response.redirect('/skriv');
                }

                /* Inlägg minst 10 tecken.
                 * Om fel dirigeras till localhost:81/skriv */
                if(messageBody < 10) {

                    response.redirect('/skriv');
                }

                /* Skapar datum-objekt:
                 * Använder toLocaleString()-metoden för att få utskriften "2022-05-04 16:10" 
                 * istället för datum-objektets standardutskrift. */
                let date = new Date();
                let time = date.toLocaleString('sv-SV', {
                                timeZone: 'Europe/Stockholm',
                                dateStyle: 'short',
                                timeStyle: 'short',
                            });

                /* Lägger till POST-info i slutet av blogPosts-vektorn. */
                bloggVektor.blogPosts.push({
                    nickName: name,
                    msgSubject: subject,
                    timeStamp: time,
                    msgBody: messageBody
                });

                response.redirect('/');
            }
        });
});
