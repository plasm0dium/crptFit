var db = require('../config.js');

require('./user');

var Benchpress = db.Model.extend({
  tableName: 'benchpress',
  hasTimestamps: true,
  user: function () {
    return this.belongsTo('User');
  },
}, {
  newBenchPress: function (options) {
    return new this(options);
  },
  fetchById: function (id) {
    return new this({
      id: id
    }).fetch({withRelated: ['user']});
  }
});

module.exports = db.model('Benchpress', Benchpress);
