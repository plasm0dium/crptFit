var db = require('../config');

require('../models/user');

var Users = db.Collection.extend({
  model: db.model('User')
}, {
  searchByUsername: function (searchUser) {
    // var selectRaw = "SELECT * FROM users WHERE username LIKE '%' " + searchUser + " '%' ";
    return db.collection('Users')
    .forge()
    .query(function(qb){
      // qb.column('username').select().from('users').where('')
      qb.select('username', 'id').from('users').where('username', 'like', '%' + searchUser + '%')
    })
    .fetch();
  },
  fetchAll: function () {
    return db.collection('Users').forge().fetch({withRelated: ['user']});
  }
});

module.exports = db.collection('Users', Users);
