var express = require('express');
var Location = express();
var Promise = require('bluebird');
var db = require('../mysql/config');
require('../mysql/collections/geolocations');
require('../mysql/models/geolocation');

// Store User's Current Location or Update if it Exists
Location.post('/location', function (req, res) {
  var userId = req.user.attributes.id;
  var lat = req.body.lat;
  var lng = req.body.lng;
  db.collection('Geolocations').fetchByUser(userId)
  .then(function(location) {
    if(location.length === 0) {
      return db.model('Geolocation').newLocation({
        lat: lat,
        lng: lng,
        user_id: userId
      })
      .save();
    } else {
      var locationId = req.user.relations.geolocations.models[0].attributes.id;
      return db.model('Geolocation').updateLocation(locationId,lat, lng);
    }
  });
});

module.exports = Location;
