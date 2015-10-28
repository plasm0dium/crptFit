var db = require('../config.js');

require('./chatstore');
require('./message');

var Chat = db.Model.extend({
    tableName: 'chat',

  user: function () {
    return this.belongsTo('User');
  },
  chatstore: function () {
    return this.hasMany('Chatstore');

  },
  message: function () {
    return this.hasMany('Message')
  }
}, {
  newChat: function (options) {
    return new this(options);
  },
  fetchById: function (id) {
    return new this({
      id: id
    }).fetch({withRelated: ['chatstore', 'message']});
  }
});

module.exports = db.model('Chat', Chat);
