var express = require('express');
var Progress = express();
var Promise = require('bluebird');
var db = require('../mysql/config');
require('../mysql/collections/weights');
require('../mysql/collections/Benchpress');
require('../mysql/collections/deadlifts');
require('../mysql/collections/squats');
require('../mysql/collections/speeds');

// Fetch User's Weights
Progress.get('/weight/:id', function (req, res){
  var userId = req.params.id;
  db.collection('Weights').fetchByUser(userId)
  .then(function(user){
    res.json(user.toJSON());
  });
});

// Fetch User's Benchpress
Progress.get('/benchpress/:id', function (req, res){
  var userId = req.params.id;
  db.collection('BenchPress').fetchByUser(userId)
  .then(function(user){
    res.json(user.toJSON());
  });
});

// Fetch User's Deadlifts
Progress.get('/deadlift/:id', function (req, res){
  var userId = req.params.id;
  db.collection('DeadLifts').fetchByUser(userId)
  .then(function(user){
    res.json(user.toJSON());
  });
});

// Fetch User's Squats
Progress.get('/squats/:id', function (req, res){
  var userId = req.params.id;
  db.collection('Squats').fetchByUser(userId)
  .then(function(user){
    res.json(user.toJSON());
  });
});

// Fetch User's Speeds
Progress.get('/speeds/:id', function (req, res){
  var userId = req.params.id;
  db.collection('Speeds').fetchByUser(userId)
  .then(function(user){
    res.json(user.toJSON());
  });
});

module.exports = Progress;
