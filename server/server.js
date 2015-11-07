var express = require('express');
var db = require('./mysql/config');
var bodyParser = require('body-parser');
var passport = require('passport');
var morgan = require('morgan');
var Promise = require('bluebird');
var app = express();
var port = process.env.PORT || 8100;
var server = app.listen(port);
var io = require('socket.io').listen(server);


require('./mysql/models/friend');
require('./mysql/models/user');
require('./mysql/models/chat');
require('./mysql/models/message');
require('./mysql/models/weight');
require('./mysql/models/benchpress');
require('./mysql/models/squat');
require('./mysql/models/deadlift');
require('./mysql/models/speed');
require('./mysql/models/chatstore');

require('./mysql/collections/friends');
require('./mysql/collections/users');
require('./mysql/collections/chats');
require('./mysql/collections/messages');
require('./mysql/collections/weights');
require('./mysql/collections/Benchpress');
require('./mysql/collections/squats');
require('./mysql/collections/deadlifts');
require('./mysql/collections/speeds');
require('./mysql/collections/chatstores');


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



// Add Current Weight
app.post('/auth/weight/:stat', function (req, res) {
  var userId = req.user.attributes.id;
  var currWeight = req.params.stat;
  db.model('Weight').newWeight({
    weight: currWeight,
    user_id: userId,
    created_at: new Date()
  })
  .save();
});

// Add Current Bench Press
app.post('/auth/bench/:stat', function (req, res) {
  var userId = req.user.attributes.id;
  var currBench = req.params.stat;
  db.model('Benchpress').newBenchPress({
    benchpress: currBench,
    user_id: userId,
    created_at: new Date()
  })
  .save();
});
// Add Current Squat
app.post('/auth/squat/:stat', function (req, res) {
  var userId = req.user.attributes.id;
  var currSquat = req.params.stat;
  db.model('Squat').newSquat({
    squat: currSquat,
    user_id: userId,
    created_at: new Date()
  })
  .save();
});
// Current Deadlift
app.post('/auth/deadlift/:stat', function (req, res) {
  var userId = req.user.attributes.id;
  var currDeadLift = req.params.stat;
  db.model('DeadLift').newDeadLift({
    deadlift: currDeadLift,
    user_id: userId,
    created_at: new Date()
  })
  .save();
});
// Update Current Speed
app.post('/auth/speed/:stat', function (req, res) {
  var userId = req.user.attributes.id;
  var currSpeed = req.params.stat;
  db.model('Speed').newSpeed({
    speed: currSpeed,
    user_id: userId,
    created_at: new Date()
  })
  .save();
});

// Store User's Current Location or Update if it Exists
app.post('/auth/location', function (req, res) {
  var userId = req.user.attributes.id;
  var lat = req.body.lat;
  var lng = req.body.lng;
  db.collection('Geolocations').fetchByUser(userId)
  .then(function(location) {
    if(location.length === 0) {
      return db.model('Geolocation').newLocation({
        lat: lat,
        lng: lng,
        user_id: userId
      })
      .save();
    } else {
      var locationId = req.user.relations.geolocations.models[0].attributes.id;
      return db.model('Geolocation').updateLocation(locationId,lat, lng);
    }
  });
});

// User Swiped Left on Swiped User
app.post('/auth/leftswipe/:id', function (req,res) {
  var userId = req.user.attributes.id;
  var swipedId = req.params.id;
  db.collection('Swipes').fetchBySwiped(userId, swipedId)
  .then(function(result) {
    db.model('Swipe').updateLeftSwipe(result.models[0].attributes.id);
  });
});

// User Swipes Right on Swiped User
app.post('/auth/rightswipe/:id', function (req,res) {
  var userId = req.user.attributes.id;
  var swipedId = req.params.id;
  db.collection('Swipes').fetchBySwiped(userId, swipedId)
  .then(function(result) {
    db.model('Swipe').updateRightSwipe(result.models[0].attributes.id);
  });
});

app.post('auth/updateprofile', function(req, res) {
  var userId = req.user.attributes.id;
  var newProfile = req.body.profile;
  db.model('User').updateProfile(userId, newProfile);
});

function ensureAuthenticated(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/');
  }
}

server.listen(port, function(){
  console.log('listening on port...', port);
});


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
