var express = require('express');
var db = require('./mysql/config');
var bodyParser = require('body-parser');
var passport = require('passport');
var morgan = require('morgan');
var app = express();
var port = process.env.PORT || 8100;

require('./mysql/models/client');
require('./mysql/models/friend');
require('./mysql/models/task');
require('./mysql/models/user');
require('./mysql/models/friend_request');
require('./mysql/models/client_request');
require('./mysql/models/chat');
require('./mysql/models/message');
require('./mysql/models/weight');
require('./mysql/models/benchpress');
require('./mysql/models/squat');
require('./mysql/models/deadlift');
require('./mysql/models/speed');

require('./mysql/collections/clients');
require('./mysql/collections/friends');
require('./mysql/collections/tasks');
require('./mysql/collections/users');
require('./mysql/collections/friend_requests');
require('./mysql/collections/client_requests');
require('./mysql/collections/chats');
require('./mysql/collections/messages');
require('./mysql/collections/weights');
require('./mysql/collections/Benchpress');
require('./mysql/collections/squats');
require('./mysql/collections/deadlifts');
require('./mysql/collections/speeds');

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
// Direct to Facebook Login
app.get('/auth/facebook',
  passport.authenticate('facebook', {
    scope: ['public_profile', 'email', 'user_friends', 'user_birthday']
 }));

// Facebook Auth Callback
app.get('/auth/facebook/callback', function (req, res, next) {
  passport.authenticate('facebook',
    function(err, user, info) {
      if (err) { return next(err); }
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        res.redirect( '/#/tab/homepage' );
      });
    })(req, res, next);
});

app.get('/tab/homepage', ensureAuthenticated, function (req,res) {
  if(res.user) {
    res.json(req.user.toJSON());
  } else {
    res.redirect('/');
  }
});

app.get('/auth/picture', function(req, res){
 db.model('User').fetchById({id: req.user.attributes.id})
 .then(function(user){
   res.json(user);
 });
});

// Logout User
app.get('/logout', function(req, res){
  console.log('LOGOUT REQ.USER', req.user.attributes);
  req.session.destroy();
  req.logout();
  res.redirect('/');
});

// Get All User's Tasks
app.get('/auth/tasks', ensureAuthenticated, function (req,res) {
  db.collection('Tasks').fetchByUser(req.user.attributes.id)
  .then(function(tasks) {
    console.log('THIS IS A TASK :', tasks);
    res.json(tasks.toJSON());
  });
});

// Fetch Logged in Users Friends
var storage = [];
app.get('/auth/friends', function (req, res) {
  db.collection('Friends').fetchByUser(req.user.attributes.id)
  .then(function(friends) {
    var friendsArray = friends.models;
    for(var i = 0; i < friendsArray.length; i++ ) {
      db.model('User').fetchById({
        id: friendsArray[i].attributes.friends_id
      })
      .then(function(result) {
        storage.push(result);
      })
    }})
      .then(function() {
        console.log('RES>JSON :', storage);
        return res.json(storage);
      }).then(function () {
        storage = [];
      });
  });

//Search a Friends Friends
  app.get('/auth/friends/:id', function (req, res) {
    db.collection('Friends').fetchByUser(req.params.id)
    .then(function(friends) {
      var friendsArray = friends.models;
      for(var i = 0; i < friendsArray.length; i++ ) {
        db.model('User').fetchById({
          id: friendsArray[i].attributes.friends_id
        })
        .then(function(result) {
          storage.push(result);
        })
      }})
        .then(function() {
          console.log('RES>JSON :', storage)
          return res.json(storage);
        }).then(function () {
          storage = [];
        })
    });

//Search All Users to Add as Friend
app.get('auth/users/search:username', function (req, res) {
  var Username = req.params.username;
  db.collection('Users').searchByUsername(Username)
  .then(function(friend) {
    res.json(friend.toJSON());
  })
});

// Fetch a User's Clients
app.get('/auth/clients', ensureAuthenticated,function (req, res) {
  db.collection('Clients').fetchByUser(req.user.attributes.id)
  .then(function(clients) {
    console.log('THESE ARE USER CLIENTS :', clients);
    res.json(clients.toJSON());
  });
});

//Fetch a User's Trainers
app.get('/auth/trainers', function (req, res) {
  db.collection('Trainers').fetchByUser(req.user.attributes.id)
  .then(function(trainers) {
    console.log('GET: THESE ARE USER TRAINERS :', trainers);
    res.json(trainers.toJSON());
  })
})

//Add a new Stat
// app.post('/auth/stat/add', function (req, res) {
// }

// Fetch Chatroom
app.get('/auth/chat/get:id', function (req, res){
  var chatId = req.params.id;
  db.model('Chat').fetchById(chatId)
  .then(function(chat) {
    console.log('THIS IS CHAT ROOM :', chat);
    res.json(chat.relations.message.models.toJSON());
  });
});

app.get('/auth/weight/:id', function (req, res){
  var userId = req.params.id;
  db.collection('Weights').fetchByUser(userId)
  .then(function(user){
    console.log('THIS IS YOUR WEIGHT: ', user);
    res.json(user.toJSON());
  });
});

app.get('/auth/benchpress/:id', function (req, res){
  var userId = req.params.id;
  db.collection('BenchPress').fetchByUser(userId)
  .then(function(user){
    console.log('THIS IS YOUR BENCHPRESS', user);
    res.json(user.toJSON());
  });
});

app.get('/auth/deadlift/:id', function (req, res){
  var userId = req.params.id;
  db.collection('DeadLifts').fetchByUser(userId)
  .then(function(user){
    console.log('THIS IS YOUR DEADLIFTS', user);
    res.json(user.toJSON());
  });
});

app.get('/auth/squats/:id', function (req, res){
  var userId = req.params.id;
  db.collection('Squats').fetchByUser(userId)
  .then(function(user){
    console.log('THIS IS YOUR SQUATS', user);
    res.json(user.toJSON());
  });
});

app.get('/auth/speeds/:id', function (req, res){
  var userId = req.params.id;
  db.collection('Speeds').fetchByUser(userId)
  .then(function(user){
    console.log('THIS IS YOUR SPEED', user);
    res.json(user.toJSON());
  });
});

// Add a New Task to User
app.post('/auth/tasks/:taskname', function (req, res) {
  var task = req.params.taskname;
  db.model('Task').newTask({
    description: taskname,
    complete: false,
    user_id: req.user.attributes.id
  }).save()
  .then(function(task) {
    return task;
  })
  .catch(function (err) {
    console.log('ERR IN POST /auth/tasks : ', err);
  });
});

// Update User's Task to Complete
app.post('/auth/task/complete/:id', function(req, res) {
  var taskId = req.params.id;
  db.model('Task').completeTask(taskId)
  .then(function () {
    console.log('TASK UPDATED TO COMPLETE :', db.model('Task').fetchByUser(req.user.attributes.id));
  })
  .catch(function (err) {
    return err;
  });
});

// Confirm Client Request and adds Client to User
app.post('/auth/confirmclient', function (req, res) {
  var userId = req.user.attributes.id;
  var clientId = req.params.id;
   db.model('clientRequest').acceptClientRequest({
    user_id: userId,
    client_id: clientId,
    updated_at: new Date()
  })
  .then(function () {
    db.model('clientRequest').acceptClientRequest({
      user_id: clientId,
      client_id: userId,
      updated_at: new Date()
    })
  })
  .then(function (){
  db.model('Client').newClient({
    client_id: userId,
    user_id: clientId
  })
  .save()
  })
  .then(function (){
  db.model('Trainer').newClient({
    trainer_id: clientId,
    user_id: user_id
  })
  .save()
  })
  .then(function(newClient) {
    console.log('ADDED NEW CLIENT :', newClient);
    return newClient;
  })
  .catch(function(err) {
    return err;
  });
});

//Send Client Request
app.post('/auth/clientreq/add:id', function (req, res){
  var userId = req.user.attributes.id;
  var clientId = req.params.id;
  db.model('clientRequest').newClientRequest({
    client_id: clientId,
    user_id: userId,
    status: 0,
    created_at: new Date()
  })
  .save()
  .then(function () {
    db.model('clientRequest').newClientRequest({
      client_id: userId,
      user_id: clientId,
      status: 0,
      created_at: new Date()
    })
    .save()
  })
  .then(function (clientreq) {
    console.log('ADD CLIENT REQUEST', clientreq);
    return clientreq;
  })
  .catch(function (err){
    return err;
  })
})

// Send a friend request
app.post('/auth/friendreq/add:id', function (req, res){
  var userId = req.user.attributes.id;
  var friendId = req.params.id;
  db.model('friendRequest').newFriendRequest({
    friend_id: friendId,
    user_id: userId,
    status: 0,
    created_at: new Date()
  })
  .save()
  .then(function (){
    db.model('friendRequest').newFriendRequest({
      friend_id: userId,
      user_id: friendId,
      status: 0,
      created_at: new Date()
    })
    .save()
  })
  .then(function (friendreq){
    console.log('ADD FRIEND REQUEST', friendreq);
    return friendreq;
  })
  .catch(function(err){
    return err;
  })
})

// Confirm friend request and add each other as friend

app.post('/auth/confirmfriend/:id', function (req, res){
  var userId = req.user.attributes.id;
  var friendId = req.params.id;
  db.model('friendRequest').acceptFriendRequest({
    user_id: userId,
    friend_id: friendId,
    updated_at: new Date()
  })
  .then(function () {
    db.model('friendRequest').acceptFriendRequest({
      user_id: friendId,
      friend_id: userId,
      updated_at: new Date()
    })
  })
  .then(function(){
     db.model('Friend').newFriend({
      friends_id: friendId,
      user_id: userId
    })
    .save()
  })
  .then(function() {
    db.model('Friend').newFriend({
      friends_id: userId,
      user_id: friendId
    })
    .save()
  })
  .then(function (acceptReq) {
    console.log('Request accepted', acceptReq);
    return acceptReq;
  })
  .catch(function(err){
    return err;
  });
});

//Creates a Chat Session
app.post('/auth/chat/add:id', function (req, res){
  var userId1 = req.user.attributes.id;
  var userId2 = req.params.id;
  db.model('Chat').newChat({
    user_id: userId1,
    user2_id: userId2,
    created_at: new Date()
  })
  .save()
  .then(function(){
    db.model('Chat').newChat({
      user_id: userId2,
      user2_id: userId1,
      created_at: new Date()
    })
    .save()
  })
});

//Adds Messages to chat session
app.post('/auth/messages/add:id', function (req, res){
  var userId = req.user.attributes.id;
  var chatId = req.params.id;
  var body = req.body.message;
  db.model('Message').newMessage({
    user_id: userId,
    chat_id: chatId,
    text: message,
    created_at: new Date()
  })
  .save()
});

//Add Current Weight
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

//Add Current Bench Press
app.post('/auth/bench/:stat', function (req, res) {
  var userId = req.user.attributes.id;
  var currBench = req.params.stat;
  db.model('benchpress').newBenchPress({
    weight: currBench,
    user_id: userId,
    created_at: new Date()
  })
  .save();
});

//Add Current Squat
app.post('/auth/squat/:stat', function (req, res) {
  var userId = req.user.attributes.id;
  var currSquat = req.params.stat;
  db.model('Squat').newSquat({
    weight: currSquat,
    user_id: userId,
    created_at: new Date()
  })
  .save();
});

// Current Deadlift
app.post('/auth/deadlift/:stat', function (req, res) {
  var userId = req.user.attributes.id;
  var currDeadLift = req.params.stat;
  db.model('Deadlift').newDeadLift({
    weight: currDeadLift,
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
    weight: currSpeed,
    user_id: userId,
    created_at: new Date()
  })
  .save();
});

function ensureAuthenticated(req, res, next) {
  console.log('AUTHENTICATED FUNCTION');
  if(req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/');
  }
}

app.listen(port, function(){
  console.log('listening on port...', port);
});
