var db = require('./mysql/config');

require('./user');

var Stat = db.Model.extend({
  tableName: 'stats',
  hasTimeStamp: true,
  user: function () {
    return this.belongsTo('User');
  },
}, {
  fetchById: function (id) {
    return new this{
      id: id
    }.fetch({withRelated: ['User']})
  }
}

module.exports = db.model('Stat', Stat);
