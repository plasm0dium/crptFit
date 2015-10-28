var db = require('../config');

require('../models/chatstore');

var Chatstores = db.Collection.extend({
  model: db.model('Chatstore')
}, 
  {
  fetchByUser: function(userId) {
    return db.collection('Chatstores')
    .forge()
    .query(function(qb) {
      qb.where('user_id', '=', userId);
    })
    .fetch();
  },
  fetchAll: function () {
    return db.collection('Chatstores').forge().fetch({withRelated: ['user']});
  }
});

module.exports = db.collection('Chatstores', Chatstores);


