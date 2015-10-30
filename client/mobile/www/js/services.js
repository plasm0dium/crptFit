angular.module('crptFit.services', [])
// Start of Logged in User Factory ====================================================
.factory('User', ['$http', '$q', function($http, $q){
  var getUserObject = function(){
    return $http({
      method: 'get',
      url: '/auth/user'
    }).then(function(response){
      return response.data;
    })
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
      tasks.push({description:val})
      return tasks;
    },
    finishTask : function(taskId, task){
      console.log(taskId, task)
      $http({
        method: 'POST',
        url: '/auth/task/complete/' +taskId,
      });
      console.log(task, 'clicked');
      tasks.splice(tasks.indexOf(task), 1);
    },
    getTasksList: function(){
      console.log(tasks, 'this is tasks as soon as its clicked')
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
            console.log("Tasks returned from server:", response.data);
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
  var clients = [];
  var trainers = [];
  var searchResults = [];
  var savedUserID;

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
    sendFriendRequest: function(friend){
      // This function needs the proper AJAX request
    },
    addFriend: function(friendId){
      // This function needs the proper AJAX request
      $http({
        method: 'POST',
        url: '/auth/friends/add:' + friendId
      });
      this.friendsList();
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
        console.log("CLIENTS :", response.data);
      }, function(error){
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
//get user message table from db
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
        if(messages[key] === parseInt(capChat)){
          messageReturn.push(key);
        }
      }
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
        console.log(response.data)
        friends = response.data;
      }, function(error){
        console.log(error);
      });
    },
    getMessage : function(){
      //NOTE refactor for time complexity
      $http({
        method: 'GET',
        url: '/auth/chatsessions'
      }).then(function(response){
        console.log(response, 'response data');
          response.data.forEach(function(y){
            y.chatstore.forEach(function(m){
              // if(m.user_id !== 1){
                friends.forEach(function(friend){
                  if(friend.id === m.user_id){
                    room_ids[y.id] = friend.username;
                    console.log(y.id, friend.username, 'made it to the middle')
                  }
                });
              // }
            });
            y.message.forEach(function(z){
              messages[z.text] = y.id;
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
      }).then(function(response){

      });
    },
    sendMessage: function(id, val){
      messageReturn.push(val);
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
    },
  };
}])
.factory('Progress', ['$http', function($http){
  var strength = [];
  var weight = [];
  var speed = [];
  var bench = [];
  var dead = [];
  var squatHold = [];
  //all functions need integration with db
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
    //all functions below here need to be tested and found working
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
