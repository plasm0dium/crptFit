var db = require('../config.js');

require('./user');

var Stat = db.Model.extend({
  tableName: 'stats',
  hasTimeStamp: true,
  user: function () {
    return this.belongsTo('User');
  },
}, {
  newStat: function (options) {
    return new this(options);
  },
  fetchById: function (id) {
    return new this({
      id: id
    }).fetch({withRelated: ['user']})
  }
})

module.exports = db.model('Stat', Stat);
