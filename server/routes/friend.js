var express = require('express');
var Friend = express();
var Promise = require('bluebird');
var db = require('../mysql/config');
require('../mysql/collections/friends');
require('../mysql/models/user');

// Fetch Logged in Users Friends
var storage = [];
Friend.get('/friends', function (req, res) {
  db.collection('Friends').fetchByUser(req.user.attributes.id)
  .then(function(friends) {
    var friendsArray = friends.models;
    for(var i = 0; i < friendsArray.length; i++) {
      db.model('User').fetchById({
        id: friendsArray[i].attributes.friends_id
      })
      .then(function(result) {
        storage.push(result);
      })
    }})
      .then(function() {
        return res.json(storage);
      }).then(function () {
        storage = [];
      });
  });

module.exports = Friend;
