var db = require('../config');

require('../models/friend');

var Friends = db.Collection.extend({
  model: db.model('Friend')
}, {
  fetchByUser: function(userId) {
    return db.collection('Friends')
    .forge()
    .query(function(qb) {
      qb.where('user_id', '=', userId);
    })
    .fetch();
  },
  fetchAll: function () {
    return db.collection('Friends').forge().fetch({withRelated: ['user']});
  }
});

module.exports = db.collection('Friends', Friends);
