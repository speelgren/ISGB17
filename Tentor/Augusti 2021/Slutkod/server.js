'use strict'

const express = require('express');
const cookieParser = require('cookie-parser');
const globalObject = require(__dirname + '/tenta-modul.js');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

/* Del 1 */
app.use(cookieParser());
app.use(express.urlencoded( {extended : true } ));
app.use('/public', express.static(__dirname + '/public'));

let server = http.listen(3000, () => {

  console.log(`Server is running on PORT ${server.address().port}`);
});

app.get('/', (request, response) => {

  let namn = request.cookies.namn;
  let gdpr = request.cookies.gdpr;

  if(namn === undefined || gdpr === undefined) {

    response.sendFile(__dirname + '/login.html');
  } else {

    response.sendFile(__dirname + '/index.html');
  }
});

app.post('/', (request, response) => {

  let namn = request.body.namn;
  let gdpr = request.body.gdpr;

  try {

    if(namn === '') throw new Error ('Du måste ange ett namn');
    if(namn.length < 5) throw new Error ('Namnet måste vara minst 5 vecken långt');
    if(!globalObject.isFirstUpperCase(namn)) throw new Error ('Namnet måste börja med en versal');
    if(gdpr === undefined) throw new Error ('Du måste tillåta att ingen data kommer att sparas!');

    response.cookie('namn', namn, {

      maxAge: 1000*60*60*24,
      httpOnly: true
    });

    response.cookie('gdpr', 'true', {

      maxAge: 1000*60*60*24,
      httpOnly: true
    });

    response.redirect('/');

  } catch ( error ) {

    response.send(error);
  }
});

io.on('connection', function(socket) {

  /* Del 2 */
  let cookieString = socket.handshake.headers.cookie;
  let cookielist = globalObject.parseCookies(cookieString);

  if(cookielist.namn != undefined && cookielist.gdpr != undefined) {

    if(io.engine.clientsCount === 1) {

      globalObject.playerOneName = cookielist.namn;
      globalObject.playerOneReady = false;
      globalObject.playerOneSocketId = socket.id;
      globalObject.playerOneTotalMoves = 0;
    } else if(io.engine.clientsCount === 2) {

      globalObject.playerTwoName = cookielist.namn;
      globalObject.playerTwoReady = false;
      globalObject.playerTwoSocketId = socket.id;
      globalObject.playerTwoTotalMoves = 0;
    } else {

      socket.disconnect('Spelet är fullt');
    }
  } else {

    socket.disconnect('Namn saknas');
  }

  /* Del 3 */
  socket.on('player-ready', () => {

    if(socket.id === globalObject.playerOneSocketId) {

      globalObject.playerOneReady = true;
    } else if(socket.id === globalObject.playerTwoSocketId) {

      globalObject.playerTwoReady = true;
    }

    if(globalObject.playerOneReady && globalObject.playerTwoReady) {

      io.to(globalObject.playerOneSocketId).emit('game-start');
      io.to(globalObject.playerTwoSocketId).emit('game-start');

      globalObject.currentNumber = globalObject.getARandomNumber(0, 10);
    }
  });

  socket.on('player-play', (number) => {

    let status = 0;
    if(number > globalObject.currentNumber) {

      status = 1;
    } else if(number < globalObject.currentNumber) {

      status = -1;
    }

    if(socket.id === globalObject.playerOneSocketId) {

      globalObject.playerOneTotalMoves++;
      io.to(globalObject.playerOneSocketId).emit('game-status', {

        'status': status,
        'totalMoves': globalObject.playerOneTotalMoves,
        'lastNumber': number
      });
    } else if(socket.id === globalObject.playerTwoSocketId) {

      globalObject.playerTwoTotalMoves++;
      io.to(globalObject.playerTwoSocketId).emit('game-status', {

        'status': status,
        'totalMoves': globalObject.playerTwoTotalMoves,
        'lastNumber': number
      });
    }
  });

  /* Del 4 */
  socket.on('player-done', () => {

    if(socket.id === globalObject.playerOneSocketId) {

      globalObject.playerOneDone = true;
    } else if(socket.id === globalObject.playerTwoSocketId) {

      globalObject.playerTwoDone = true;
    }

  let p1Status = 0;
  let p2Status = 0;

  if(globalObject.playerOneTotalMoves < globalObject.playerTwoTotalMoves) {

    p1Status = 1;
    p2Status = -1;
  } else if(globalObject.playerOneTotalMoves > globalObject.playerTwoTotalMoves) {

    p1Status = -1;
    p2Status = 1;
  }

  if(globalObject.playerOneDone && globalObject.playerTwoDone) {

    io.to(globalObject.playerOneSocketId).emit('game-score', {

        'p1Winner': p1Status,
        'p2Winner': p2Status,
        'p1Name': globalObject.playerOneName,
        'p1TotalMoves': globalObject.playerOneTotalMoves,
        'p2Name': globalObject.playerTwoName,
        'p2TotalMoves': globalObject.playerTwoTotalMoves
      });
    io.to(globalObject.playerTwoSocketId).emit('game-score', {

        'p1Winner': p1Status,
        'p2Winner': p2Status,
        'p1Name': globalObject.playerOneName,
        'p1TotalMoves': globalObject.playerOneTotalMoves,
        'p2Name': globalObject.playerTwoName,
        'p2TotalMoves': globalObject.playerTwoTotalMoves
      });
    }
  });
    //Denna "funktion" startar om spelet på klient-sidan samt sätter tillbaka de variabler som har används
    socket.on('game-restart', function(){
    	if(io.engine.clientsCount === 2){
    		globalObject.playerOneReady = false;
	    	globalObject.playerTwoReady = false;
	    	globalObject.playerOneDone = false;
	    	globalObject.playerTwoDone = false;
	    	globalObject.playerTwoTotalMoves = 0;
	    	globalObject.playerOneTotalMoves = 0;

	    	io.to(globalObject.playerOneSocketId).emit("game-init");
	    	io.to(globalObject.playerTwoSocketId).emit("game-init");

	    	io.to(globalObject.playerOneSocketId).emit("reset-board");
	    	io.to(globalObject.playerTwoSocketId).emit("reset-board");
    	}
    });

});
