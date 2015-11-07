var express = require('express');
var Posttask = express();
var Promise = require('bluebird');
var db = require('../mysql/config');
require('../mysql/models/task');

// Add a New Task to User
Posttask.post('/tasks/:taskname', function (req, res) {
  var task = req.params.taskname;
  db.model('Task').newTask({
    description: task,
    complete: false,
    user_id: req.user.attributes.id
  })
  .save()
  .then(function(task) {
    return task;
  })
  .catch(function (err) {
  });
});

// Update User's Task to Complete
Posttask.post('/task/complete/:id', function(req, res) {
  var taskId = req.params.id;
  db.model('Task').completeTask(taskId)
  .then(function () {
  })
  .catch(function (err) {
    return err;
  });
});

module.exports = Posttask;
