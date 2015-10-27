var db = require('../config.js');

require('./user');

var clientRequest = db.Model.extend({
  tableName: 'client_request',
  user: function () {
    return this.belongsTo('User');
  }
}, {
  newClientRequest: function (options) {
    return new this(options);
  },
  acceptClientRequest: function (options) {
    return new this(options)
    .fetch()
    .then(function(result) {
      console.log('THIS IS IN CLIENT REQUEST', result)
      result.save({status: 1}, {patch: true});
    })
  },
  fetchById: function (id) {
    return new this({
      user_id: id
    }).fetch({withRelated: ['user']})
  }
})

module.exports = db.model('clientRequest', clientRequest);
