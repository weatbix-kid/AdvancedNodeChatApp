var socket = io();
var $display = $('.ChatWrapper');
var $chatForm = $('#chat');
var $userInput = $('#userInput');
var $messages = $('#chat-messages');
var $users = $('#user-list');
var currentUser = '';
var $isTypingIndicator = $('#isTyping');

setUsername();

function setUsername(){
    var username = prompt("Desired username", "Connor");
    if(username == null || username == ""){
        setUsername();
    }
    else{
        // emit new user event, if name doesnt exist show the chat
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
    // Clear and update users
    $users.empty();
    for(i=0; i < data.length; i++){
        $users.append('<li>' + data[i] + '</li>');
    }
});

socket.on('whos typing', function(data){
    if(data.length > 0){
        currentlyTyping = data + " is Typing..."
        $isTypingIndicator.html(currentlyTyping);
        $isTypingIndicator.css('display', 'inline');
    }
    else{
        $isTypingIndicator.css('display', 'none');
    }
});

socket.on('chat message', function(msg){
    $messages.append('<li>' + msg + '</li>');
});

$userInput.focus(function(e){
    socket.emit('is typing', true);
});

$userInput.focusout(function(e){
    socket.emit('is typing', false);
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
