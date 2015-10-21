var db = require('../config');

require('../models/trainer');

var Trainers = db.Collection.extend({
  model: db.model('Trainer')
}, {
  fetchByUser: function(userId) {
    return db.collection('Trainers')
    .forge()
    .query(function(qb) {
      qb.where('user_id', '=', userId);
    })
    .fetch();
  },
  fetchAll: function () {
    return db.collection('Trainers').forge().fetch({withRelated: ['user']})
  }
})

module.exports = db.collection('Trainers', Trainers);
