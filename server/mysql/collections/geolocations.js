var db = require('../config');

require('../models/geolocation');

var Geolocations = db.Collection.extend({
  model: db.model('Geolocation')
}, {
  fetchByUser: function(userId) {
    return db.collection('Geolocations')
    .forge()
    .query(function(qb) {
      qb.where('user_id', '=', userId);
    })
    .fetch();
  },
  fetchAll: function () {
    return db.collection('Geolocations').forge().fetch({withRelated: ['user']});
  }
});

module.exports = db.collection('Geolocations', Geolocations);
