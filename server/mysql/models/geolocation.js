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
  updateLocation: function(id,lat,lng) {
    return new this({
      id: id
    })
    .save ({
        lat: lat,
        lng: lng,
        updated_at: new Date()
        }, {patch: true});
    },

  fetchById: function (id) {
    return new this({
      user_id: id
    }).fetch({withRelated: ['user']});
  }
});

module.exports = db.model('Geolocation', Geolocation);
