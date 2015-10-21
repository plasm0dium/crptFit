var db = require('../config');

require('../models/message');

var Messages = db.Collection.extend({
  model: db.model('Message')
}, {
  fetchByUser: function(userId) {
    return db.collection('Messages')
    .forge()
    .query(function(qb) {
      qb.where('user_id', '=', userId);
    })
    .fetch();
  },
  fetchAll: function () {
    return db.collection('Messages').forge().fetch({withRelated: ['user']})
  }
})

module.exports = db.collection('Messages', Messages);