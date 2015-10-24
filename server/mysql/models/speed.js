var db = require('../config.js');

require('./user');

var Speed = db.Model.extend({
  tableName: 'speeds',
  hasTimeStamp: true,
  chat: function () {
    return this.belongsTo('User');
  },
}, {
  newSpeed: function (options) {
    return new this(options);
  },
  fetchById: function (id) {
    return new this({
      chat_id: id
    }).fetch({withRelated: ['user']});
  }
});

module.exports = db.model('Speed', Speed);
