var express = require('express')
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');

var twilio = require('twilio');
var client = twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

var pg = require('pg');

server.listen(process.env.PORT || 5000);

//app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

// parse application/json
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/index.html')
})

app.get('/test', function(request, response) {
  response.sendFile(__dirname + '/locationTest.html')
})

app.get('/db', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM test_table', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.send(result.rows); }
    });
  });
})

app.post('/handleSMS', urlencodedParser, function (req, res) {
  if (!req.body) return res.sendStatus(400)
  var resp = new twilio.TwimlResponse();
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query("SELECT username FROM user_table WHERE phone = '" + req.body.From + "'", function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       {
       	resp.message("Welcome back! " + result.rows[0]);
  		res.writeHead(200, {
        	'Content-Type':'text/xml'
    	});
  		res.end(resp.toString()); 
        }
    });
  });
  
})

app.get('/smsTest', function(request, response) {
	//Send an SMS text message
client.sendMessage({

    to:'+15025094584', // Any number Twilio can deliver to
    from: '+15028225740', // A number you bought from Twilio and can use for outbound communication
    body: 'Test sms.' // body of the SMS message

}, function(err, responseData) { //this function is executed when a response is received from Twilio

    if (!err) { // "err" is an error received during the request, if any

        // "responseData" is a JavaScript object containing data received from Twilio.
        // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
        // http://www.twilio.com/docs/api/rest/sending-sms#example-1

        console.log(responseData.from); // outputs "+14506667788"
        console.log(responseData.body); // outputs "word to your mother."
        response.send("Worked!");

    }
});
})

io.on('connection', function (socket) {
  socket.on('location', function (data) {
    console.log(data);
  });
  socket.on('disconnect', function () {
    console.log("Disconnected");
   });
});
