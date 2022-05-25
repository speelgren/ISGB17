module.exports = {
	playerOneName: null,
	playerTwoName: null,
	playerOneReady: null,
	playerTwoReady: null,
	playerOneDone: null,
	playerTwoDone: null,
	playerOneSocketId: null,
	playerTwoSocketId: null,
	currentNumber: null,
	playerOneTotalMoves: null,
	playerTwoTotalMoves: null,


	parseCookies: function (rc) {
        let list = {};
        //*************************************************************************************** */
        //Funktion för att parsa cookie-sträng  
        rc && rc.split(';').forEach(function (cookie) {
            var parts = cookie.split('=');
            list[parts.shift().trim()] = decodeURI(parts.join('='));
        });
        //Hämtad ifrån: https://stackoverflow.com/questions/45473574/node-js-cookies-not-working
        //*************************************************************************************** */
        return list;
    },


    //Returnerar ett heltal från det minsta värdet till det störta
    getARandomNumber: function(min, max){
    	return Math.floor(Math.random() * (max - min + 1) + min);
    },

    //Returnerar true om första bokstaven i en sträng är en versal
	isFirstUpperCase: function(str){
	    return str.charAt(0) === str.charAt(0).toUpperCase()
	}
}

