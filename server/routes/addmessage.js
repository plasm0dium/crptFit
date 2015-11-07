var express = require('express');
var Addmessage = express();
var Promise = require('bluebird');
var db = require('../mysql/config');
require('../mysql/models/message');

// Add Messages to chat session
Addmessage.post('/messages/add:id', function (req, res){
  var userId = req.user.attributes.id;
  var chatId = req.params.id;
  var body = req.body.message;
  db.model('Message').newMessage({
    user_id: userId,
    chat_id: chatId,
    text: body,
    created_at: new Date()
  })
  .save();
});

module.exports = Addmessage;
