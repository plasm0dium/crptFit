var db = require('../config');

require('../models/client_request');

var clientRequests = db.Collection.extend({
  model: db.model('clientRequest')
}, {
  fetchByUser: function(userId) {
    return db.collection('clientRequests')
    .forge()
    .query(function(qb) {
      qb.where('user_id', '=', userId);
    })
    .fetch();
  },
  fetchAll: function () {
    return db.collection('clientRequests').forge().fetch({withRelated: ['user']})
  }
})

module.exports = db.collection('clientRequests', clientRequests);
