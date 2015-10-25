var db = require('../config');

require('../models/speed');

var Speeds = db.Collection.extend({
  model: db.model('Speed')
}, {
  fetchByUser: function(userId) {
    return db.collection('Speeds')
    .forge()
    .query(function(qb) {
      qb.where('user_id', '=', userId);
    })
    .fetch();
  },
  fetchAll: function () {
    return db.collection('Speeds').forge().fetch({withRelated: ['user']});
  }
});

module.exports = db.collection('Speeds', Speeds);
