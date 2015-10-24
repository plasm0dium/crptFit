var db = require('../config.js');

require('./user');

var Task = db.Model.extend({
  tableName: 'tasks',
  hasTimeStamps: true,
  user: function () {
    return this.belongsTo('User');
  },
}, {
  completeTask: function (id) {
    return new this({
      id: id
      })
      .fetch()
      .then(function (result) {
        result.save({
          complete: true,
          updated_at: new Date()
        }, {patch: true});
      })
      .then(function(update) {
        return update;
      });
  },
  newTask: function (options) {
    return new this(options);
  },
  fetchById: function (id) {
    return new this({
      id: id
    }).fetch({withRelated: ['user']});
  }
});

module.exports = db.model('Task', Task);
