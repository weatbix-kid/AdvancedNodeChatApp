var express = require('express');
var app = express();
var server = require('http').createServer(app);
var socket = require('socket.io')(server);

var users = [];
var usersTyping = [];

// Define folder used to serve static files
app.use(express.static('public'))

// Define default route
app.get('/', function(req, res){    
    res.sendFile(__dirname + "/index.html");
})

// When a new connection is made
socket.on('connection', function(clientSocket) {
    clientSocket.on('new user', function(data, callback){

        // Check if username has not been taken
        if(users.indexOf(data) != -1){
            callback(false); 
        }
        else {
            callback(true);
            clientSocket.username = data;
            users.push(clientSocket.username);
            socket.emit('usernames', users);
            clientSocket.broadcast.emit('join', clientSocket.username + ' connected');
        }
    });

    clientSocket.on('chat message', function(msg){
        clientSocket.broadcast.emit('chat message', clientSocket.username + ": " + msg);
    });

    clientSocket.on('is typing', function(isTyping){

        // If the client is typing update usersTyping array and emit it
        if(isTyping == true){
            usersTyping.push(clientSocket.username);
            socket.emit('whos typing', usersTyping);
        }
        else{ // If the client is no longer typing update usersTyping array and emit it
            usersTyping.splice(usersTyping.indexOf(clientSocket.username), 1);
            socket.emit('whos typing', usersTyping);
        }
    });

    clientSocket.on('disconnect', function(data){
        // Remove the user from all arrays
        users.splice(users.indexOf(clientSocket.username), 1);
        usersTyping.splice(usersTyping.indexOf(clientSocket.username), 1);

        // Emit updated arrays
        socket.emit('usernames', users);
        socket.emit('whos typing', usersTyping);

        // Notify others of leave event with broadcast 
        clientSocket.broadcast.emit('leave', clientSocket.username + ' disconnected');
    });
});

// Set server up to listen on port 3000
server.listen(3000, function(){
    console.log('listening on *:3000');
});