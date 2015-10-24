var express = require('express');
var db = require('./mysql/config');
var bodyParser = require('body-parser');
var passport = require('passport');
var morgan = require('morgan');
var app = express();
var port = process.env.PORT || 8100;

require('./mysql/models/client');
require('./mysql/models/friend');
require('./mysql/models/stat');
require('./mysql/models/task');
require('./mysql/models/user');
require('./mysql/models/friend_request');
require('./mysql/models/client_request');
require('./mysql/models/chat');
require('./mysql/models/message');

require('./mysql/collections/clients');
require('./mysql/collections/friends');
require('./mysql/collections/stats');
require('./mysql/collections/tasks');
require('./mysql/collections/users');
require('./mysql/collections/friend_requests');
require('./mysql/collections/client_requests');
require('./mysql/collections/chats');
require('./mysql/collections/messages');

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
        console.log('USER LOGGED IN: ', req.user);
        res.redirect( '/#/tab/homepage' );
      });
    })(req, res, next);
});


app.get('/tab/homepage', ensureAuthenticated, function (req,res) {
  console.log('GET REQ AUTHENTICATED', req.user)
  res.redirect('/#/tab/homepage');
  res.json(req.user);
})

// Logout User
app.get('/logout', function(req, res){
  console.log('LOGOUT REQ.USER', req.user.attributes)
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

// Fetch User's Friends

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
        console.log('RES>JSON :', storage)
        return res.json(storage);
      }).then(function () {
        storage = [];
      })
  });

//Search All Users to Add as Friend
app.get('auth/users/search', function (req, res) {
  db.collection('Users').fetchAll()
  .then(function(allFriends) {
    res.json(allFriends.toJSON());
  })
});

// Get Collection of User's Stats
app.get('/auth/stats', ensureAuthenticated, function (req, res) {
  db.collection('Stats').fetchByUser(req.user.attributes.id)
  .then(function(stats) {
    console.log('THESE ARE USER STATS: ', stats);
    res.json(stats.toJSON());
  });
});

// Fetch a User's Clients
app.get('/auth/clients', ensureAuthenticated,function (req, res) {
  db.collection('Clients').fetchByUser(req.user.attributes.id)
  .then(function(clients) {
    console.log('THESE ARE USER CLIENTS :', clients);
    res.json(clients.toJSON());
  });
});

// Fetch Chatroom
app.get('/auth/chat/get:id', function (req, res){
  var chatId = req.params.id;
  db.model('Chat').fetchById(chatId)
  .then(function(chat) {
    console.log('THIS IS CHAT ROOM :', chat);
    res.json(chat.toJSON());
  })
})

db.model('Chat').fetchById(2)
  .then(function(chat) {
    console.log('THIS IS CHAT ROOM :', chat);
    console.log('THIS IS RELATION USER:', chat.relations.user.attributes)
    console.log('THIS IS RELATION MESSAGE:', chat.relations.messages.attributes)
})

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
  db.model('Task').completeTask(req.user.attributes.id)
  .then(function () {
    console.log('TASK UPDATED TO COMPLETE :', db.model('Task').fetchByUser(req.user.attributes.id));
  })
  .catch(function (err) {
    return err;
  });
});

// Adds a Client to User
app.post('/auth/confirmclient', function (req, res) {
  var userId = req.user.attributes.id;
  var clientId = req.params.id;
   db.model('clientRequest').acceptClientRequest({
    user_id: userId,
    client_id: clientId
  })
  .then(function () {
    db.model('clientRequest').acceptClientRequest({
      user_id: clientId,
      client_id: userId
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

app.post('/auth/clientreq/add:id', function (req, res){
  var userId = req.user.attributes.id;
  var clientId = req.params.id;
  db.model('clientRequest').newClientRequest({
    client_id: clientId,
    user_id: userId,
    status: 0
  })
  .save()
  .then(function () {
    db.model('clientRequest').newClientRequest({
      client_id: userId,
      user_id: clientId,
      status: 0
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
    status: 0
  })
  .save()
  .then(function (){
    db.model('friendRequest').newFriendRequest({
      friend_id: userId,
      user_id: friendId,
      status: 0
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
    friend_id: friendId  

  })
  .then(function () {
    db.model('friendRequest').acceptFriendRequest({
      user_id: friendId,
      friend_id: userId
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

app.post('/auth/chat/add:id', function (req, res){
  var userId1 = req.user.attributes.id;
  var userId2 = req.params.id;
  db.model('Chat').newChat({
    user_id: userId1,
    user2_id: userId2
  })
  .save()
  .then(function(){
    db.model('Chat').newChat({
      user_id: userId2,
      user2_id: userId1
    })
    .save()
  })
});

app.post('/auth/messages/add:id', function (req, res){
  var userId = req.user.attributes.id;
  var chatId = req.params.id;
  db.model('Message').newMessage({
    user_id: userId,
    chat_id: chatId
  })
  .save()
})

// db.model('Message').newMessage({
//     user_id: 1234,
//     chat_id: 2,
//     text: 'Chris hate me!'
//   })
//   .save()

function ensureAuthenticated(req, res, next) {
  console.log('AUTHENTICATED FUNCTION')
  if(req.isAuthenticated()) {
    return next()
  } else {
    res.redirect('/')
  }
}

app.listen(port, function(){
  console.log('listening on port...', port);
});
