var express = require('express');
var Users = express();
var db = require('../mysql/config');
require('../mysql/models/user');

// Get a Specific User information by Id
Users.get('/user/:id', function (req, res) {
  var userId = req.params.id;
  db.model('User').fetchById({
    id: userId
  })
  .then(function(result) {
    res.json(result.toJSON());
  });
});

module.exports = Users;
