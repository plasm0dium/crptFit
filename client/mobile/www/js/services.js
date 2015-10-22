angular.module('crptFit.services', [])

.factory('Chats', [function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/598205061232103424/3j5HUXMY.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
}])

.factory('Social', ['$http', function($http){
  // Set up functions for ajax 
  var friends = [
    // The data inside of this array will come from a user's friends table
    {username: 'Ricky Walker'},
    {username: 'Ted Ly'},
    {username: 'Ted Ly'},
    {username: 'Ted Ly'}

  ];
  var clients = [
    // The data inside of this array will come from a user's clients table
    {username: 'Barney'}
  ];
  var trainers = [
    // The data inside of this array will coem from a user's trainers table
    {username: 'Chris Castillo'},
    {username: 'Paul Keller'}
  ];
  return {
    friendsList: function(){
      // This function needs the proper AJAX request
      return friends;
    },
    getFriendsLength: function(){
      return friends.length;
    },
    sendFriendRequest: function(friend){
      // This function needs the proper AJAX request
    },
    addFriend: function(friend){
      // This function needs the proper AJAX request
      friends.push(friend);
    },
    clientsList: function(){
      // This function needs the proper AJAX request
      return clients;
    },
    getClientsLength: function(){
      return clients.length;
    },
    addClient: function(client){
      // This function needs the proper AJAX request
      clients.push(client);
    },
    trainersList: function(){
      // This function needs the proper AJAX request
      return trainers;
    },
    getTrainersLength: function(){
      return trainers.length;
    },
    sendTrainerRequest: function(){
      // This function needs the proper AJAX request
    },
    addTrainer: function(trainer){
      // This function needs the proper AJAX request
      trainers.push(trainer);
    }
  };
}])
.factory('Message', [function(){
  var messages = [
    {user: 'John', message:'bich you said we were working out, where are you?'},
    {user: 'Steve', message: 'I will hunt you down if you keep ditching me like this'},
    {user: 'Jane', message: 'HA you can only lift 130? my grandma can do that in her grave!'},
    {user: 'Mom', message: 'Casserole for dinner.. again'},
    {user: 'Ted', message: ':D'}
  ];
  var userCli;
//get user message table from db
  return {
    messageList : function(){
      return messages;
    },
    clickUser : function(){
      $('.userMessage').click(function(){
        for(var i = 0; i < messages.length; i++){
          var use = messages[i];
          if(this.id === use.user){
          console.log(use.message)
            userCli = use.message
          }
        }
      });
    },
    userMess : function(){
      return userCli;
    },
  };
}]);
