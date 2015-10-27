var db = require('../config.js');

require('./user');
require('./message');

var Chat = db.Model.extend({
  tableName: 'chats',
  user: function () {
    return this.belongsToMany('User');
  },
  message: function() {
    return this.hasMany('Message');
  }
}, {
  newChat: function (options) {
    return new this(options);
  },
  fetchById: function (id) {
    return new this({
      id: id
    }).fetch({withRelated: ['user', 'message']});
  }
});

module.exports = db.model('Chat', Chat);
