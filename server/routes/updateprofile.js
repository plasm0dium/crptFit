var express = require('express');
var Update = express();
var db = require('../mysql/config');
require('../mysql/models/user');

Update.post('/updateprofile', function(req, res) {
  var userId = req.user.attributes.id;
  var newProfile = req.body.profile;
  db.model('User').updateProfile(userId, newProfile);
});

module.exports = Update;
