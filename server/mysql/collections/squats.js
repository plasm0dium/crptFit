var db = require('../config');

require('../models/squat');

var Squats = db.Collection.extend({
  model: db.model('Squat')
}, {
  fetchByUser: function(userId) {
    return db.collection('Squats')
    .forge()
    .query(function(qb) {
      qb.where('user_id', '=', userId);
    })
    .fetch();
  },
  fetchAll: function () {
    return db.collection('Squats').forge().fetch({withRelated: ['user']});
  }
});

module.exports = db.collection('Squats', Squats);
