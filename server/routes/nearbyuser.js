var express = require('express');
var Nearbyuser = express();
var db = require('../mysql/config');
require('../mysql/models/user');
require('../mysql/collections/geolocations');
require('../mysql/models/swipe');
var geodist = require('geodist');
var Promise = require('bluebird');

//Fetch Nearest Users to Logged in User
Nearbyuser.get('/nearbyusers', function (req, res) {
  var inputLat = req.user.relations.geolocations.models[0].attributes.lat;
  var inputLng = req.user.relations.geolocations.models[0].attributes.lng;
  var userId = req.user.attributes.id;
  db.collection('Geolocations').fetchAll()
  .then(function(results) {
    //Find all user's with a 25 mile radius
    return Promise.all(results.models.filter(function(model){
      var users_lat = model.attributes.lat;
      var users_lng = model.attributes.lng;
      if(geodist({lat: inputLat, lon: inputLng },{lat: users_lat, lon: users_lng}) < 25 && model.attributes.user_id !== userId) {
        return model;
      }
    }))
    //Map the nearby users objects
    .then(function(nearestUsers){
      return Promise.all(nearestUsers.map(function(user) {
        return db.model('User').fetchById({
          id: user.attributes.user_id
        });
      }))
        //Check if the nearby users are already in the Swipes table
        //only return those who havent previously been swiped
      .then(function(users) {
        return Promise.all(users.map(function(user) {
          var userId = req.user.attributes.id;
          var swipedId = user.attributes.id;
          return Promise.all(db.collection('Swipes').fetchBySwiped(userId, swipedId)
          .then(function(result) {
            if(result.length === 0) {
              //if they don't exist in user's swipes save them first & return them
              db.model('Swipe').newSwipe({
                user_id: req.user.attributes.id,
                swiped_id: user.attributes.id,
                swiped: false,
                swiped_left: false,
                swiped_right: false
              })
              .save();
              return [user];
            } else {
              return Promise.all(result.models.map(function(existingUser) {
                if(existingUser.attributes.swiped === 0) {
                  return user;
                }
              }));
              }
        //if no users are found nearby then user[0] will be undefined
      }));
          }))
          .then(function(result) {
            return Promise.all(result.filter(function (user) {
              return user[0] !== undefined;
            }))
            .then(function (finalResult) {
              if(finalResult.length === 0) {
              res.json({nearbyUsers: 'None'});
              return;
            } else {
              res.json(finalResult);
            }
          });
        });
      });
    });
  });
});

module.exports = Nearbyuser;
