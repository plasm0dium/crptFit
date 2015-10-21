var db = require('../config.js');

require('./task');
require('./client');
require('./stat');
require('./friend');
require('./trainer');

var User = db.Model.extend({
  //User Properties
  tableName: 'users',
  hasTimeStamp: true,
  tasks: function () {
    this.hasMany('Task')
  },
  clients: function () {
    this.hasMany('Client')
  },
  stats: function () {
    this.hasMany('Stat')
  },
  friend: function () {
    this.hasMany('Friend')
  },
  trainers: function() {
    this.hasMany('Trainer')
  },
  messages: function() {
    this.hasMany('Messages')
  }
}, {
  //User Class Methods
fetchById: function(options) {
  return new this(options).fetch();
  },
fetchByUsername: function (username) {
  return this({
    username: username,
  }).fetch({withRelated: ['tasks', 'clients', 'stats', 'friends']});
},
fetchByName: function (name) {
  return this({
    name: name
    }).fetch({withRelated: ['tasks', 'clients', 'stats', 'friends']});
  },
newUser: function (options) {
  return new this(options);
  }
})

module.exports = db.model('User', User);
