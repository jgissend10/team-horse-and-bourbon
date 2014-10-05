var express = require('express')
var urlencode = require('urlencode')
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var twilio = require('twilio');
var client = twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

server.listen(process.env.PORT || 5000);

//app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/index.html')
})

app.get('/test', function(request, response) {
  response.sendFile(__dirname + '/locationTest.html')
})

app.post('/handleSMS', function(request, response) {
  if (twilio.validateExpressRequest(request, process.env.AUTH_TOKEN)) {
        var twiml = new twilio.TwimlResponse();

        twiml.message(request.param('body'));

        response.type('text/xml');
        response.send(twiml.toString());
    }
    else {
        response.send('you are not twilio.  Buzz off.');
    }
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
