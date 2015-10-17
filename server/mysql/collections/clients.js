var db = require('..config');

require('./mysql/models/client');

var Clients = db.collection('Clients').extend({
  model: db.model('Client')
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
