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
  // fetchMessages: function(userId, chatId){
  //   return db.collection('Users')
  //   .forge()
  //   .query(function(qb){
  //     qb.select('*').from('users').leftOuterJoin('chats', 'id', 'chats.user_id', 'chats.user2_id', function(){
  //       this.on('id', '=', 'chats.user_id')
  //       this.on('id', '=', 'chats.user2_id')
  //     })
  //     .leftOuterJoin('messages', 'chats.id', 'chats.user_id', 'chats.user2_id', 'message.chat_id', 'message.user_id', function(){
  //       this.on('')
  //     })
  //   })
  // }
});

module.exports = db.collection('Users', Users);
