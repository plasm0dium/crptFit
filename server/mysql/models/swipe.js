var db = require('../config.js');

require('./user');

var Swipe = db.Model.extend({
  tableName: 'swipes',
  user: function () {
    return this.belongsTo('User');
  }
}, {
  newSwipe: function (options) {
    return new this(options);
  },
  updateRightSwipe: function (id) {
    return new this({
      id: id
    }).save({
      swiped: true,
      swiped_left: false,
      swiped_right: true
    }, {patch: true})
  },
  updateLeftSwipe: function (id) {
    return new this({
      id: id
    }).save({
      swiped: true,
      swiped_left: true,
      swiped_right: false
    }, {patch: true})
  },

  fetchById: function (id) {
    return new this({
      id: id
    }).fetch({withRelated: ['user']})
  }
})

module.exports = db.model('Swipe', Swipe);
