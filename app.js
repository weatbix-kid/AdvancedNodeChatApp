var express = require('express');
var app = express();
var server = require('http').createServer(app);
var socket = require('socket.io')(server);

var users = [];

// Define folder used to serve static files
app.use(express.static('public'))

// Define default route
app.get('/', function(req, res){    
    res.sendFile(__dirname + "/index.html");
})

// When a new connection is made
socket.on('connection', function(clientSocket) {
    clientSocket.on('new user', function(data, callback){
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

    clientSocket.on('disconnect', function(data){
        if(!clientSocket.username) return;
        users.splice(users.indexOf(clientSocket.username), 1);
        socket.emit('usernames', users);
        clientSocket.broadcast.emit('leave', clientSocket.username + ' disconnected');
    });
});

// Set server up to listen on port 3000
server.listen(3000, function(){
    console.log('listening on *:3000');
});