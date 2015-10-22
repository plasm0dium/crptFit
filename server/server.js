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

require('./mysql/collections/clients');
require('./mysql/collections/friends');
require('./mysql/collections/stats');
require('./mysql/collections/tasks');
require('./mysql/collections/users');

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
//Direct to Facebook Login
app.get('/auth/facebook',
  passport.authenticate('facebook', {
    scope: ['public_profile', 'email', 'user_friends', 'user_birthday']
 }));

//Facebook Auth Callback
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

//Logout User
app.get('/logout', function(req, res){
  console.log('LOGOUT REQ.USER', req.user.attributes)
  req.session.destroy();
  req.logout();
  res.send('200');
});

//Get All User's Tasks
app.get('/auth/tasks', function (req,res) {
  db.collection('Tasks').fetchByUser(req.user.attributes.id)
  .then(function(tasks) {
    console.log('THIS IS A TASK :', tasks);
    res.json(tasks.toJSON());
  });
});

//Fetch User's Friends
app.get('/auth/friends', function (req, res) {
  var storage = [];
  db.collection('Friends').fetchByUser(req.user.attributes.id)
  .then(function(friends) {
    var friendsArray = friends.models;
    for(var i = 0; i < friendsArray.length; i++ ) {
      var tojson = db.model('User').fetchById({
        id: friendsArray[i].attributes.friends_id
      }).then(function(result) {
        storage.push(result);
      }).then(function() {
        return res.json(storage.toJSON());
      })
    }})
  });

//Search All Users to Add as Friend
app.get('auth/users/search', function (req, res) {
  db.collection('Users').fetchAll()
  .then(function(allFriends) {
    res.json(allFriends.toJSON());
  })
});

// Get Collection of User's Stats
app.get('/auth/stats', function (req, res) {
  db.collection('Stats').fetchByUser(req.user.attributes.id)
  .then(function(stats) {
    console.log('THESE ARE USER STATS: ', stats);
    res.json(stats.toJSON());
  });
});

//Fetch a User's Clients
app.get('/auth/clients', function (req, res) {
  db.collection('Clients').fetchByUser(req.user.attributes.id)
  .then(function(clients) {
    console.log('THESE ARE USER CLIENTS :', clients);
    res.json(stats.toJSON());
  });
});

//Add a New Task to User
app.post('/auth/tasks', function (req, res) {
  //CHECK FRONT END VARIABLE
  var task = req.body.task.name;
  db.model('Task').newTask({
    description: task,
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

//Update User's Task to Complete
app.post('/auth/task/complete:id', function(req, res) {
  var taskId = req.params.id;
  db.model('Task').completeTask(req.user.attributes.id)
  .then(function () {
    console.log('TASK UPDATED TO COMPLETE :', db.model('Task').fetchByUser(req.user.attributes.id));
  })
  .catch(function (err) {
    return err;
  });
});

//Add a Friend to User
app.post('/auth/friends/add:id', function (req, res) {
  var userId = req.user.attributes.id;
  var friendId = req.params.id;
  db.model('Friend').newFriend({
    friends_id: friendId,
    user_id: userId
  })
  .save()
  .then(function() {
    db.model('Friend').newFriend({
      friends_id: userId,
      user_id: friendId
    })
    .save()
  })
  .then(function (newFriend) {
    console.log('ADDED NEW FRIEND', newFriend)
    return newFriend;
  })
  .catch(function (err) {
    return err;
  });
});

//Adds a Client to User
app.post('/auth/clients/add:id', function (req, res) {
  var userId = req.user.attributes.id;
  var clientId = req.params.id;
  db.model('Client').newClient({
    client_id: clientId,
    user_id: userId
  })
  .save()
  .then(function() {
    db.model('Trainer').newTrainer({
      trainer_id: userId,
      user_id: clientId
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

//On Accept Adds Trainer to User
app.post('/auth/trainer/add:id', function (req, res) {
  var userId = req.user.attributes.id;
  var clientId = req.params.id;
  db.model('Trainer').newTrainer({

  })
  .save()
})
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
