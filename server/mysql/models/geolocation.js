var db = require('../config.js');

require('./user');

var Geolocation = db.Model.extend({
  tableName: 'geolocations',
  user: function () {
    return this.belongsTo('User');
  }
}, {
  newLocation: function (options) {
    return new this(options);
  },
  fetchById: function (id) {
    return new this({
      chat_id: id
    }).fetch({withRelated: ['user']});
  }
});

module.exports = db.model('Geolocation', Geolocation);
