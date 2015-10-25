var db = require('../config');

require('../models/weight');

var Weights = db.Collection.extend({
  model: db.model('Weight')
}, {
  fetchByUser: function(userId) {
    return db.collection('Weights')
    .forge()
    .query(function(qb) {
      qb.where('user_id', '=', userId);
    })
    .fetch();
  },
  fetchAll: function () {
    return db.collection('Weights').forge().fetch({withRelated: ['user']});
  }
});

module.exports = db.collection('Weights', Weights);
