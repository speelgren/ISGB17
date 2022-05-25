'use strict';

//Steg 2 - GET & POST!
//npm install -g nodemon

//npm init
//npm install express

//npm install jsdom

n

let app = express();

//Middleware...
app.use('/public', express.static(__dirname + '/static'));
app.use(express.urlencoded( { extended : true } ));

app.listen(81, function() {

  console.log('Servern är igång!');
});

app.get('/', function(request, response) {

  console.log('En utskrift från get...');
  response.sendFile(__dirname + '/static/html/index.html');
});


app.post('/', function(request, response) {

  console.log('En utskrift från post...');
  console.log(request.body.nickname);
  //response.sendFile(__dirname + '/static/html/index.html');

  fs.readFile(__dirname + '/static/html/index.html', function(error, data) {

    if ( error ) {

      console.log('Något gick fel!'); //skicka med felmeddelande, kod. osv.
    } else {

      // console.log(data.toString()); HTML-filen.

      /* kontrollera så att användaren skrivit in någonting i nickname.
       * Gör sen */

      let serverDOM = new jsDOM.JSDOM(data);
      let mainNodeRef = serverDOM.window.document.querySelector('main');

      let h1Ref = serverDOM.window.document.createElement('h1');
      let h1RefTextNode = serverDOM.window.document.createTextNode(request.body.nickname);

      h1Ref.appendChild(h1RefTextNode);
      mainNodeRef.appendChild(h1Ref);

      data = serverDOM.serialize();
      response.send(data);
    } //Fixa så att det går över till UTF-8. ÅÄÖ fungerar inte efter att man skickat till servern.
  });
});
