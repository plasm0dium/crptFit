var db = require('../config');

require('../models/friend');

var Friends = db.Collection.extend({
  model: db.model('Friend')
}, {
  fetchByUser: function(userId, friendId) {
    return db.collection('Friends')
    .forge()
    .query(function(qb) {
      qb.select()
    })
    .fetch();
  },
  fetchAll: function () {
    return db.collection('Friends').forge().fetch({withRelated: ['user']});
  }
});

module.exports = db.collection('Friends', Friends);
