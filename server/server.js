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

app.get('/auth/facebook',
  passport.authenticate('facebook', {

    scope: ['public_profile', 'email', 'user_friends', 'user_birthday'],

 }));

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



app.get('/#/tab/homepage', ensureAuthenticated, function (req,res) {
  console.log('GET REQ AUTHENTICATED', req.user)
  res.redirect('/#/tab/homepage');
  res.session
  res.json(req.user);
})


app.get('/logout', function(req, res){
  console.log('LOGOUT REQ.USER', req.user.attributes)
  req.session.destroy();
  req.logout();
  res.send('200');
});

app.get('/auth/tasks', function (req,res) {
  db.collection('Tasks').fetchByUser(req.user.attributes.id)
  .then(function(tasks) {
    console.log('THIS IS A TASK :', tasks);
    res.json(tasks.toJSON());
  });
});

app.get('/auth/friends', function (req, res) {
  db.collection('Friends').fetchByUser(req.user.attributes.id)
  .then(function(friends) {
    console.log('THESE ARE USER FRIENDS: ', friends)
    res.json(friends.toJSON());
  });
});

app.get('/auth/stats', function (req, res) {
  db.collection('Stats').fetchByUser(req.user.attributes.id)
  .then(function(stats) {
    console.log('THESE ARE USER STATS: ', stats);
    res.json(stats.toJSON());
  });
});

app.get('/auth/clients', function (req, res) {
  db.collection('Clients').fetchByUser(req.user.attributes.id)
  .then(function(clients) {
    console.log('THESE ARE USER CLIENTS :', clients);
    res.json(stats.toJSON());
  });
});

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
  }).catch(function (err) {
    console.log('ERR IN POST /auth/tasks : ', err)
  });
});
//Search for Friends
app.get('auth/friends:id', function (req, res) {

});


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