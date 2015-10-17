var db = require('./mysql/config');

require('./task');
require('./client');
require('./stat');
require('./friend');

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
}, {
  //User Class Methods
fetchById: function(id) {
  return new this({
    id: id
    }).fetch();
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
}

module.exports = db.model('User', User);
