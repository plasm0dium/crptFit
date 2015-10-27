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

  return {
    friendsList: function(){
      // Grab friends and store it in the friends array above (refactor - DRY)
      $http({
        method: 'GET',
        url: '/auth/friends'
      })
      .then(function(response){
        console.log(response.data)
        friends = response.data;
        console.log("FRIENDS :",response.data)
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
        url: 'auth/users/search' + username
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
    getSpd : function(){
      return speed;
    },
    getWgt : function(){
      return weight;
    },
    //all functions below here need to be tested and found working
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
