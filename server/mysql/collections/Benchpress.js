var db = require('../config');

require('../models/benchpress');

var BenchPress = db.Collection.extend({
  model: db.model('Benchpress')
}, {
  fetchByUser: function(userId) {
    return db.collection('BenchPress')
    .forge()
    .query(function(qb) {
      qb.where('user_id', '=', userId);
    })
    .fetch();
  },
  fetchAll: function () {
    return db.collection('BenchPress').forge().fetch({withRelated: ['user']});
  }
});

module.exports = db.collection('BenchPress', BenchPress);