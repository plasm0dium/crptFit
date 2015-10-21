var db = require('../config.js');

require('./user');

var Message = db.Model.extend({
  tableName: 'messages',
  hasTimeStamp: true,
  user: function () {
    return this.belongsTo('User');
  },
}, {
  newFriend: function (options) {
    return new this(options);
  },
  fetchById: function (id) {
    return new this({
      id: id
    }).fetch({withRelated: ['user']})
  }
})

module.exports = db.model('Message', Message);
