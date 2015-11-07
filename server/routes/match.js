var express = require('express');
var Match = express();
var Promise = require('bluebird');
var db = require('../mysql/config');
require('../mysql/models/user');
require('../mysql/collections/matches');

//Fetches a User's Matches
Match.get('/getmatches', function (req, res) {
  var userId = req.user.attributes.id;
  db.collection('Matches').fetchByUser(userId)
  .then(function(results) {
    if(results.length === 0) {
      res.json({matches: 'None'});
    } else {
      return Promise.all(results.models.map(function(match) {
        return db.model('User').fetchById({
          id: match.attributes.match_id
        });
      }))
      .then(function(userObjects) {
        res.json(userObjects);
      });
    }
  });
});

module.exports = Match;
