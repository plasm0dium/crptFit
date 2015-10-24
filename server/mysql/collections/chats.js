var db = require('../config');

require('../models/chat');

var Chats = db.Collection.extend({
  model: db.model('chat')
}, 
  {
  fetchByUser: function(userId) {
    return db.collection('Chats')
    .forge()
    .query(function(qb) {
      qb.where('user_id', '=', userId);
    })
    .fetch();
  },
  fetchAll: function () {
    return db.collection('Chats').forge().fetch({withRelated: ['user']});
  }
});

module.exports = db.collection('Chats', Chats);


