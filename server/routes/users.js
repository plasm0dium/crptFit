var express = require('express');
var User = express();
var db = require('../mysql/config');
require('../mysql/models/user');

// Get a Specific User information by Id
User.get('/user/:id', function (req, res) {
  var userId = req.params.id;
  db.model('User').fetchById({
    id: userId
  })
  .then(function(result) {
    res.json(result.toJSON());
  });
});

module.exports = User;
