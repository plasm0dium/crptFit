var express = require('express');
var MatchCheck = express();
var Promise = require('bluebird');
var db = require('../mysql/config');
require('../mysql/collections/swipes');
require('../mysql/models/match');

//On Right Swipe Check if Swiped User has Also Swiped Right on the User
MatchCheck.get('/matchcheck/:id', function (req, res) {
  var swipedId = req.user.attributes.id;
  var userId = req.params.id;
  db.collection('Swipes').fetchBySwiped(userId, swipedId)
  .then(function(exists) {
    if(exists.length === 0) {
      res.json({match: false});
    } else {
      if(exists.models[0].attributes.swiped_right === 1) {
          res.json({match: true});
          db.model('Match').newMatch({
            user_id: swipedId,
            match_id: userId
          })
          .save()
          .then(function () {
          db.model('Match').newMatch({
            user_id: userId,
            match_id: swipedId
            })
            .save();
          });
      } else {
        res.json({match: false});
      }
    }
  });
});

module.exports = MatchCheck;
