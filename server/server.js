var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var morgan = require('morgan');
var Promise = require('bluebird');
var app = express();
var port = process.env.PORT || 8100;
var server = app.listen(port);
var io = require('socket.io').listen(server);

var session = require("express-session");
app.use(session({
  key: 'crptFit',
  secret: 'Ted',
  enabledProof: false,
  resave: false,
  saveUninitialized: true
}));

app.use(express.static(__dirname + '/../client/mobile/www'));

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

require('./passport')(passport);

app.use(passport.initialize());
app.use(passport.session());

// Authenticate with Facebook
app.use('/auth', require('./routes/facebook'));

// Get user profile
app.use('/auth', require('./routes/users'));

// Get user's matches
app.use('/auth', require('./routes/match'));

// Get nearby users
app.use('/auth', require('./routes/nearbyuser'));

// Swipe check if swiped user has also swiped right on the user
app.use('/auth', require('./routes/matchcheck'));

// Pull newsfeed from completed tasks of friends
app.use('/auth', require('./routes/newsfeed'));

// Get current user information
app.use('/auth', require('./routes/user'));

// Logout User
app.get('/logout', function(req, res){
  req.session.destroy();
  req.logout();
  res.redirect('/');
});

// Get user tasks
app.use('/auth', require('./routes/task'));

// Get user's friendlist
app.use('/auth', require('./routes/friend'));

// Get all users
app.use('/auth', require('./routes/search'));

// Get all the friend request
app.use('/auth', require('./routes/friendrequest'));

// Get User chat room ID
app.use('/auth', require('./routes/chatsession'));

// Get user progress
app.use('/auth', require('./routes/progress'));

// Post task from user
app.use('/auth', require('./routes/posttask'));

// Confirm friend request from user
app.use('/auth', require('./routes/friendconfirm'));

// Send a friend request to user
app.use('/auth', require('./routes/friendreq'));

// Create new Chat Session
app.use('/auth', require('./routes/createchat'));

// Add message to chat session
app.use('/auth', require('./routes/addmessage'));

// Add progress to database
app.use('/auth', require('./routes/postprogress'));

// Add user longtitude and latitude
app.use('/auth', require('./routes/location'));

// Post user swipes
app.use('/auth', require('./routes/swipes'));

// Update user profile
app.use('/auth', require('./routes/updateprofile'));

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
