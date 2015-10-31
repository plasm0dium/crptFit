var db = require('../config');
var geodist = require('geodist')

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
  fetchNearest: function (distPref, inputLat, inputLng) {
    return db.collection('Geolocations').forge().fetchAll()
  },
  fetchAll: function () {
    return db.collection('Geolocations').forge().fetch({withRelated: ['user']});
  }
});

module.exports = db.collection('Geolocations', Geolocations);
