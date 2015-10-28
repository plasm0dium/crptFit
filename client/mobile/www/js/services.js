angular.module('crptFit.services', [])
// Start of Tasks Factory ====================================================
.factory('Tasks', ['$http', function($http){
  var tasks;
  var setTasks = function(tasksList){
    tasks = tasksList;
  }
  return {
    getTasksList: function(){
      $http({
        method: 'GET',
        url: '/auth/tasks'
      }).then(function(response){
        setTasks(response.data);
        console.log("Tasks returned from server:", response.data);
      })
      return tasks;
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
        console.log(response.data)
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
  var messages = [];
//get user message table from db
  var capChat;
  var capMessage = {};
  return {
    messageList : function(){
      return messages;
    },
    clearCap: function(){
      capMessage = {};
    },
    capturedChatID: function(){
      return capChat;
    },
    captureMessages: function(){
      return capMessage;
    },
    makeChat: function(userId){
      $http({
        method: 'POST',
        url: '/auth/chat/add'+userId
      })
      .then(function(){});
    },
    getMessage : function(){
      $http({
        method: 'GET',
        url: '/auth/picture'
      }).then(function(response){
        console.log(response, 'response data')
        for(var x = 0; x < response.data.chats.length; x++){
          messages.push(response.data.chats[x]);
        }
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
        for(var i = 0; i < response.data.length; i++){
          capMessage[response.data[i].id] = response.data[i].text;
        }
      });
    },
    sendMessage: function(id, val){
      console.log(val);
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
    // getMessageContent: function(chatId){
    //   console.log('made it here in get message ocntent')
    //   $http({
    //     method: 'GET',
    //     url: '/auth/messages/get'+ chatId
    //   }).then(function(response){
    //     console.log(response.data, 'in the data content resp');
    //   });
    // }
  };
}])
.factory('Progress', ['$http', function($http){
  var strength = [];
  var weight = [];
  var speed = [];
  var bench = [];
  var dead = [];
  var squat = [];
  //all functions need integration with db
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
    getBnch : function(){
      return bench;
    },
    getDed : function(){
      return dead;
    },
    getSqu : function(){
      return squat;
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
    postSpd : function(stat1, stat2){
      var calcStat = ((stat1/stat2)*60);
      $http({
        method: 'POST',
        url: '/auth/speed/'+calcStat,
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
        console.log(response.data, 'this is the bench db query');
        if(bench.length === 0){
          for(var i = 0; i < response.data.length; i++){
            bench.push(response.data[i].benchpress);
          }
        }else{
          bench.push(response.data[response.data.length-1].benchpress);
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
          for(var i = 0; i < response.data.length; i++){
            dead.push(response.data[i].deadlift);
          }
        }else{
          dead.push(response.data[response.data.length-1].deadlift);
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
        if(squat.length === 0){
          for(var i = 0; i < response.data.length; i++){
            squat.push(response.data[i].squat);
          }
        }else{
          squat.push(response.data[response.data.length-1].squat);
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
          for(var i = 0; i < response.data.length; i++){
            speed.push(response.data[i].speed);
          }
        }else{
          speed.push(response.data[response.data.length-1].speed);
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
          for(var i = 0; i < response.data.length; i++){
            weight.push(response.data[i].weight);
          }
        }else{
          weight.push(response.data[response.data.length-1].weight);
        }
      }, function(error){
        console.log('Something went wrong : ', error);
      });
    }
  };
}])
.factory('Task', ['$http', function($http){
  var testTask = [
    {task: 'Task1', todo: 'Run a million miles'},
    {task: 'Task2', todo: 'Find the dragonballs'},
    {task: 'Task3', todo: 'Become Perfectly Huge'}
  ];
  return {
    finishTask : function(task){
      //UNCOMMENT FOR PRODUCTION
      $http({
        method: 'POST',
        url: '/auth/tasks',
      });
      console.log(task, 'clicked');
      testTask.splice(testTask.indexOf(task), 1);
    },
    getTask : function(){
      $http({
        method: 'GET',
        url: '/auth/tasks',
      }).then(function(response){
        tasks = response.data;
        testTask.push(tasks);
      });
    },
    taskFunc : function(){
      return testTask;
    }
  };
}]);
