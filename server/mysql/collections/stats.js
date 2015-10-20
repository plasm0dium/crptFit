var db = require('..config');

require('../models/stat');

var Stats = db.Collection.extend({
  model: db.model('Stat')
}, {
  fetchByUser: function(userId) {
    return db.collection('Stats')
    .forge()
    .query(function(qb) {
      qb.where('user_id', '=', userId);
    })
    .fetch();
  },
  fetchAll: function () {
    return db.collection('Stats').forge().fetch({withRelated: ['user']})
  }
})

module.exports = db.collection('Stats', Stats);
