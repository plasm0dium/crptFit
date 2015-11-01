var db = require('../config');

require('../models/swipe');

var Swipes = db.Collection.extend({
  model: db.model('Swipe')
}, {
  fetchBySwiped: function(userId, swipedId) {
    return db.collection('Swipes')
    .forge()
    .query(function(qb) {
      qb.where('user_id', '=', userId);
      qb.where('swiped_id', '=', swipedId);
      qb.where('swiped', '=', 0)
    })
    .fetch();
  },
  fetchByUser: function(userId) {
    return db.collection('Swipes')
    .forge()
    .query(function(qb) {
      qb.where('user_id', '=', userId);
    })
    .fetch();
  },
  fetchAll: function () {
    return db.collection('Swipes').forge().fetch({withRelated: ['user']});
  }
});

module.exports = db.collection('Swipes', Swipes);
