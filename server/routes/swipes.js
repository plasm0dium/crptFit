var express = require('express');
var Swipe = express();
var Promise = require('bluebird');
var db = require('../mysql/config');
require('../mysql/collections/swipes');
require('../mysql/models/swipe');

// User Swiped Left on Swiped User
Swipe.post('/leftswipe/:id', function (req,res) {
  var userId = req.user.attributes.id;
  var swipedId = req.params.id;
  db.collection('Swipes').fetchBySwiped(userId, swipedId)
  .then(function(result) {
    db.model('Swipe').updateLeftSwipe(result.models[0].attributes.id);
  });
});

// User Swipes Right on Swiped User
Swipe.post('/rightswipe/:id', function (req,res) {
  var userId = req.user.attributes.id;
  var swipedId = req.params.id;
  db.collection('Swipes').fetchBySwiped(userId, swipedId)
  .then(function(result) {
    db.model('Swipe').updateRightSwipe(result.models[0].attributes.id);
  });
});

module.exports = Swipe;
