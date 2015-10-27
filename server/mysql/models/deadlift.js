var db = require('../config.js');

require('./user');

var DeadLift = db.Model.extend({
  tableName: 'deadlifts',
  user: function () {
    return this.belongsTo('User');
  },
}, {
  newDeadLift: function (options) {
    return new this(options);
  },
  fetchById: function (id) {
    return new this({
      id: id
    }).fetch({withRelated: ['user']});
  }
});

module.exports = db.model('DeadLift', DeadLift);
