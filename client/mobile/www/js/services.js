angular.module('crptFit.services', [])

.factory('Social', ['$http', function($http){
  // Set up functions for ajax
  var friends = [
    // The data inside of this array will come from a user's friends table
    {username: 'Ricky Walker'},
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
    addClient: function(client){
      // This function needs the proper AJAX request
      clients.push(client);
    },
    trainersList: function(){
      // This function needs the proper AJAX request
      return trainers;
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
          console.log(use.message);
            userCli = use.message;
          }
        }
      });
    },
    userMess : function(){
      return userCli;
    },
  };
}])
.factory('Progress', ['$http', function($http){
  var strength = [
    //the data in this array will come from a users stats table
     10,
     20,
     30,
     50,
     75
  ];
  var weight = [
    //the data in this array will come from a users stats table
     745,
     600,
     300,
     200,
     190
  ];
  var speed = [
    //the data in this array will come from a users stats table and be modified before entry
    14,19,2,40,3,90
  ];
  //all functions need integration with db 10/22
  return {
    // checkMeStr : function(strong){
    //   console.log(strong, 'clicked');
    //   strength.push(strong);
    // },
    // checkMeSpd : function(timeSpd, distance){
    //   console.log(timeSpd, distance);
    //   speed.push((distance/timeSpd)*60);
    // },
    // checkMeWgt : function(weigh){
    //   console.log(weigh, 'clicked');
    //   weight.push(weigh);
    // },
    getStr : function(){
      return strength;
    },
    getSpd : function(){
      return speed;
    },
    getWgt : function(){
      return weight;
    },
    //all functions below here need to be tested and found working 10/22
    postStr : function(val){
      $http({
        method: 'POST',
        url: '/auth/stats',
        data: val
      }).then(function(data){
        console.log(data);
        queryStr();
      });
    },
    postSpd : function(val){
      //this function needs the proper AJAX request
      $http({
        method: 'POST',
        url: '/auth/stats',
        data: val
      }).then(function(data){
        console.log(data);
        querySpd();
      });
    },
    postWgt : function(val){
      //this function needs the proper AJAX request
      $http({
        method: 'POST',
        url: '/auth/stats',
        data: val
      }).then(function(data){
        console.log(data);
        queryWgt();
      });
    },
    queryStr : function(){
      $http({
        method: 'GET',
        url: '/auth/stats'
      }).then(function(response){
        stat = response.data;
        strength.push(stat);
      }, function(error){
        console.log('Something went wrong : ', error);
      });
    },
    querySpd : function(){
      $http({
        method: 'GET',
        url: '/auth/stats'
      }).then(function(response){
        stat = response.data;
        speed.push(stat);
      }, function(error){
        console.log('Something went wrong : ', error);
      });
    },
    queryWgt : function(){
      $http({
        method: 'GET',
        url: '/auth/stats'
      }).then(function(response){
        stat = response.data;
        weight.push(stat);
      }, function(error){
        console.log('Something went wrong : ', error);
      });
    }
  };
}])
.factory('Utility', ['$http', function($http){

}]);
