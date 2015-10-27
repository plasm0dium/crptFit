var db = require('../config.js');

require('./user');
require('./message');

var Chatstore = db.Model.extend({
  tableName: 'chat',
  hasTimestamps: true,
  user: function () {
    return this.belongsTo('User');
  },
  message: function() {
    return this.hasMany('Message');
  }
}, {
  newChatStore: function (options) {
    return new this(options);
  },
  fetchById: function (id) {
    return new this({
      id: id
    }).fetch({withRelated: ['user', 'message']});
  }
});

module.exports = db.model('Chatstore', Chatstore);
