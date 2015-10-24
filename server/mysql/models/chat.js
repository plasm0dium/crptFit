var db = require('../config.js');

require('./user');

var Chat = db.Model.extend({
  tableName: 'chats',
  hasTimeStamp: true,
  user: function () {
    return this.belongsTo('User');
  },
}, {
  newChat: function (options) {
    return new this(options);
  },
  fetchById: function (id) {
    return new this({
      id: id
    }).fetch({withRelated: ['user']})
  }
})

module.exports = db.model('Chat', Chat);
