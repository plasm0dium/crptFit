var express = require('express');
var Search = express();
var Promise = require('bluebird');
var db = require('../mysql/config');
require('../mysql/collections/users');
require('../mysql/models/user');

//Search All Users to Add as Friend
Search.get('/search/:id', function (req, res) {
  var username = req.params.id;
  db.collection('Users').searchByUsername(username)
  .then(function (username) {
    return Promise.all(username.models.map(function(friend){
      return db.model('User').fetchById({
        id: friend.attributes.id
      });
    }))
      .then(function (results){
        return res.json(results);
      });
  });
});


module.exports = Search;
