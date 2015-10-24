var db = require('../config');

require('../models/deadlift');

var DeadLifts = db.Collection.extend({
  model: db.model('DeadLift')
}, {
  fetchByUser: function(userId) {
    return db.collection('DeadLifts')
    .forge()
    .query(function(qb) {
      qb.where('user_id', '=', userId);
    })
    .fetch();
  },
  fetchAll: function () {
    return db.collection('DeadLifts').forge().fetch({withRelated: ['user']});
  }
});

module.exports = db.collection('DeadLifts', DeadLifts);