var db = require('../config.js');

require('./chat');
require('./user');

var Chatstore = db.Model.extend({
  tableName: 'chatstore',
  hasTimestamps: true,
  user: function () {
    return this.belongsTo('User');
  },
  chat: function() {
    return this.belongsTo('Chat');
  }
}, {
  newChatStore: function (options) {
    return new this(options);
  },
  fetchById: function (id) {
    return new this({
      id: id
    }).fetch({withRelated: ['user', 'chat']});
  }
});

module.exports = db.model('Chatstore', Chatstore);
