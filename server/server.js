var express = require('express');
var db = require('./mysql/config');
var bodyParser = require('body-parser');
var passport = require('passport');

var morgan = require('morgan');
var app = express();
var port = process.env.PORT || 8100;

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

    scope: ['public_profile', 'email', 'user_friends'],
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
})

app.get('/logout', function(req, res){
  console.log('LOGOUT REQ.USER', req.user.attributes)
  req.session.destroy();
  req.logout();
  res.send('200');
});

app.get('/hello', function (req,res) {
  console.log('REQ.USER: ', req.user)
})

app.listen(port, function(){
  console.log('listening on port...', port);
});