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
  chats: function() {
    return this.hasMany('Chat');
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
  }
}, {
  //User Class Methods
fetchById: function(options) {
  return new this(options).fetch({withRelated: ['tasks', 'clients', 'friends', 'chats', 'trainers', 'weights', 'benchpresses', 'deadlifts', 'speeds', 'squats', 'chatstores']});
  },
fetchByUsername: function (username) {
  return this({
    username: username,
  }).fetch({withRelated: ['tasks', 'clients', 'friends', 'chats', 'trainers', 'weights', 'benchpresses', 'deadlifts', 'speeds', 'squats', 'chatstores']});
},
fetchByName: function (name) {
  return this({
    name: name
    }).fetch({withRelated: ['tasks', 'clients', 'friends', 'chats', 'trainers', 'weights', 'benchpresses', 'deadlifts', 'speeds', 'squats', 'chatstores']});
  },
newUser: function (options) {
  return new this(options);
  }
});

module.exports = db.model('User', User);
