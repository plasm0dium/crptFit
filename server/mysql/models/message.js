var db = require('../config.js');

require('./chatstore');
require('./user');

var Message = db.Model.extend({
  tableName: 'messages',
  user: function () {
    return this.belongsTo('User');
  }
}, {
  newMessage: function (options) {
    return new this(options);
  },
  fetchById: function (id) {
    return new this({
      chat_id: id
    }).fetch({withRelated: ['user']});
  }
});

module.exports = db.model('Message', Message);
