'use strict';

const socket = io();

window.addEventListener('load', () => {

    console.log('DOM LOADED');

    let sendBTN = document.querySelector('.btn');
    sendBTN.addEventListener('click', (event) => {

        event.preventDefault();
        let sendMSG = document.querySelector('#msg').value;

        try {

            /* Validerar längden på meddelandet */
            if(sendMSG.length < 3) throw new Error ('Meddelandet är för kort');
            
            else 
                sendNewMessage(sendMSG);

                /* Rensare textfältet efter meddelande skickats */
                document.querySelector('#msg').value = null;
        } catch(error) {

            alert(error);
            console.log(error);
        }

    });
});

/* emit till app.js socket */
const sendNewMessage = (sendMSG) => {

    socket.emit('newMessage', {
        'messageID' : sendMSG
    });
}

/* Mottagning av app.js socket data */
socket.on('message', (data) => {

    /* Sektion för meddelande */
    let flowSection = document.querySelector('#flow');
    /* Ny div för varje meddelande */
    let newCHAT = document.createElement('div');

    /* Tid */
    let date = new Date().toISOString().split('T')[0];
    let dateEl = document.createElement('h6');
    let dateNode = document.createTextNode(date);
    dateEl.style.display = 'inline-block';
    dateEl.style.marginRight = '5px';
    dateEl.appendChild(dateNode);

    /* Namn */
    let nameEl = document.createElement('h6');
    /* Måste kunna göra detta bättre med cookie-parser?? Hur??? */
    let nameNode = document.createTextNode(data.name.replace('nickName=', '') + ': ');
    nameEl.style.fontWeight = 'bold';
    nameEl.style.display = 'inline-block';
    nameEl.style.marginRight = '5px';
    nameEl.appendChild(nameNode);

    /* Nytt meddelande */
    let messageEl = document.createElement('h6');
    let messageNode = document.createTextNode(data.newMessage);
    messageEl.style.display = 'inline-block';
    messageEl.appendChild(messageNode);

    newCHAT.append(dateEl ,nameEl, messageEl);
    flowSection.appendChild(newCHAT);
});