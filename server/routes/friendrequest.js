var express = require('express');
var Friendrequest = express();
var Promise = require('bluebird');
var db = require('../mysql/config');
require('../mysql/collections/friend_requests');
require('../mysql/models/user');

//Notifications for Pending Friend Requests
Friendrequest.get('/friendrequests/', function (req, res) {
  var userId = req.user.attributes.id;
  db.collection('friendRequests').fetchByUser(userId)
  .then(function(friendRequests) {
    return Promise.all(friendRequests.models.map(function(friends) {
      if(friends.attributes.status === 0 && friends.attributes.friend_req === 1) {
        return db.model('User').fetchById({
          id: friends.attributes.friend_id
        });
      }
    })).then(function(result) {
      res.json(result);
    });
  });
});

module.exports = Friendrequest;
