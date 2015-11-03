var db = require('../config.js');

require('./task');
require('./client');
require('./friend');
require('./trainer');
require('./client_request');
require('./benchpress');
require('./chat');
require('./friend_request');
require('./weight');
require('./squat');
require('./deadlift');
require('./speed');
require('./chatstore');
require('./geolocation');

var User = db.Model.extend({
  //User Properties
  tableName: 'users',
  hasTimestamps: true,
  tasks: function () {
    return this.hasMany('Task');
  },
  clients: function () {
    return this.hasMany('Client');
  },
  friends: function () {
    return this.hasMany('Friend');
  },
  trainers: function() {
    return this.hasMany('Trainer');
  },
  weights: function() {
    return this.hasMany('Weight');
  },
  benchpresses: function() {
    return this.hasMany('Benchpress');
  },
  deadlifts: function() {
    return this.hasMany('DeadLift');
  },
  squats: function() {
    return this.hasMany('Squat');
  },
  speeds: function() {
    return this.hasMany('Speed');
  },
  chatstores: function(){
    return this.hasMany('Chatstore');
  },
  geolocations: function() {
    return this.hasMany('Geolocation');
  },
  friendrequests: function() {
    return this.hasMany('friendRequest');
  },
  clientrequests: function() {
    return this.hasMany('clientRequest');
  }
}, {
  //User Class Methods
fetchById: function(options) {
  return new this(options).fetch({withRelated: ['tasks', 'clients', 'friends', 'trainers', 'weights', 'benchpresses', 'deadlifts', 'speeds', 'squats', 'chatstores', 'geolocations', 'friendrequests', 'clientrequests']});
  },
fetchByUsername: function (username) {
  return this({
    username: username,
  }).fetch({withRelated: ['tasks', 'clients', 'friends', 'trainers', 'weights', 'benchpresses', 'deadlifts', 'speeds', 'squats', 'chatstores', 'geolocations', 'friendrequests', 'clientrequests']});
},
fetchByName: function (name) {
  return this({
    name: name
  }).fetch({withRelated: ['tasks', 'clients', 'friends', 'trainers', 'weights', 'benchpresses', 'deadlifts', 'speeds', 'squats', 'chatstores', 'geolocations', 'friendrequests', 'clientrequests']});
  },
newUser: function (options) {
  return new this(options);
  }
});

module.exports = db.model('User', User);
