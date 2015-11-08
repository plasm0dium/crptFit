var express = require('express');
var Facebook = express();
var passport = require('passport');

// Facebook Auth Callback
Facebook.get('/facebook/callback', function (req, res, next) {
  passport.authenticate('facebook',
    function(err, user, info) {
      if (err) { return next(err); }
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        res.redirect( '/#/dash' );
      });
    })(req, res, next);
});

// Direct to Facebook Login and extract information
Facebook.get('/facebook', passport.authenticate('facebook', {
    scope: ['public_profile', 'email', 'user_friends', 'user_birthday']
 }));

module.exports = Facebook;
