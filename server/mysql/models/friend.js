var db = require('../config.js');

require('./user');

var Friend = db.Model.extend({
  tableName: 'friends',
  user: function () {
    return this.belongsTo('User');
  },
  users: function () {
    this.hasMany('User');
  }
}, {
  newFriend: function (options) {
    return new this(options);
  },
  fetchById: function (id) {
    return new this({
      user_id: id
    }).fetch({withRelated: ['user']})
  }
});

module.exports = db.model('Friend', Friend);
