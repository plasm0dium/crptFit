var express = require('express');
var app = express();
var port = process.env.PORT || 8100;
var server = app.listen(port);
var io = require('socket.io').listen(server);

// Use middleware file from config folder
require('./config/middleware')(app, express);

// Show what port server listens to
server.listen(port, function(){
  console.log('listening on port...', port);
});

// Connect socket to front end
io.on('connection', function (socket){
  socket.on('connecting', function(room){
    socket.join(room);
  });
  // new chat room
  socket.on('chatroom id', function(room, message){
    io.sockets.to(room).emit('message-append', room, message);
  });
  socket.on('disconnect', function(room){
    socket.leave(room);
  });
});

module.exports = app;
