var db = require('../config.js');

require('./user');

var Trainer = db.Model.extend({
  tableName: 'trainers',
  hasTimestamps: true,
  user: function () {
    return this.belongsTo('User');
  },
}, {
  newTrainer: function (options) {
    return new this(options);
  },
  fetchById: function (id) {
    return new this({
      id: id
    }).fetch({withRelated: ['user']})
  }
});

module.exports = db.model('Trainer', Trainer);
