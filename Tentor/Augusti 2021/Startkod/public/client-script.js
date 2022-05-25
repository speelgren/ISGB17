'use strict'

//Variabel för Socket.io
let socket = io();

window.onload = function(){
	//Hämtar upp alla knappar, div:ar och textrutor
	let readyButton = document.getElementById("ready_btn");
	let gameArea = document.getElementById("game_area");
	let startArea = document.getElementById("start_area");
	let waitArea = document.getElementById("wait_area");
	let resultWaitingArea = document.getElementById("result_waiting_area");
	let resultArea = document.getElementById("result_area");
	let infoArea = document.getElementById("info_area");

	let guessText = document.getElementById("guess_text");
	let statusText = document.getElementById("status_text");

	let replayButton = document.getElementById("replay_btn");
	let guessButton = document.getElementById("guess_btn");
	let guessNum = document.getElementById("guess_num");



	//Ändrar värdet på knappen när input-fältet ändras
	guessNum.addEventListener("change", function(){
		guessButton.value = "Gissa på " + guessNum.value;
	});

	//Kollar så att användaren inte skriver in några bokstäver
	guessNum.addEventListener("keydown", function(e){
		console.log(e.key);
		if(!isFinite(e.key) && e.key != "Backspace"){
			e.preventDefault();
		}
	});

	//Ändrar värdet på knappen när input-fältet ändras (manuellt)
	guessNum.addEventListener("keyup", function(e){	
		if(guessNum.value > 10){
			guessNum.value = 10;
		}
		guessButton.value = "Gissa på " + guessNum.value;
	});


	//Startar om spelet när sidan laddas (ingen spelare ska "hoppa in" mitt i ett spel)
	socket.emit("game-restart");

	//Knapp för att spelaren ska vara redo på klientsidan
	readyButton.addEventListener("click", function(e){
		e.preventDefault();
		readyButton.value = "Jag är redo!";
		socket.emit('player-ready');
	});


	//Knapp för att gissa på ett nummer
	guessButton.addEventListener("click", function(e){
		e.preventDefault();
		socket.emit("player-play", guessNum.value);
	});


	//Knapp för att spela igen
	replayButton.addEventListener("click", function(e){
		e.preventDefault();
		socket.emit("game-restart");
	});

	//Gömmer element för att vänta på spelare 2
	socket.on('game-init', function(){
		$(waitArea).fadeOut("fast", function(){
			$(startArea).fadeIn("fast");
		});
		
	});


	//Gömmer element för att starta spelet
	socket.on("game-start", function(){
		$(startArea).fadeOut("fast", function(){
			$(gameArea).fadeIn("fast");
			$(info_area).fadeIn("fast");
		});
		
	});


	//Uppdaterar status för spelaren på klientsidan
	socket.on("game-status", function(data){
		if(data.totalMoves == 1){
			guessText.textContent = "Du har gissat " + data.totalMoves + " gång! Det senaste nummret du gissade var " + data.lastNumber;
		}else{
			guessText.textContent = "Du har gissat " + data.totalMoves + " gånger! Det senaste nummret du gissade var " + data.lastNumber;
		}
		
		if(data.status === 1){
			statusText.textContent = "Du gissade för högt";
		}else if(data.status === -1){
			statusText.textContent = "Du gissade för lågt";
		}else if(data.status === 0){
			statusText.textContent = "Du gissade rätt";
			$(gameArea).fadeOut("fast");
			$(resultWaitingArea).fadeIn("fast");
			//$(info_area).fadeOut("fast");
			
			socket.emit("player-done");
		}
	});


	//Skriver ut resultat på båda spelarna
	socket.on("game-score", function(data){
		$(resultWaitingArea).fadeOut("fast");
		$(resultArea).fadeIn("fast");

		let p1NameWin = document.getElementById("result_area_p1Name");
		let p1MoveWin = document.getElementById("result_area_p1Moves");
		let p1StatusWin  = document.getElementById("result_area_p1Winner");

		let p2NameWin = document.getElementById("result_area_p2Name");
		let p2MoveWin = document.getElementById("result_area_p2Moves");
		let p2StatusWin  = document.getElementById("result_area_p2Winner");


		if(data.p1Winner == 1 && data.p2Winner == -1){
			p1StatusWin.textContent = "Du vann!";
			p2StatusWin.textContent = "Du förlorade!";
		}else if (data.p1Winner == -1 && data.p2Winner == 1){
			p1StatusWin.textContent = "Du förlorade!";
			p2StatusWin.textContent = "Du vann!";
		}else{
			p1StatusWin.textContent = "Det blev lika!";
			p2StatusWin.textContent = "Det blev lika!";
		}

		p1NameWin.textContent = data.p1Name;
		p1MoveWin.textContent = data.p1TotalMoves;

		p2NameWin.textContent = data.p2Name;
		p2MoveWin.textContent = data.p2TotalMoves;
	});


	//Ställer tillbaka allt för att spelarna ska trycka på "redo"-knappen
	socket.on("reset-board", function(){
		$(resultArea).fadeOut("fast", function(){
			$(startArea).fadeIn("fast");
		});
		$(gameArea).fadeOut("fast");
		$(info_area).fadeOut("fast");
		
		guessNum.value = 0;
		guessButton.value = "Gissa på " + guessNum.value;
		statusText.textContent = "Gissa ett nummer!";
		guessText.textContent = "Du har gissat 0 gånger!";
		readyButton.value = "Jag är inte redo!";
	});
}

