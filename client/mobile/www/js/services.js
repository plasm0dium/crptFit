angular.module('crptFit.services', [])
// Start of Logged in User Factory ====================================================
.factory('User', ['$http', '$q', function($http, $q){
  var getUserObject = function(){
    return $http({
      method: 'get',
      url: '/auth/user'
    });
  };

  return {
    getUserObject: getUserObject
  };
}])
// Start of Tasks Factory ====================================================
.factory('Tasks', ['$http', function($http){
  var tasks = [];
  return {
    getTaskHolder: function(val){
      tasks.push({description:val});
      return tasks;
    },
    finishTask : function(taskId, task){
      $http({
        method: 'POST',
        url: '/auth/task/complete/' + taskId,
      });
      tasks.splice(tasks.indexOf(task), 1);
    },
    getTasksList: function(){
      tasks = [];
      $http({
        method: 'GET',
        url: '/auth/tasks'
      }).then(function(response){
        response.data.forEach(function(x){
          if(!x.complete){
            tasks.push(x)
          }
        });
      });
      return tasks;
    },
    addTaskToClient : function(uId, val){
      $http({
        method: 'POST',
        url: '/auth/tasks/add'+uId,
        data : {
          taskname: val
        }
      });
    },
    addTaskToSelf: function(val){
      $http({
        method: 'POST',
        url: '/auth/tasks/'+val
      });
    }
  };
}])
// Start of Social Factory ====================================================
.factory('Social', ['$http', function($http){
  // Set up functions for ajax
  var friends = [];
  var matches = [];
  var clients = [];
  var trainers = [];
  var searchResults = [];
  var savedUserID;
  var friendsPendingRequest = [];

  return {
    userViewerSet: function(userID){
      savedUserID = userID;
    },
    getUserID: function(){
      return savedUserID;
    },
    friendsList: function(){
      // Grab friends and store it in the friends array above (refactor - DRY)
      $http({
        method: 'GET',
        url: '/auth/friends'
      })
      .then(function(response){
        friends = response.data;
      }, function(error){
        console.log(error);
      });
      return friends;
    },
    getFriendsLength: function(){
      return friends.length;
    },
    getFriendRequests: function() {
      return $http({
        method: 'GET',
        url: '/auth/friendrequests'
      });
    },
    addFriend: function(friendId){
      // This function needs the proper AJAX request
      $http({
        method: 'POST',
        url: '/auth/friends/add:' + friendId
      });
      this.friendsList();
    },
    matchesList: function () {
      $http({
        method: 'GET',
        url: '/auth/getmatches'
      })
      .then(function(response) {
        matches = response.data
      }, function(error) {
        console.log(error)
      });
      return matches
    },
    clientsList: function(){
      // This function needs the proper AJAX request
      // Grab clients and store them in the clients array above (refactor - DRY)
      $http({
        method: 'GET',
        url: '/auth/clients'
      })
      .then(function(response){
        clients = response.data;
      },function(error){
        console.log(error);
      });
      return clients;
    },
    getClientsLength: function(){
      return clients.length;
    },
    addClient: function(clientId){
      // This function needs the proper AJAX request
      $http({
        method: 'POST',
        url: '/auth/clients/add:' + clientId
      });
      this.clientsList();
    },
    trainersList: function(){
      // This function needs the proper AJAX request
      $http({
        method: 'GET',
        url: '/auth/trainers'
      })
      .then(function(response){
        trainers = response.data;
        console.log("Trainers :", response.data);
      }, function(error){
        console.log(error);
      });
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
    },
    searchResultsList: function(username){
      $http({
        method: 'GET',
        url: '/auth/search/' + username
      })
      .then(function(response){
        console.log("inside of the service calling SRL:", response.data)
        return response.data;
      }).then(function(response){
        console.log("final part of SRL from service:", response);
        searchResults = response;
        return searchResults;
      });
    }
  };
}])

// Start of Messages Factory ====================================================
.factory('Message', ['$http', function($http){
  var messages = {};
  var messageReturn = [];
  var room_ids = {};
  var capChat;
  var friends = [];
  return {
    messageToPage : function(){
      newRet = messageReturn;
      return newRet;
    },
    messageList : function(){
      messageReturn = [];
      for(var key in messages){
        if(messages[key][0] === parseInt(capChat)){
          messageReturn.push([key, messages[key][1], messages[key][2], messages[key][3]]);
        }
      }
    },
    messageUpdate: function(mess){
      messageReturn.push([mess, null, null, null]);
    },
    clearCap: function(){
      return capChat;
    },
    capturedChatID: function(val){
      capChat = val;
    },
    captureMessages: function(){
      return room_ids;
    },
    makeChat: function(userId){
      $http({
        method: 'POST',
        url: '/auth/chat/add'+userId
      });
    },
    getFriends: function(){
      $http({
        method: 'GET',
        url: '/auth/friends'
      })
      .then(function(response){
        console.log(response.data);
        friends = response.data;
      }, function(error){
        console.log(error);
      });
      return friends;
    },
    getMessage : function(){
      //NOTE refactor for time complexity
      //NOTE refactored for more time complexity, but more use, needs backend fix
      $http({
        method: 'GET',
        url: '/auth/chatsessions'
      }).then(function(response){
          response.data.forEach(function(messageParts){
            messageParts.chatstore.forEach(function(session){
              friends.forEach(function(friend){
                if(friend.id === session.user_id){
                  messageParts.message.forEach(function(innerMessage){
                    if(innerMessage.user_id === session.user_id){
                      messages[innerMessage.text] = [messageParts.id, innerMessage.user_id, friend.username, friend.profile_pic];
                    }else{
                      messages[innerMessage.text] = [messageParts.id, innerMessage.user_id, "Me", null]
                    }
                    room_ids[messageParts.id] = [friend.username, messageParts.created_at, friend.profile_pic];
                  });
                }
              });
            });
          });
      }, function(error){
        console.log(error);
      });
    },
    getRoom: function(chatId){
      capChat = chatId;
      $http({
        method: 'GET',
        url: '/auth/chat/get' + chatId
      })
    },
    sendMessage: function(id, val){
      console.log(id);
      $http({
        method: 'POST',
        url: '/auth/messages/add' + id,
        data: {message: val}
      }).then(function(data){
        console.log(data);
      }, function(error){
        console.log(error);
      });
    }
  };
}])
.factory('Progress', ['$http', function($http){
  var strength = [];
  var weight = [];
  var speed = [];
  var bench = [];
  var dead = [];
  var squatHold = [];
  //NOTE Commented out functions in this section are experimental weekly views and are not ready for deploy
  return {
    getStr : function(){
      return strength;
    },
    getBnch : function(){
      return bench;
    },
    getDed : function(){
      return dead;
    },
    getSqu : function(){
      return squatHold;
    },
    getSpd : function(){
      return speed;
    },
    getWgt : function(){
      return weight;
    },
    getSelf : function(){
      return selfUid;
    },
    pushBnch : function(val){
      // if(bench.length < 8){bench.push(val);}else{
      // bench.shift();
      bench.push(val);
      // }
    },
    pushDed : function(val){
      // if(dead.length < 8){dead.push(val);}else{
      // dead.shift();
      dead.push(val);
      // }
    },
    pushSqu : function(val){
      // if(squatHold.length < 8){squatHold.push(val);}else{
      // squatHold.shift();
      squatHold.push(val);
      // }
    },
    pushSpd : function(val){
      // if(speed.length < 8){speed.push(val);}else{
      // speed.shift();
      speed.push(val);
      // }
    },
    pushWgt : function(val){
      // if(weight.length < 8){weight.push(val);}else{
      // weight.shift();
      weight.push(val);
      // }
    },
    postBnch: function(stat){
      $http({
        method: 'POST',
        url: '/auth/bench/'+stat
      });
    },
    postDed: function(stat){
      $http({
        method: 'POST',
        url: '/auth/deadlift/'+stat,
      });
    },
    postSqu: function(stat){
      $http({
        method: 'POST',
        url: '/auth/squat/'+stat,
      });
    },
    postSpd : function(stat){
      $http({
        method: 'POST',
        url: '/auth/speed/'+stat,
      });
    },
    postWgt : function(stat){
      $http({
        method: 'POST',
        url: '/auth/weight/'+stat,
      });
    },
    queryBnch : function(val){
      $http({
        method: 'GET',
        url: '/auth/benchpress/'+val
      }).then(function(response){
        if(bench.length === 0){
          // if(response.data.length <= 8){
            for(var x = 0; x < response.data.length; x++){
              bench.push(response.data[x].benchpress);
            }
          // }else{
          //   bench.push(response.data[response.data.length-1].benchpress);
          // }
        }
      }, function(error){
        console.log('Something went wrong : ', error);
      });
    },
    queryDed : function(uId){
      $http({
        method: 'GET',
        url: '/auth/deadlift/'+uId
      }).then(function(response){
        if(dead.length === 0){
          // if(response.data.length <= 8){
            for(var x = 0; x < response.data.length; x++){
              dead.push(response.data[x].deadlift);
            }
          // }else{
          //   dead.push(response.data[response.data.length-1].deadlift);
          // }
        }
      }, function(error){
        console.log('Something went wrong : ', error);
      });
    },
    querySqu : function(uId){
      $http({
        method: 'GET',
        url: '/auth/squats/'+uId
      }).then(function(response){
        if(squatHold.length === 0){
          // if(response.data.length <= 8){
            for(var x = 0; x < response.data.length; x++){
              squatHold.push(response.data[x].squat);
            }
          // }else{
          //   squatHold.push(response.data[response.data.length-1].squat);
          // }
        }
      }, function(error){
        console.log('Something went wrong : ', error);
      });
    },
    querySpd : function(uId){
      $http({
        method: 'GET',
        url: '/auth/speeds/'+uId
      }).then(function(response){
        if(speed.length === 0){
          // if(response.data.length <= 8){
            for(var x = 0; x < response.data.length; x++){
              speed.push(response.data[x].speed);
            }
        // }else{
        //   for(var i = response.data.length-8; i < response.length; i++){
        //       speed.push(response.data[i].speed);
        //     }
          // }
        }
      }, function(error){
        console.log('Something went wrong : ', error);
      });
    },
    queryWgt : function(uId){
      $http({
        method: 'GET',
        url: '/auth/weight/'+uId
      }).then(function(response){
        if(weight.length === 0){
          // if(response.data.length <= 8){
            for(var x = 0; x < response.data.length; x++){
              weight.push(response.data[x].weight);
            }
        //   }else{
        //     weight.push(response.data[response.data.length-1].weight);
        //   }
        }
      }, function(error){
        console.log('Something went wrong : ', error);
      });
    }
  };
}])

.factory('Finder', ['$http', '$q', '$window', function($http, $q, $window) {
  var nearbyUsers = [];
  var userLat;
  var userLng;
  return {
    returnMyLat: function () {
      return userLat;
    },
    returnMyLng: function () {
      return userLng;
    },
    matchCheck: function (userId) {
      $http({
        method: 'GET',
        url: 'auth/matchcheck' + userId
      }).then(function (response) {

      });
    },
    postUsersLocation: function(latitude, longitude) {
      console.log('SERVICE LAT', latitude);
      console.log('SERVICE LNG', longitude);
      $http({
        method: 'POST',
        url: '/auth/location',
        data : {
          lat: latitude,
          lng: longitude
          }
        });
      },
    onLeftSwipe: function(userId) {
      $http({
        method: 'POST',
        url: 'auth/leftswipe/' + userId,
      });
    },
   onRightSwipe: function(userId) {
     $http({
       method: 'POST',
       url: 'auth/rightswipe/' + userId
     });
    },
    returnNearbyUsers: function () {
      return nearbyUsers;
    },
    getNearbyUsers: function() {
    $http({
      method: 'GET',
      url: '/auth/nearbyusers'
    })
    .then(function(response) {
      nearbyUsers.push(response.data);
    });
  },
    getUsers: function(){
      return nearbyUsers;
    }
};
}]);
