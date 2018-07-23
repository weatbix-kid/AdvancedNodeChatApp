var express = require('express');
var app = express();
var server = require('http').createServer(app);
var socket = require('socket.io')(server);

// Define folder used to serve static files
app.use(express.static('public'))

// Define default route
app.get('/', function(req, res){    
    res.sendFile(__dirname + "/index.html");
})

// When a new connection is made
socket.on('connection', function(clientSocket) {
    console.log('A new user has connected');

    // clientSocket.on('join', function(data){
    //     // clientSocket.broadcast.emit('join', data);
    //     clientSocket.broadcast.emit('join', data);
    //     console.log(data + " has connected");
    // });

    clientSocket.on('chat message', function(msg){
        console.log(msg);
        clientSocket.broadcast.emit('chat message', msg);
    });

    clientSocket.on('disconnect', function(){
        console.log("A user has disconnected");
    });
});

// Set server up to listen on port 3000
server.listen(3000, function(){
    console.log('listening on *:3000');
});