var db = require('./mysql/config');

require('./user');

var Friend = db.Model.extend({
  tableName: 'friends',
  hasTimeStamp: true,
  user: function () {
    return this.belongsTo('User');
  },
}, {
  newFriend: function (options) {
    return new this(options);
  },
  fetchById: function (id) {
    return new this{
      id: id
    }.fetch({withRelated: ['User']})
  }
}

module.exports = db.model('Friend', Friend);
