var socket = io();
var $chatForm = $('#chat');
var $userInput = $('#userInput');
var $messages = $('#chat-messages');

// socket.on('connect', function(data){
//     socket.emit('join', '{Name}');
// })

// socket.on('join', function(msg){
//     $messages.append("<li>" + msg + " has connected" + "</li>");
// })

socket.on('chat message', function(msg){
    $messages.append("<li>" + msg + "</li>");
});

$chatForm.submit(function(e){
    e.preventDefault();
    $messages.append("<li>" + $userInput.val() + "</li>");
    socket.emit('chat message', $userInput.val());
    $userInput.val('');
});
