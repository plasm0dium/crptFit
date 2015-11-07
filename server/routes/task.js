var express = require('express');
var Task = express();
var db = require('../mysql/config');
var Promise = require('bluebird');
require('../mysql/collections/tasks');
require('../mysql/models/user');

// Get All User's Tasks
Task.get('/tasks', function (req,res) {
  db.collection('Tasks').fetchByUser(req.user.attributes.id)
  .then(function(tasks) {
    res.json(tasks.toJSON());
  });
});

// Get current user's completed Tasks
Task.get('/usertask/:id', function (req, res){
var userId = req.user.attributes.id;
  db.model('User').fetchById({
    id: userId
  })
  .then(function(user){
    return Promise.all(user.relations.tasks.models.map(function(tasks){
          if(tasks.attributes.complete === 1){
            return tasks;
          }
      }))
    .then(function(results){
      res.json(results);
    });
  });
});

module.exports = Task;
