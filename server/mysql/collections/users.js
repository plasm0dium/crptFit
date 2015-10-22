var db = require('../config');

require('../models/user');

var Users = db.Collection.extend({
  model: db.model('User')
}, {
  fetchAll: function () {
    return db.collection('Users').forge().fetch({withRelated: ['tasks']})
  }
})

module.exports = db.collection('Users', Users);
