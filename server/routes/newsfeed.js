var express = require('express');
var Newsfeed = express();
var Promise = require('bluebird');
var db = require('../mysql/config');
require('../mysql/collections/friends');
require('../mysql/models/user');

// NewsFeed Pulls Latest Completed Tasks of Friends
var taskStore = [];
Newsfeed.get('/newsfeed', function (req, res) {
  db.collection('Friends').fetchByUser(req.user.attributes.id)
  .then(function(users) {
      return Promise.all(users.models.map(function(friend) {
         return db.model('User').fetchById({
          id: friend.attributes.friends_id
        });
      }));
    })
      .then(function(friendTasks){
        res.json(friendTasks);
        return Promise.all(friendTasks.map(function(model) {
            model.relations.tasks.models.forEach(function(task){
              if (task.attributes.complete === 1){
                taskStore.push(task);
              }
            });
         }));
      })
      .then(function(){
        res.json(taskStore);
      })
      .then(function(){
        taskStore = [];
      });
});

module.exports = Newsfeed;
