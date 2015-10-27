var db = require('../config.js');

require('./chat');

var Message = db.Model.extend({
  tableName: 'messages',
  
  chat: function () {
    return this.belongsTo('Chat');
  },
}, {
  newMessage: function (options) {
    return new this(options);
  },
  fetchById: function (id) {
    return new this({
      chat_id: id
    }).fetch({withRelated: ['chats']});
  }
});

module.exports = db.model('Message', Message);
