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
  friends: function () {
    return this.hasMany('Friend')
  },
  trainers: function() {
    return this.hasMany('Trainer')
  },
  chats: function() {
    return this.hasMany('Chat')
  }
}, {
  //User Class Methods
fetchById: function(options) {
  return new this(options).fetch({withRelated: ['tasks', 'clients', 'stats','friends', 'chats', 'trainers']});
  },
fetchByUsername: function (username) {
  return this({
    username: username,
  }).fetch({withRelated: ['tasks', 'clients', 'stats', 'friends', 'chats', 'trainers']});
},
fetchByName: function (name) {
  return this({
    name: name
    }).fetch({withRelated: ['tasks', 'clients', 'stats', 'friends', 'chats', 'trainers']});
  },
newUser: function (options) {
  return new this(options);
  }
})

module.exports = db.model('User', User);
