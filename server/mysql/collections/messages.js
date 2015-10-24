var db = require('../config');

require('../models/message');

var Messages = db.Collection.extend({
  model: db.model('Message')
}, {
  fetchByChat: function(chatId) {
    return db.collection('Messages')
    .forge()
    .query(function(qb) {
      qb.where('chat_id', '=', chatId);
    })
    .fetch();
  },
  fetchAll: function () {
    return db.collection('Messages').forge().fetch({withRelated: ['chat']});
  }
});

module.exports = db.collection('Messages', Messages);
