var express = require('express');
var Friendreq = express();
var Promise = require('bluebird');
var db = require('../mysql/config');
require('../mysql/models/friend_request');

// Send a friend request
Friendreq.post('/friendreq/:id', function (req, res){
  var userId = req.user.attributes.id;
  var friendId = req.params.id;
  db.model('friendRequest').newFriendRequest({
    friend_id: friendId,
    user_id: userId,
    status: 0,
    friend_req: false
  })
  .save()
  .then(function (){
    db.model('friendRequest').newFriendRequest({
      friend_id: userId,
      user_id: friendId,
      status: 0,
      friend_req: true
    })
    .save()
  })
  .catch(function(err){
    return err;
  });
});

module.exports = Friendreq;
