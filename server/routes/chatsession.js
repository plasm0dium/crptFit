var express = require('express');
var Chatsession = express();
var Promise = require('bluebird');
var db = require('../mysql/config');
require('../mysql/models/user');

// Fetch a User's Chat Sessions
Chatsession.get('/chatsessions', function(req, res) {
var userId = req.user.attributes.id;
  db.model('User').fetchById({
    id: userId
    })
    .then(function(result) {
      return Promise.all(result.relations.chatstores.models.map(function(msg){
        console.log("WHAT ARE THESE MESSAGES", msg);
        return db.model('Chat').fetchById(msg.attributes.chat_id);
      }))
      .then(function (results){
        res.json(results);
      });
    });
  });

module.exports = Chatsession;
