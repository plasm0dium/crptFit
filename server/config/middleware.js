var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var app = express();

var routes = require('../routes/index');
var auth = require('../routes/auth');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname + '/../../client/mobile/www'));


app.use(session({secret: "Bcrypt for life"}));

app.use(passport.initialize());
app.use(passport.session());

// place a user into session
passport.serializeUser(function(user, done){
	done(null, user.id);
});

// pull a user out of session
passport.deserializeUser(function(user, done){
	done(null, user.id);
});

passport.use(new GoogleStrategy({
    clientID: '927552591724-9ca3d7s5e8i8j2r26tgcpkr83bfh2c8p.apps.googleusercontent.com',
    clientSecret: '0_MDGzk33aBM4g-wkXUWwHim',
    callbackURL: "http://localhost:8000/"
  },
  function(accessToken, refreshToken, profile, done) {
    	done(null, profile);
    })
);

// app.use('/', routes);
// app.use('/auth', auth);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
