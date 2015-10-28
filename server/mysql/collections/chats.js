var db = require('../config');

require('../models/chat');
require('../models/message')

var Chats = db.Collection.extend({
  model: db.model('Chat'),

  messages: function () {
    return this.hasMany('Message')
  }
},
  {
  fetchByUser: function(userId) {
    return db.collection('Chats')
    .forge()
    .query(function(qb) {
      qb.where('id', '=', userId);
    })
    .fetch({withRelated: ['user', 'messages']});
  },
  fetchAll: function () {
    return db.collection('Chats').forge().fetch({withRelated: ['user']});
  }
});

module.exports = db.collection('Chats', Chats);
