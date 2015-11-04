var db = require('../config');

require('../models/user');

var Users = db.Collection.extend({
  model: db.model('User')
}, {
  searchByUsername: function (searchUser) {
    return db.collection('Users')
    .forge()
    .query(function(qb){
      qb.select('username', 'id').from('users').where('username', 'like', '%' + searchUser + '%');
    })
    .fetch();
  },
  fetchAll: function () {
    return db.collection('Users').forge().fetch({withRelated: ['user']});
  }
});

module.exports = db.collection('Users', Users);
