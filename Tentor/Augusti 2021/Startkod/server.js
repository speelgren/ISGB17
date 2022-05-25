const express = require('express');
const cookieParser = require('cookie-parser');
const globalObject = require('./tenta-modul.js');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);


io.on('connection', function(socket) {  
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