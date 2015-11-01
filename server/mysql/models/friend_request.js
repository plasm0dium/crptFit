var db = require('../config.js');

require('./user');

var friendRequest = db.Model.extend({
  tableName: 'friend_request',
  user: function () {
    return this.belongsTo('User');
  }
}, {
  newFriendRequest: function (options) {
    return new this(options);
  },
  acceptFriendRequest: function (options) {
    return new this(options)
    .fetch()
    .then(function(result) {
      result.save({status: 1
    }, {patch: true});
    })
    .then(function (update) {
      console.log(update);
      return update;
    })
  },
  fetchById: function (id) {
    return new this({
      user_id: id
    }).fetch({withRelated: ['user']})
  }
})

module.exports = db.model('friendRequest', friendRequest);
