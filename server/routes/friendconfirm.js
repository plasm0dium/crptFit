var express = require('express');
var Confirmfriend = express();
var Promise = require('bluebird');
var db = require('../mysql/config');
require('../mysql/models/friend_request');
require('../mysql/models/friend');

// Confirm friend request and add each other as friend
Confirmfriend.post('/confirmfriend/:id', function (req, res){
  var userId = req.user.attributes.id;
  var friendId = req.params.id;
  db.model('friendRequest').acceptFriendRequest({
    friend_id: friendId,
    user_id: userId
  })
  .then(function () {
    db.model('friendRequest').acceptFriendRequest({
      friend_id: userId,
      user_id: friendId
    });
  })
  .then(function(){
     db.model('Friend').newFriend({
      friends_id: friendId,
      user_id: userId
    })
    .save();
  })
  .then(function() {
    db.model('Friend').newFriend({
      friends_id: userId,
      user_id: friendId
    })
    .save();
  })
  .catch(function(err){
    return err;
  });
});

module.exports = Confirmfriend;
