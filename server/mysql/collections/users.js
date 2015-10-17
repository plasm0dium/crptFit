var db = require('..config');

require('./mysql/models/user');

var Users = db.collection('Users').extend({
  model: db.model('User')
}, {
  fetchAll: function () {
    return db.collection('Users').forge().fetch()
  }
})

module.exports = db.collection('Users', Users);
