var db = require('../config');

require('../models/match');

var Matches = db.Collection.extend({
  model: db.model('Match')
}, {

  fetchByUser: function(userId) {
    return db.collection('Matches')
    .forge()
    .query(function(qb) {
      qb.where('user_id', '=', userId);
    })
    .fetch();
  },
  fetchAll: function () {
    return db.collection('Matches').forge().fetch({withRelated: ['user']});
  }
});

module.exports = db.collection('Matches', Matches);
