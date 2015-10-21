var db = require('../config.js');

require('./user');

var Task = db.Model.extend({
  tableName: 'tasks',
  hasTimeStamp: true,
  user: function () {
    return this.belongsTo('User');
  },
}, {
  completeTask: function (id) {
    return new this({
      id: id
      })
      .save({complete: true}, {patch: true})
  },
  newTask: function (options) {
    return new this(options);
  },
  fetchById: function (id) {
    return new this({
      id: id
    }).fetch({withRelated: ['user']})
  }
})

module.exports = db.model('Task', Task);
