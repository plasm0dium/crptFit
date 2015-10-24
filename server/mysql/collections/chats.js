var db = require('../config');

require('../models/chat');

var Clients = db.Collection.extend({
  model: db.model('Chat')
}, {
  fetchByUser: function(userId) {
    return db.collection('Clients')
    .forge()
    .query(function(qb) {
      qb.where('user_id', '=', userId);
    })
    .fetch();
  },
  fetchAll: function () {
    return db.collection('Clients').forge().fetch({withRelated: ['user']})
  }
})

module.exports = db.collection('Clients', Clients);
