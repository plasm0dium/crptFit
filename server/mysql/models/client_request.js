var db = require('../config.js');

require('./user');

var clientRequest = db.Model.extend({
  tableName: 'friend_request',
  hasTimeStamp: true,
  user: function () {
    return this.belongsTo('User');
  }
}, {
  newClientRequest: function (options) {
    return new this(options);
  },
  fetchById: function (id) {
    return new this({
      user_id: id
    }).fetch({withRelated: ['user']})
  }
})

module.exports = db.model('clientRequest', clientRequest);
