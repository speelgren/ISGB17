'use strict';

let socket = io();

window.addEventListener('load', () => {

    let buttons = document.querySelectorAll('.birdbutton');

    buttons.forEach((button) => {

        button.addEventListener('click', sendNewBackgroundImage);
    });
});

function sendNewBackgroundImage(event) {

    event.preventDefault();

    socket.emit('newBackGround', {
        'backgroundid': event.target.getAttribute('data-birdid')
    });
}

socket.on('bytbild', function(data) {

    let body = document.querySelector('body');
    body.style.backgroundImage = `url(/public/images/${data.imageid}.jpg)`;
});
