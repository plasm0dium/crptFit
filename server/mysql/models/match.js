var db = require('../config.js');

require('./user');

var Match = db.Model.extend({
  tableName: 'matches',
  user: function () {
    return this.belongsTo('User');
  }
}, {
  newMatch: function (options) {
    return new this(options);
  },
  fetchById: function (id) {
    return new this({
      id: id
    }).fetch({withRelated: ['user']})
  }
})

module.exports = db.model('Match', Match);
