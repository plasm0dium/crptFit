var db = require('../config');

require('../models/friend_request');

var friendRequests = db.Collection.extend({
  model: db.model('friendRequest')
}, {
  fetchByUser: function(userId) {
    return db.collection('friendRequests')
    .forge()
    .query(function(qb) {
      qb.where('user_id', '=', userId);
    })
    .fetch();
  },
  fetchAll: function () {
    return db.collection('friendRequests').forge().fetch({withRelated: ['user']});
  }
});

module.exports = db.collection('friendRequests', friendRequests);
