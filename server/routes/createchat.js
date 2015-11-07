var express = require('express');
var Createchat = express();
var Promise = require('bluebird');
var db = require('../mysql/config');
require('../mysql/models/chat');
require('../mysql/models/chatstore');

// Creates a Chat Session
Createchat.post('/chat/add:id', function (req, res){
  var chatId;
  var userId1 = req.user.attributes.id;
  var userId2 = req.params.id;
  db.model('Chat').newChat({
      created_at: new Date()
    })
    .save()
    .then(function(result){
      chatId = result.id;
      db.model('Chatstore').newChatStore({
        chat_id: result.id,
        user_id: userId1,
        created_at: new Date()
      })
    .save();
    })
    .then(function(){
      db.model('Chatstore').newChatStore({
        chat_id: chatId,
        user_id: userId2,
        created_at: new Date()
      })
      .save();
    })
    .then(function(){
     db.model('Message').newMessage({
       user_id: userId1,
       chat_id: chatId,
       text: "New Chatroom!",
       created_at: new Date()
     })
     .save();
    });
});

module.exports = Createchat;
