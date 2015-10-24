var db = require('../config.js');

require('./user');

var Weight = db.Model.extend({
  tableName: 'weights',
  hasTimeStamp: true,
  user: function () {
    return this.belongsTo('User');
  },
}, {
  newWeight: function (options) {
    return new this(options);
  },
  fetchById: function (id) {
    return new this({
      id: id
    }).fetch({withRelated: ['user']});
  }
});

module.exports = db.model('Weight', Weight);
