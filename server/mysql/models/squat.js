var db = require('../config.js');

require('./user');

var Squat = db.Model.extend({
  tableName: 'squats',
  hasTimestamps: true,
  user: function () {
    return this.belongsTo('User');
  },
}, {
  newSquat: function (options) {
    return new this(options);
  },
  fetchById: function (id) {
    return new this({
      id: id
    }).fetch({withRelated: ['user']});
  }
});

module.exports = db.model('Squat', Squat);