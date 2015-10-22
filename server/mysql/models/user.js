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
    return this.hasMany('Task')
  },
  clients: function () {
    return this.hasMany('Client')
  },
  stats: function () {
    return this.hasMany('Stat')
  },
  friend: function () {
    return this.hasMany('Friend')
  },
  trainers: function() {
    return this.hasMany('Trainer')
  },
  messages: function() {
    return this.hasMany('Messages')
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
