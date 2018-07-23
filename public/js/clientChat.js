var socket = io();
var $display = $('.ChatWrapper');
var $chatForm = $('#chat');
var $userInput = $('#userInput');
var $messages = $('#chat-messages');
var $users = $('#user-list');
var currentUser = '';

setUsername();

function setUsername(){
    var username = prompt("Desired username", "Connor");
    if(username == null || username == ""){
        setUsername();
    }
    else{
        socket.emit('new user', username, function(data){
            if(data){
                $display.css('display', 'flex');
                currentUser = username;
            }
            else{
                setUsername();
            }
        });
    }
}

socket.on('usernames', function(data){
    $users.empty();
    for(i=0; i < data.length; i++){
        console.log(data[i]);
        $users.append('<li>' + data[i] + '</li>');
    }
});

socket.on('chat message', function(msg){
    $messages.append('<li>' + msg + '</li>');
});

socket.on('join', function(msg){
    $messages.append('<li id="connectionMessage">' + msg + '</li>');
});

socket.on('leave', function(msg){
    $messages.append('<li id="connectionMessage">' + msg + '</li>');
});

$chatForm.submit(function(e){
    e.preventDefault();
    $messages.append('<li>' + currentUser + ': ' + $userInput.val() + '</li>');
    socket.emit('chat message', $userInput.val());
    $userInput.val('');
});
